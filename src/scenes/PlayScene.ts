// The whole prototype in one scene: draw ink, press GO, watch the car, see the result.
//   edit:   the player draws; the car waits at the start
//   run:    the simulation steps at a fixed 60 Hz; no drawing
//   end:    short win or fail animation, then result panel (win) or back to edit (fail)
import Phaser from 'phaser';
import { app, BaseScene, burst, Button, DebugOverlay, floatText, icons, Panel, shapeImage, soundButton, toast, type ViewportInfo } from '@core';
import { LEVELS, levelById, nextLevel } from '../levels/index.ts';
import { dist } from '../logic/geom.ts';
import { finishStroke, forbidden, inkUsed, inkZones, snapPoint, type InkZones } from '../logic/ink.ts';
import { levelScore, starLimits } from '../logic/score.ts';
import type { LevelDef, Pt } from '../logic/types.ts';
import { drawHand, drawCandy } from '../render/art.ts';
import { goIcon, menuIcon, restartIcon, starIcon, stopIcon, trashIcon, undoIcon } from '../render/icons.ts';
import { C, TEXT } from '../render/palette.ts';
import { drawSky } from '../render/art.ts';
import { save } from '../save.ts';
import { Sim, type MatterLib, type Outcome } from '../sim/sim.ts';
import { INK, STEP_MS } from '../sim/tuning.ts';
import { CarView } from '../play/CarView.ts';
import { bake, bakeOnce, Field } from '../play/Field.ts';
import { InkLayer } from '../play/InkLayer.ts';
import { telemetry } from '../play/telemetry.ts';

type State = 'edit' | 'run' | 'end' | 'result';

interface Stroke {
  pts: Pt[];
  /** Strokes cut from one finger movement share a group, so undo removes them together. */
  group: number;
}

const params = new URLSearchParams(location.search);
const INK_TURN = params.has('inkturn');
/** Phaser's bundled Matter.js (the typings leave it out). tools/matter.ts loads the same files in Node. */
const MATTER = (Phaser.Physics.Matter as unknown as { Matter: MatterLib }).Matter;

export class PlayScene extends BaseScene {
  private level!: LevelDef;
  private zones!: InkZones;
  private field!: Field;
  private ink!: InkLayer;
  private car!: CarView;
  private bg!: Phaser.GameObjects.Image;
  private hud!: Phaser.GameObjects.Container;
  private jar!: import('../ui/InkJar.ts').InkJar;
  private title!: Phaser.GameObjects.Text;
  private candyText!: Phaser.GameObjects.Text;
  private candyIcon!: Phaser.GameObjects.Image;
  private goBtn!: Button;
  private undoBtn!: Button;
  private clearBtn!: Button;
  private menuBtn!: Button;
  private clearRing!: Phaser.GameObjects.Graphics;
  private coach: Phaser.GameObjects.GameObject[] = [];
  private coachText: Phaser.GameObjects.Text | null = null;
  /** Dark rounded backing behind the coach line, so it reads over the moon. */
  private coachPill: Phaser.GameObjects.Image | null = null;
  private loupe: Phaser.Cameras.Scene2D.Camera | null = null;
  private loupeFrame!: Phaser.GameObjects.Image;
  private previewDots: Phaser.GameObjects.Image[] = [];

  private state: State = 'edit';
  private strokes: Stroke[] = [];
  private group = 0;
  /** Points of the part being drawn, and whether a finger is down. */
  private cur: Pt[] | null = null;
  private drawing = false;
  private drawPointer = -1;
  private lastPoint: Pt | null = null;
  private outOfInkShown = false;
  private sim: Sim | null = null;
  private acc = 0;
  private levelStart = 0;
  private editStart = 0;
  private attempt = 0;
  private holdTimer: Phaser.Time.TimerEvent | null = null;
  private clearTween: Phaser.Tweens.Tween | null = null;
  private menu: Panel | null = null;
  private result: Panel | null = null;
  private runCandies: number[] = [];
  private simMs = 0;
  private titleTaps: number[] = [];

  constructor() {
    super('Play');
  }

  protected build() {
    const vp = app.viewport.info;
    this.bg = this.add.image(0, 0, '__DEFAULT').setOrigin(0);
    this.field = new Field(this);
    this.ink = new InkLayer(this, this.field.front);
    this.car = new CarView(this, this.field.front);
    this.hud = this.add.container(0, 0).setDepth(100);
    this.buildHud();
    this.loupeFrame = shapeImage(this, 0, 0, 'loupe', 220, 220, (g) => {
      g.lineStyle(8, C.outline, 1);
      g.strokeRoundedRect(-110, -110, 220, 220, 30);
      g.lineStyle(4, 0xffffff, 0.9);
      g.strokeRoundedRect(-106, -106, 212, 212, 26);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(0, 0, 4);
    });
    this.loupeFrame.setVisible(false).setDepth(300);

    this.input.on('pointerdown', (p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => this.onDown(p, over));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.onMove(p));
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onUp(p));
    this.input.on('pointerupoutside', (p: Phaser.Input.Pointer) => this.onUp(p));
    const kb = this.input.keyboard;
    kb?.on('keydown-SPACE', () => this.onGo());
    kb?.on('keydown-ENTER', () => this.onGo());
    kb?.on('keydown-Z', () => this.undo());
    kb?.on('keydown-R', () => this.clearAll());
    // P pauses, not Esc: Esc also leaves the browser's full screen (lesson from game #1, 19/10).
    kb?.on('keydown-P', () => (this.menu ? this.menu.close() : this.openMenu()));

    this.bakeBackground(vp);
    const start = Number(params.get('level')) || Number(/^#l(\d+)/.exec(location.hash)?.[1]) || save.data.level || 1;
    this.loadLevel(levelById(start).id);
    if (__TARGET__ === 'web') this.exposeTestHooks();
  }

  // ------------------------------------------------------------------ layout

  protected layout(vp: ViewportInfo) {
    const band = Field.viewBand(vp.portrait);
    let s: number;
    let fx: number;
    let fy: number;
    if (vp.portrait) {
      s = Math.min(vp.width / 720, vp.height / 1280);
      fx = (vp.width - 720 * s) / 2;
      fy = (vp.height - 1280 * s) / 2;
    } else {
      s = Math.min((vp.width * 0.52) / 720, vp.height / (band.bottom - band.top));
      fx = (vp.width - 720 * s) / 2;
      fy = vp.height / 2 - ((band.top + band.bottom) / 2) * s;
    }
    this.field.place(fx, fy, s);
    this.bakeBackground(vp);

    if (vp.portrait) {
      const at = (x: number, y: number) => this.field.toScreen([x, y]);
      const k = s;
      this.jar.setScale(k).setPosition(...at(330, 80));
      this.title.setScale(k).setOrigin(0, 0.5).setPosition(...at(186, 138));
      this.candyIcon.setScale(0.5 * k).setPosition(...at(470, 138));
      this.candyText.setScale(k).setOrigin(0, 0.5).setPosition(...at(492, 138));
      this.menuBtn.setScale(k).setPosition(...at(664, 70));
      this.undoBtn.setScale(k).setPosition(...at(86, 1206));
      this.clearBtn.setScale(k).setPosition(...at(210, 1206));
      this.goBtn.setScale(k).setPosition(...at(584, 1200));
    } else {
      const side = fx;
      const k = Math.min(1, (side - 40) / this.jar.fullWidth);
      const lx = side / 2;
      this.title.setScale(1).setOrigin(0.5).setPosition(lx, vp.height * 0.2);
      this.jar.setScale(k).setPosition(lx - 50 * k, vp.height * 0.2 + 80);
      this.candyIcon.setScale(0.5).setPosition(lx - 40, vp.height * 0.2 + 150);
      this.candyText.setScale(1).setOrigin(0, 0.5).setPosition(lx - 18, vp.height * 0.2 + 150);
      const rx = vp.width - side / 2;
      this.menuBtn.setScale(1).setPosition(vp.width - 70, 70);
      this.goBtn.setScale(1).setPosition(rx, vp.height - 140);
      this.undoBtn.setScale(1).setPosition(rx - 66, vp.height - 290);
      this.clearBtn.setScale(1).setPosition(rx + 66, vp.height - 290);
    }
    this.clearRing.setPosition(this.clearBtn.x, this.clearBtn.y).setScale(this.clearBtn.scaleX);
    this.placeCoach();
    if (this.loupe) this.hideLoupe();
  }

  private bakeBackground(vp: ViewportInfo) {
    const key = 'bg';
    const res = 0.5;
    bake(this, key, 0, 0, vp.width, vp.height, res, (g) => drawSky(g, 0, 0, vp.width, vp.height, null, 9));
    this.bg.setTexture(key).setScale(1 / res).setPosition(0, 0);
  }

  // ------------------------------------------------------------------ HUD

  private buildHud() {
    const { InkJar } = this.jarModule;
    this.jar = new InkJar(this, 300);
    this.title = this.text(0, 0, '', 30, TEXT.main);
    this.title.setStroke('#1c1430', 6);
    if (__TARGET__ === 'web') {
      // Phone testing: tap the level title 5 times to show the debug box (like game #1's Home title).
      this.title.setInteractive().on('pointerdown', () => {
        const now = this.time.now;
        this.titleTaps = [...this.titleTaps.filter((t) => now - t < 2500), now];
        if (this.titleTaps.length >= 5) {
          this.titleTaps = [];
          app.toggleDebug();
        }
      });
    }
    this.candyIcon = this.add.image(0, 0, bakeOnce(this, 'candyIcon', -30, -30, 60, 60, 2, (g) => drawCandy(g, 20, false)));
    this.candyText = this.text(0, 0, '', 30, TEXT.main);
    this.candyText.setStroke('#1c1430', 6);
    const surface = app.theme.surface;
    this.menuBtn = new Button(this, 0, 0, { icon: menuIcon, width: 88, height: 88, color: surface, textColor: '#ffffff', onClick: () => this.openMenu() });
    this.undoBtn = new Button(this, 0, 0, { icon: undoIcon, width: 108, height: 108, color: surface, textColor: '#ffffff', onClick: () => this.undo() });
    this.clearBtn = new Button(this, 0, 0, {
      icon: trashIcon,
      width: 108,
      height: 108,
      color: surface,
      textColor: '#ffffff',
      onClick: () => {
        if (this.strokes.length && this.clearTween) toast(this, app.t('game.holdToClear'), 1200);
      },
    });
    this.clearRing = this.add.graphics().setDepth(101);
    this.clearBtn.on('pointerdown', () => this.startClearHold());
    this.clearBtn.on('pointerup', () => this.cancelClearHold());
    this.clearBtn.on('pointerout', () => this.cancelClearHold());
    this.goBtn = new Button(this, 0, 0, { label: app.t('game.go'), icon: goIcon, width: 230, height: 120, fontSize: 50, onClick: () => this.onGo() });
    this.goBtn.on('pointerdown', () => this.startPreviewHold());
    this.goBtn.on('pointerout', () => this.clearPreview());
    this.hud.add([this.jar, this.title, this.candyIcon, this.candyText, this.menuBtn, this.undoBtn, this.clearBtn, this.goBtn, this.clearRing]);
  }

  // Loaded lazily to keep the import list above readable.
  private get jarModule() {
    return jarModule;
  }

  private refreshHud() {
    const used = this.usedInk();
    this.jar.setUsed(used);
    const run = this.state === 'run' || this.state === 'end';
    const got = run ? this.runCandies.length : 0;
    this.candyText.setText(`${got}/${this.level.candies.length}`);
    this.candyIcon.setVisible(this.level.candies.length > 0);
    this.candyText.setVisible(this.level.candies.length > 0);
    this.undoBtn.setEnabled(this.state === 'edit' && this.strokes.length > 0);
    this.clearBtn.setEnabled(this.state === 'edit' && this.strokes.length > 0);
  }

  private setGoMode(run: boolean) {
    this.goBtn.setLabel(run ? app.t('game.stop') : app.t('game.go'));
    this.goBtn.setIcon(run ? stopIcon : goIcon);
    this.goBtn.setColor(run ? app.theme.surface : app.theme.primary, run ? '#ffffff' : app.theme.primaryText);
  }

  // ------------------------------------------------------------------ level

  private loadLevel(id: number) {
    this.result?.destroy();
    this.result = null;
    const level = levelById(id);
    this.level = level;
    this.zones = inkZones(level);
    save.data.level = level.id;
    this.field.load(level, save.data.candy[level.id] ?? []);
    this.strokes = [];
    this.cur = null;
    this.drawing = false;
    this.ink.setStrokes([], this.field.res);
    this.ink.setLive(null);
    this.jar.setLevel(level.ink.par, level.ink.budget);
    this.title.setText(`${level.id}. ${level.name}`);
    this.attempt = 0;
    this.levelStart = this.time.now;
    this.toEdit();
    this.showCoach();
  }

  private toEdit() {
    this.state = 'edit';
    this.sim = null;
    this.runCandies = [];
    this.car.setStart(this.level.car.x, this.level.car.y, this.level.car.dir);
    this.field.resetCandies();
    this.setGoMode(false);
    this.editStart = this.time.now;
    this.outOfInkShown = false;
    this.refreshHud();
  }

  private usedInk() {
    const done = inkUsed(this.strokes.map((s) => s.pts));
    let live = 0;
    if (this.cur) for (let i = 1; i < this.cur.length; i++) live += dist(this.cur[i - 1], this.cur[i]);
    return done + live;
  }

  // ------------------------------------------------------------------ drawing

  private fieldPoint(p: Phaser.Input.Pointer): Pt {
    const w = this.cameras.main.getWorldPoint(p.x, p.y);
    return this.field.toField(w.x, w.y);
  }

  private onDown(p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) {
    if (this.coachCard) {
      this.dismissCard();
      return;
    }
    if (over.length || this.state !== 'edit' || this.drawing || this.menu || this.result) return;
    if (!app.gameplay.isActive) app.gameplay.start();
    this.hideCoachOnDraw();
    this.drawing = true;
    this.drawPointer = p.id;
    this.outOfInkShown = false;
    this.group++;
    const fp = this.fieldPoint(p);
    const snapped = snapPoint(fp, this.zones, this.strokes.map((s) => s.pts));
    const start = snapped && dist(snapped, fp) <= INK.snapRadius ? snapped : fp;
    this.lastPoint = start;
    this.cur = forbidden(start, this.zones) ? null : [start];
    if (this.usedInk() >= this.level.ink.budget - 0.5) {
      this.outOfInk();
      this.cur = null;
    }
    if (this.cur) app.audio.play('scratch', { volume: 0.5, pitchJitter: 200 });
    this.ink.setLive(this.cur, this.field.res);
    if (p.wasTouch) this.showLoupe(p);
    this.refreshHud();
  }

  private onMove(p: Phaser.Input.Pointer) {
    if (!this.drawing || p.id !== this.drawPointer || !this.lastPoint) return;
    if (p.wasTouch) this.showLoupe(p);
    const fp = this.fieldPoint(p);
    if (dist(this.lastPoint, fp) < INK.minSpacing) return;
    this.extendTo(fp);
    this.lastPoint = fp;
    this.ink.setLive(this.cur, this.field.res);
    this.refreshHud();
  }

  /** Adds the line from the last point to fp, cut where ink may not go, charged as it goes. */
  private extendTo(fp: Pt) {
    const from = this.lastPoint!;
    const d = dist(from, fp);
    const n = Math.max(1, Math.ceil(d / 3));
    for (let k = 1; k <= n; k++) {
      const q: Pt = [from[0] + ((fp[0] - from[0]) * k) / n, from[1] + ((fp[1] - from[1]) * k) / n];
      if (forbidden(q, this.zones)) {
        if (this.cur) this.finishPart(false);
        continue;
      }
      if (!this.cur) {
        this.cur = [q];
        continue;
      }
      const last = this.cur[this.cur.length - 1];
      const step = dist(last, q);
      const left = this.level.ink.budget - this.usedInk();
      if (step > left) {
        if (left > 0.5) {
          const f = left / step;
          this.cur.push([last[0] + (q[0] - last[0]) * f, last[1] + (q[1] - last[1]) * f]);
        }
        this.finishPart(false);
        this.outOfInk();
        this.drawing = false;
        return;
      }
      this.cur.push(q);
    }
  }

  private onUp(p: Phaser.Input.Pointer) {
    if (!this.drawing || p.id !== this.drawPointer) return;
    this.drawing = false;
    this.hideLoupe();
    if (this.cur && this.cur.length) {
      // The end snaps like the start, if the ink allows.
      const last = this.cur[this.cur.length - 1];
      const others = this.strokes.map((s) => s.pts);
      const snap = snapPoint(last, this.zones, others);
      if (snap && dist(snap, last) <= INK.snapRadius && this.usedInk() + dist(snap, last) <= this.level.ink.budget) this.extendToSnap(snap);
    }
    this.finishPart(true);
    this.ink.setLive(null);
    this.refreshHud();
    this.updateCoachAfterStroke();
  }

  private extendToSnap(snap: Pt) {
    const last = this.cur![this.cur!.length - 1];
    const n = Math.max(1, Math.ceil(dist(last, snap) / 3));
    for (let k = 1; k <= n; k++) {
      const q: Pt = [last[0] + ((snap[0] - last[0]) * k) / n, last[1] + ((snap[1] - last[1]) * k) / n];
      if (forbidden(q, this.zones)) return;
    }
    this.cur!.push(snap);
  }

  private finishPart(_touchEnded: boolean) {
    const pts = this.cur;
    this.cur = null;
    this.ink.setLive(null);
    if (!pts || pts.length < 2) return;
    const smooth = finishStroke(pts);
    if (inkUsed([smooth]) < INK.minLength) return;
    this.strokes.push({ pts: smooth, group: this.group });
    this.ink.setStrokes(
      this.strokes.map((s) => s.pts),
      this.field.res,
    );
  }

  private outOfInk() {
    if (this.outOfInkShown) return;
    this.outOfInkShown = true;
    this.jar.shake();
    toast(this, app.t('game.noInk'), 1200);
  }

  private undo() {
    if (this.state !== 'edit' || !this.strokes.length) return;
    const g = this.strokes[this.strokes.length - 1].group;
    this.strokes = this.strokes.filter((s) => s.group !== g);
    this.ink.setStrokes(
      this.strokes.map((s) => s.pts),
      this.field.res,
    );
    this.refreshHud();
  }

  private clearAll() {
    if (this.state !== 'edit' || !this.strokes.length) return;
    this.strokes = [];
    this.ink.setStrokes([], this.field.res);
    this.refreshHud();
  }

  private startClearHold() {
    if (this.state !== 'edit' || !this.strokes.length) return;
    const ring = this.clearRing;
    const prog = { v: 0 };
    this.clearTween?.stop();
    this.clearTween = this.tweens.add({
      targets: prog,
      v: 1,
      duration: 500,
      onUpdate: () => {
        ring.clear();
        ring.lineStyle(8, C.gold, 1);
        ring.beginPath();
        ring.arc(0, -4, 62, -Math.PI / 2, -Math.PI / 2 + prog.v * Math.PI * 2, false);
        ring.strokePath();
      },
      onComplete: () => {
        ring.clear();
        this.clearTween = null;
        this.clearAll();
        app.audio.play('boo', { volume: 0.4 });
      },
    });
  }

  private cancelClearHold() {
    if (!this.clearTween) return;
    // Let the click handler see that the hold was cut short, then forget it.
    this.time.delayedCall(0, () => {
      this.clearTween?.stop();
      this.clearTween = null;
      this.clearRing.clear();
    });
  }

  // ------------------------------------------------------------------ loupe

  private showLoupe(p: Phaser.Input.Pointer) {
    const cam = this.cameras.main;
    if (!this.loupe) {
      this.loupe = this.cameras.add(0, 0, 10, 10);
      this.loupe.ignore([this.hud, this.bg, this.loupeFrame]);
      this.loupe.setBackgroundColor(C.skyBottom);
    }
    const size = Math.round(220 * cam.zoom);
    const gx = Phaser.Math.Clamp(p.x - size / 2, 0, this.scale.width - size);
    const gy = p.y - size * 1.25 < 0 ? p.y + size * 0.35 : p.y - size * 1.25;
    // Inset so the frame drawn by the main camera stays visible around the zoomed view.
    const inset = Math.round(10 * cam.zoom);
    this.loupe.setViewport(Math.round(gx) + inset, Math.round(gy) + inset, size - inset * 2, size - inset * 2);
    this.loupe.setZoom(cam.zoom * 1.8);
    const w = cam.getWorldPoint(p.x, p.y);
    this.loupe.centerOn(w.x, w.y);
    this.loupe.setVisible(true);
    const fw = cam.getWorldPoint(gx + size / 2, gy + size / 2);
    this.loupeFrame.setPosition(fw.x, fw.y).setVisible(true);
  }

  private hideLoupe() {
    this.loupe?.setVisible(false);
    this.loupeFrame.setVisible(false);
  }

  // ------------------------------------------------------------------ run

  private onGo() {
    this.clearPreview();
    if (this.menu || this.result || this.coachCard) return;
    if (this.state === 'run') return this.stopRun();
    if (this.state !== 'edit' || this.drawing) return;
    if (!app.gameplay.isActive) app.gameplay.start();
    this.hideCoach();
    this.attempt++;
    this.sim = new Sim(
      MATTER,
      this.level,
      this.strokes.map((s) => s.pts),
      { inkTurn: INK_TURN },
    );
    this.car.capture(this.sim);
    this.car.capture(this.sim); // twice: no interpolation from the old pose
    this.acc = 0;
    this.runCandies = [];
    this.state = 'run';
    this.setGoMode(true);
    this.ink.flash();
    app.audio.play('go', { volume: 0.7 });
    this.refreshHud();
  }

  private stopRun() {
    if (!this.sim) return;
    this.logAttempt('stopped', this.sim.steps, 0);
    this.toEdit();
  }

  update(time: number, delta: number) {
    if (this.state === 'edit') {
      const t = (time - this.levelStart) / 1000;
      this.field.planks.forEach((v) => {
        const g = this.level.roads[v.road].ghost!;
        const cycle = g.on + g.off;
        const phase = (((t + (g.offset ?? 0)) % cycle) + cycle) % cycle;
        this.field.setPlank(v, phase < g.on);
      });
      this.car.idle(time, true);
      return;
    }
    if (this.state !== 'run' || !this.sim || this.menu) {
      this.car.idle(time, false);
      return;
    }
    const sim = this.sim;
    this.acc = Math.min(this.acc + delta, 200);
    let steps = 0;
    const t0 = performance.now();
    while (this.acc >= STEP_MS && steps < 6 && !sim.result) {
      sim.step();
      this.car.capture(sim);
      this.acc -= STEP_MS;
      steps++;
      for (const e of sim.events.splice(0)) this.onSimEvent(e);
    }
    if (__TARGET__ === 'web' && steps) {
      // Physics cost per fixed step, shown in the debug box (brief H5).
      this.simMs = this.simMs * 0.9 + ((performance.now() - t0) / steps) * 0.1;
      DebugOverlay.extra['sim ms/step'] = this.simMs.toFixed(2);
    }
    this.car.apply(Math.min(1, this.acc / STEP_MS));
    this.car.idle(time, false);
    this.field.planks.forEach((v, i) => this.field.setPlank(v, sim.ghostVisible(i)));
    if (sim.result) this.onRunEnd(sim.result.outcome);
  }

  private onSimEvent(e: { type: string; index?: number; x?: number; y?: number }) {
    if (e.type === 'candy' && e.index !== undefined) {
      this.runCandies.push(e.index);
      const img = this.field.candies[e.index];
      this.tweens.killTweensOf(img);
      burst(this, ...this.field.toScreen([img.x, img.y]), C.candy, 12, 380);
      this.tweens.add({ targets: img, scale: 0.9, alpha: 0, duration: 260, ease: 'Back.Out' });
      app.audio.play('pop');
      app.haptic(10);
      this.refreshHud();
    } else if (e.type === 'turn') {
      app.audio.play('turn', { volume: 0.6 });
    }
  }

  private onRunEnd(outcome: Outcome) {
    const sim = this.sim!;
    this.state = 'end';
    if (outcome === 'win') {
      const used = this.usedInk();
      const sc = levelScore(used, this.level.ink.par, this.level.ink.budget, this.runCandies.length);
      this.logAttempt('win', sim.steps, sc.stars);
      app.gameplay.stop();
      this.setGoMode(false);
      const { house } = this.level;
      this.car.enterHouse(house.x, house.y);
      app.audio.play('win');
      app.haptic(30);
      const door = this.field.toScreen([house.x, house.y - 30]);
      burst(this, door[0], door[1], C.window, 26, 520);
      this.time.delayedCall(180, () => burst(this, door[0], door[1] - 40, C.candy, 18, 600));
      this.time.delayedCall(360, () => burst(this, door[0], door[1] - 20, C.ink, 18, 560));
      // Best result and candies ever found
      const id = String(this.level.id);
      const prev = save.data.best[id];
      if (!prev || sc.total > prev.score || sc.stars > prev.stars) {
        save.data.best[id] = { stars: Math.max(sc.stars, prev?.stars ?? 0), score: Math.max(sc.total, prev?.score ?? 0), ink: Math.round(prev ? Math.min(prev.ink, used) : used) };
      }
      const found = new Set([...(save.data.candy[id] ?? []), ...this.runCandies]);
      save.data.candy[id] = [...found].sort();
      if (this.level.tutorial && !save.data.tutorial.includes(this.level.tutorial)) save.data.tutorial.push(this.level.tutorial);
      save.flush();
      this.time.delayedCall(750, () => this.showResult(used, sc));
    } else {
      this.logAttempt(outcome, sim.steps, 0);
      const pos = this.car.position;
      const band = Field.viewBand(app.viewport.info.portrait);
      const fp: Pt = [Phaser.Math.Clamp(pos[0], 40, 680), Phaser.Math.Clamp(pos[1], band.top + 80, band.bottom - 60)];
      const sp = this.field.toScreen(fp);
      burst(this, sp[0], sp[1], 0xffffff, 22, 300);
      floatText(this, sp[0], sp[1] - 30, app.t('game.boo'), { size: 64, color: '#ffffff', rise: 90, durationMs: 900, font: app.theme.font });
      floatText(this, sp[0], sp[1] + 40, app.t(`game.why.${outcome}`), { size: 28, color: TEXT.dim, rise: 50, durationMs: 1000, font: app.theme.font });
      app.audio.play('boo');
      this.car.hide();
      this.time.delayedCall(650, () => {
        if (this.state === 'end') this.toEdit();
      });
    }
  }

  private logAttempt(outcome: string, steps: number, stars: number) {
    telemetry.add({
      level: this.level.id,
      attempt: this.attempt,
      strokes: this.strokes.length,
      ink: Math.round(this.usedInk()),
      par: this.level.ink.par,
      budget: this.level.ink.budget,
      drawSec: Math.round((this.time.now - this.editStart) / 100) / 10,
      runSec: Math.round((steps / 60) * 10) / 10,
      outcome,
      candies: this.runCandies.length,
      stars,
    });
  }

  // ------------------------------------------------------------------ hold GO: jump preview

  private startPreviewHold() {
    if (!this.level.preview || this.state !== 'edit') return;
    this.holdTimer?.remove();
    this.holdTimer = this.time.delayedCall(250, () => this.showPreview());
  }

  private showPreview() {
    const sim = new Sim(
      MATTER,
      this.level,
      this.strokes.map((s) => s.pts),
    );
    const arc: Pt[] = [];
    let wasGround = false;
    let air = 0;
    for (let i = 0; i < 360 && !sim.result; i++) {
      sim.step();
      if (sim.grounded) {
        if (air > 6) break;
        wasGround = true;
        air = 0;
        arc.length = 0;
      } else if (wasGround) {
        air++;
        if (air % 3 === 0) arc.push([sim.chassis.position.x, sim.chassis.position.y]);
      }
    }
    this.clearPreview();
    const key = bakeOnce(this, 'pdot', -8, -8, 16, 16, 2, (g) => {
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(0, 0, 5);
    });
    arc.forEach((p, i) => {
      const img = this.add.image(p[0], p[1], key).setScale(0.5).setAlpha(1 - i / (arc.length + 4));
      this.field.fx.add(img);
      this.previewDots.push(img);
    });
  }

  private clearPreview() {
    this.holdTimer?.remove();
    this.holdTimer = null;
    for (const d of this.previewDots) d.destroy();
    this.previewDots = [];
  }

  // ------------------------------------------------------------------ result

  private showResult(used: number, sc: { ink: number; total: number; stars: 1 | 2 | 3 }) {
    this.state = 'result';
    const level = this.level;
    const next = nextLevel(level.id);
    const panel = new Panel(this, { title: app.t('game.levelClear'), width: 620, height: 820, closable: false });
    this.result = panel;
    // Landscape screens are only 720 units tall: the panel shrinks, so the rows close up and the two
    // buttons sit side by side.
    const compact = panel.panelHeight < 800;
    const y = compact ? { star: 30, score: 105, jar: 185, msg: 240, candy: 282 } : { star: 50, score: 150, jar: 250, msg: 320, candy: 370 };
    const c = panel.content;
    const top = panel.top;
    for (let i = 0; i < 3; i++) {
      const on = i < sc.stars;
      const st = shapeImage(this, (i - 1) * 120, top + y.star - (i === 1 ? 18 : 0), `star100|${on}`, 100, 100, (g) => starIcon(g, 100, on ? C.gold : 0x4a4270));
      const full = st.scaleX * (compact ? 0.85 : 1);
      st.setScale(0);
      c.add(st);
      this.tweens.add({ targets: st, scale: full, delay: 200 + i * 180, duration: 320, ease: 'Back.Out', onStart: () => on && app.audio.play('pop', { detune: i * 300 }) });
    }
    c.add(this.text(0, top + y.score, app.t('game.score', { n: sc.total.toLocaleString('en-US') }), 44, TEXT.gold).setOrigin(0.5));
    const { InkJar } = jarModule;
    const jar = new InkJar(this, 300);
    jar.setLevel(level.ink.par, level.ink.budget);
    jar.setUsed(used);
    jar.setPosition(-50, top + y.jar);
    c.add(jar);
    const lim = starLimits(level.ink.par, level.ink.budget);
    const msg = sc.stars === 3 ? app.t('game.perfectInk') : sc.stars === 2 ? app.t('game.lessInk', { n: Math.ceil(used - lim.three) }) : app.t('game.lessInk2', { n: Math.ceil(used - lim.two) });
    c.add(this.text(0, top + y.msg, msg, 30, TEXT.main, '700').setOrigin(0.5));
    if (level.candies.length) c.add(this.text(0, top + y.candy, app.t('game.candy', { n: this.runCandies.length, m: level.candies.length }), 30, TEXT.dim, '700').setOrigin(0.5));
    const replay = (x: number, yy: number, w: number) =>
      new Button(this, x, yy, { label: app.t('game.replay'), icon: restartIcon, width: w, height: 84, fontSize: 34, color: app.theme.surface, textColor: '#ffffff', onClick: () => this.loadLevel(level.id) });
    if (next) {
      const go = () => this.loadLevel(next.id);
      if (compact) {
        c.add(new Button(this, 95, panel.bottom - 80, { label: app.t('game.next'), icon: goIcon, width: 330, height: 108, fontSize: 46, onClick: go }));
        c.add(replay(-178, panel.bottom - 80, 210));
      } else {
        c.add(new Button(this, 0, panel.bottom - 190, { label: app.t('game.next'), icon: goIcon, width: 400, height: 116, fontSize: 48, onClick: go }));
        c.add(replay(0, panel.bottom - 70, 300));
      }
    } else {
      c.add(this.text(0, top + y.candy + (compact ? 50 : 80), app.t('game.allDone'), 28, TEXT.dim, '700').setOrigin(0.5).setWordWrapWidth(520).setAlign('center'));
      c.add(new Button(this, compact ? 110 : 0, panel.bottom - (compact ? 80 : 130), { label: app.t('game.levels'), width: compact ? 290 : 360, height: 96, fontSize: 38, onClick: () => this.openMenu() }));
      if (compact) c.add(replay(-170, panel.bottom - 80, 220));
    }
  }

  // ------------------------------------------------------------------ menu

  private openMenu() {
    if (this.menu) return;
    app.gameplay.stop();
    this.clearPreview();
    const panel = new Panel(this, {
      title: app.t('game.paused'),
      width: 620,
      height: 860,
      onClose: () => {
        this.menu = null;
        if (this.state === 'run' || this.strokes.length) app.gameplay.start();
      },
    });
    this.menu = panel;
    const c = panel.content;
    const top = panel.top;
    const compact = panel.panelHeight < 840;
    const restart = () => {
      panel.close();
      this.loadLevel(this.level.id);
    };
    if (compact) {
      c.add(new Button(this, -128, top + 20, { label: app.t('core.resume'), icon: icons.playIcon, width: 300, height: 96, fontSize: 38, onClick: () => panel.close() }));
      c.add(new Button(this, 160, top + 20, { label: app.t('game.restartShort'), icon: restartIcon, width: 240, height: 96, fontSize: 32, color: app.theme.surface, textColor: '#ffffff', onClick: restart }));
    } else {
      c.add(new Button(this, 0, top + 40, { label: app.t('core.resume'), icon: icons.playIcon, width: 420, height: 104, fontSize: 42, onClick: () => panel.close() }));
      c.add(new Button(this, 0, top + 160, { label: app.t('game.restart'), icon: restartIcon, width: 420, height: 92, fontSize: 34, color: app.theme.surface, textColor: '#ffffff', onClick: restart }));
    }
    const gy = compact ? { label: 100, row0: 170, row: 118, star: 56 } : { label: 250, row0: 330, row: 140, star: 62 };
    c.add(this.text(0, top + gy.label, app.t('game.levels'), 30, TEXT.dim, '700').setOrigin(0.5));
    LEVELS.forEach((l, i) => {
      const x = ((i % 3) - 1) * 160;
      const y = top + gy.row0 + Math.floor(i / 3) * gy.row;
      const best = save.data.best[l.id];
      c.add(
        new Button(this, x, y, {
          label: String(l.id),
          width: 120,
          height: compact ? 88 : 96,
          fontSize: 40,
          color: l.id === this.level.id ? app.theme.primary : app.theme.surface,
          textColor: l.id === this.level.id ? app.theme.primaryText : '#ffffff',
          onClick: () => {
            panel.close();
            this.loadLevel(l.id);
          },
        }),
      );
      for (let k = 0; k < 3; k++) {
        const on = !!best && k < best.stars;
        c.add(shapeImage(this, x - 30 + k * 30, y + gy.star, `star26|${on}`, 26, 26, (g) => starIcon(g, 26, on ? C.gold : 0x4a4270)));
      }
    });
    const by = panel.bottom - (compact ? 62 : 90);
    c.add(soundButton(this, -110, by, compact ? 80 : 88));
    if (__TARGET__ === 'web') {
      c.add(
        new Button(this, 90, by, {
          label: app.t('game.exportLog'),
          width: 300,
          height: compact ? 80 : 88,
          fontSize: 28,
          color: app.theme.surface,
          textColor: '#ffffff',
          onClick: () => {
            // Copy first: artifact pages block downloads, but the clipboard works from a tap. The
            // tester pastes the CSV into a note or a chat. Plain browsers also get the file.
            const n = telemetry.rows.length;
            const saved = () => toast(this, app.t('game.logSaved', { n }), 1800);
            navigator.clipboard
              ?.writeText(telemetry.csv())
              .then(() => toast(this, app.t('game.logCopied', { n }), 1800))
              .catch(() => {
                telemetry.download();
                saved();
              }) ?? (telemetry.download(), saved());
          },
        }),
      );
    }
  }

  // ------------------------------------------------------------------ coach (tutorial hints, v0 section 8.2)

  private coachCard: Phaser.GameObjects.Container | null = null;

  private showCoach() {
    this.hideCoach();
    const kind = this.level.tutorial;
    if (!kind) return;
    const seen = save.data.tutorial.includes(kind);
    if (seen && kind !== 'ghost') return;
    if (kind === 'ghost') {
      if (!seen) this.showCard(app.t('game.tip.ghost'), app.t('game.tip.ghostSub'));
      return;
    }
    const tip = app.t(`game.tip.${kind}`);
    this.coachText = this.text(0, 0, tip, 40, TEXT.main).setOrigin(0.5).setStroke('#1c1430', 8).setDepth(150);
    this.tweens.add({ targets: this.coachText, scale: 1.06, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.coach.push(this.coachText);
    if (kind === 'draw' || kind === 'jump') {
      const line = kind === 'draw' ? [this.level.gaps[0].a, this.level.gaps[0].b] : this.level.solution[0];
      this.handDemo(line as Pt[]);
    }
    if (kind === 'multi') for (const h of this.field.hints) this.coachPulse(h);
    if (kind === 'candy') for (const cd of this.field.candies) this.coachPulse(cd);
    if (kind === 'par') {
      this.jar.pulseGold();
      this.jar.shake();
    }
    this.placeCoach();
  }

  private coachPulse(target: Phaser.GameObjects.GameObject) {
    const tw = this.tweens.add({ targets: target, alpha: 1, duration: 420, yoyo: true, repeat: 6 });
    this.coach.push({ destroy: () => tw.stop() } as unknown as Phaser.GameObjects.GameObject);
  }

  private handDemo(line: Pt[]) {
    const key = bakeOnce(this, 'hand', -30, -10, 60, 80, 2, (g) => drawHand(g));
    const hand = this.add.image(0, 0, key).setOrigin(0.5, 10 / 80).setScale(0.5).setDepth(5);
    this.field.fx.add(hand);
    const trail = this.add.graphics();
    this.field.fx.add(trail);
    const prog = { t: 0 };
    const total = line.length - 1;
    const tw = this.tweens.add({
      targets: prog,
      t: 1,
      duration: 1400,
      repeat: -1,
      repeatDelay: 500,
      onUpdate: () => {
        const f = prog.t * total;
        const i = Math.min(total - 1, Math.floor(f));
        const a = line[i];
        const b = line[i + 1];
        const u = f - i;
        const x = a[0] + (b[0] - a[0]) * u;
        const y = a[1] + (b[1] - a[1]) * u;
        hand.setPosition(x + 6, y + 6);
        trail.clear();
        trail.fillStyle(C.ink, 0.7);
        const steps = Math.max(1, Math.floor(prog.t * 24));
        for (let k = 0; k <= steps; k++) {
          const ff = (k / 24) * total;
          const ii = Math.min(total - 1, Math.floor(ff));
          const uu = ff - ii;
          trail.fillCircle(line[ii][0] + (line[ii + 1][0] - line[ii][0]) * uu, line[ii][1] + (line[ii + 1][1] - line[ii][1]) * uu, 5);
        }
      },
    });
    this.coach.push(hand, trail, { destroy: () => tw.stop() } as unknown as Phaser.GameObjects.GameObject);
  }

  private showCard(title: string, sub: string) {
    const vp = app.viewport.info;
    const box = this.add.container(vp.width / 2, vp.height / 2).setDepth(400);
    const dim = this.add.rectangle(0, 0, vp.width * 2, vp.height * 2, 0x000000, 0.55);
    const panel = shapeImage(this, 0, 0, 'card', 560, 300, (g) => {
      g.fillStyle(C.outline, 1);
      g.fillRoundedRect(-284, -154, 568, 308, 36);
      g.fillStyle(app.theme.surface, 1);
      g.fillRoundedRect(-280, -150, 560, 300, 32);
    });
    const plankA = this.add.image(-60, -10, this.field.planks[0]?.solid.texture.key ?? '__DEFAULT').setScale(0.35);
    const t1 = this.text(0, -100, title, 46, TEXT.main).setOrigin(0.5);
    const t2 = this.text(0, 60, sub, 32, TEXT.dim, '700').setOrigin(0.5);
    const t3 = this.text(0, 115, app.t('game.tip.tapToStart'), 26, TEXT.gold, '700').setOrigin(0.5);
    box.add([dim, panel, plankA, t1, t2, t3]);
    this.tweens.add({ targets: plankA, alpha: 0.15, duration: 600, yoyo: true, repeat: -1, ease: 'Stepped' });
    this.coachCard = box;
    this.time.delayedCall(3500, () => this.dismissCard());
  }

  private dismissCard() {
    if (!this.coachCard) return;
    const card = this.coachCard;
    this.coachCard = null;
    this.tweens.add({ targets: card, alpha: 0, duration: 200, onComplete: () => card.destroy() });
    if (!save.data.tutorial.includes('ghost')) save.data.tutorial.push('ghost');
    this.levelStart = this.time.now;
  }

  private placeCoach() {
    if (!this.coachText) return;
    const vp = app.viewport.info;
    const [x, y] = this.field.toScreen([360, vp.portrait ? 250 : 230]);
    this.coachText.setPosition(x, y).setWordWrapWidth(640 * this.field.s).setAlign('center');
    const w = Math.ceil((this.coachText.width + 48) / 16) * 16;
    const h = Math.ceil((this.coachText.height + 20) / 16) * 16;
    this.coachPill?.destroy();
    this.coachPill = shapeImage(this, x, y, `coachPill|${w}|${h}`, w, h, (g) => {
      g.fillStyle(0x140f2c, 0.72);
      g.fillRoundedRect(-w / 2, -h / 2, w, h, Math.min(36, h / 2));
    }).setDepth(149);
  }

  private hideCoachOnDraw() {
    const kind = this.level.tutorial;
    if (kind === 'par') return; // stays until GO
    if (kind === 'draw' && this.coachText) this.hideCoach();
    else this.hideCoach();
  }

  private updateCoachAfterStroke() {
    if (this.level.tutorial === 'draw' && !save.data.tutorial.includes('draw') && this.strokes.length) {
      this.hideCoach();
      this.coachText = this.text(0, 0, app.t('game.tip.go'), 44, TEXT.gold).setOrigin(0.5).setStroke('#1c1430', 8).setDepth(150);
      this.coach.push(this.coachText);
      this.placeCoach();
      const tw = this.tweens.add({ targets: this.goBtn, scale: this.goBtn.scaleX * 1.08, duration: 360, yoyo: true, repeat: -1 });
      this.coach.push({ destroy: () => { tw.stop(); this.layout(app.viewport.info); } } as unknown as Phaser.GameObjects.GameObject);
    }
  }

  private hideCoach() {
    const list = this.coach;
    this.coach = [];
    this.coachText = null;
    this.coachPill?.destroy();
    this.coachPill = null;
    for (const o of list) o.destroy();
    for (const h of this.field.hints) h.setAlpha(0.55 * (this.level?.hintAlpha ?? 1));
    for (const cd of this.field.candies) cd.setAlpha(1);
  }

  // ------------------------------------------------------------------ test hooks (web build)

  private exposeTestHooks() {
    const scene = this;
    (window as unknown as Record<string, unknown>).__ink = {
      get state() {
        return scene.state;
      },
      get level() {
        return scene.level.id;
      },
      get strokes() {
        return scene.strokes.map((s) => s.pts);
      },
      get used() {
        return scene.usedInk();
      },
      /** Why GO might be ignored right now (bot debugging). */
      get blockers() {
        return { drawing: scene.drawing, menu: !!scene.menu, result: !!scene.result, card: !!scene.coachCard };
      },
      get result() {
        return scene.sim?.result ?? null;
      },
      loadLevel: (id: number) => scene.loadLevel(id),
      /** Field point to page (client) coordinates, for a bot that drives the real pointer. */
      toClient: (x: number, y: number) => {
        const vp = app.viewport.info;
        const d = scene.field.toScreen([x, y]);
        const rect = scene.game.canvas.getBoundingClientRect();
        return [rect.left + (d[0] * vp.scale) / vp.dpr, rect.top + (d[1] * vp.scale) / vp.dpr];
      },
      buttonClient: (name: 'go' | 'undo' | 'clear' | 'menu') => {
        const b = { go: scene.goBtn, undo: scene.undoBtn, clear: scene.clearBtn, menu: scene.menuBtn }[name];
        const vp = app.viewport.info;
        const rect = scene.game.canvas.getBoundingClientRect();
        return [rect.left + (b.x * vp.scale) / vp.dpr, rect.top + (b.y * vp.scale) / vp.dpr];
      },
      telemetry,
    };
  }
}

// The jar module is imported at the bottom so the class above reads top-down.
import * as jarModule from '../ui/InkJar.ts';
