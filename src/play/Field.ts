// The level on screen: a container in field units (720 x 1280) placed and scaled into the
// viewport. Static art is drawn once into one texture; planks, candies and hints are images.
import Phaser from 'phaser';
import { app } from '@core';
import { batHeading, batPos, LANTERN_R, MIRROR_H, MIRROR_HW, PUMPKIN_R } from '../logic/mech.ts';
import type { LevelDef, Pt } from '../logic/types.ts';
import { drawBlock, drawCandy, drawHouse, drawPlank, drawPlankGhost, drawRoad, drawSky, drawWall } from '../render/art.ts';
import { drawBat, drawBatPath, drawBouncePumpkin, drawFog, drawGate, drawLantern, drawMirror, MIRROR_COLORS } from '../render/mechArt.ts';
import { C } from '../render/palette.ts';
import { FIELD_H, FIELD_W } from '../sim/tuning.ts';

let bakeCount = 0;

/** Draws into a texture of w x h field units at res pixels per unit. (0,0) of the drawing = (x0, y0). */
export function bake(scene: Phaser.Scene, key: string, x0: number, y0: number, w: number, h: number, res: number, draw: (g: Phaser.GameObjects.Graphics) => void) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const g = scene.make.graphics({}, false);
  g.scaleCanvas(res, res);
  g.translateCanvas(-x0, -y0);
  draw(g);
  g.generateTexture(key, Math.ceil(w * res), Math.ceil(h * res));
  g.destroy();
  return key;
}

/**
 * Like bake, but keeps a texture that already exists. For drawings that never change (candy, planks
 * of one width, icons): re-baking a key that an image on screen still uses would leave that image
 * without a texture.
 */
export function bakeOnce(scene: Phaser.Scene, key: string, x0: number, y0: number, w: number, h: number, res: number, draw: (g: Phaser.GameObjects.Graphics) => void) {
  return scene.textures.exists(key) ? key : bake(scene, key, x0, y0, w, h, res, draw);
}

export interface PlankView {
  road: number;
  solid: Phaser.GameObjects.Image;
  ghost: Phaser.GameObjects.Image;
  shown: boolean;
}

export class Field {
  readonly root: Phaser.GameObjects.Container;
  /** Layers inside root, back to front. */
  readonly back: Phaser.GameObjects.Container;
  readonly mid: Phaser.GameObjects.Container;
  readonly front: Phaser.GameObjects.Container;
  /** In front of the car and the ink: fog and bats. */
  readonly over: Phaser.GameObjects.Container;
  readonly fx: Phaser.GameObjects.Container;
  /** Screen placement: field point p is at (x + p.x * s, y + p.y * s) in design units. */
  x = 0;
  y = 0;
  s = 1;
  /** Pixels per field unit of the textures baked now. */
  res = 1;
  planks: PlankView[] = [];
  candies: Phaser.GameObjects.Image[] = [];
  hints: Phaser.GameObjects.Graphics[] = [];
  bats: Phaser.GameObjects.Image[] = [];
  pumpkins: Phaser.GameObjects.Image[] = [];
  mirrors: { a: Phaser.GameObjects.Image; b: Phaser.GameObjects.Image }[] = [];
  lanterns: Phaser.GameObjects.Image[] = [];
  gates: Phaser.GameObjects.Image[] = [];
  private batFrame = -1;
  private staticImg: Phaser.GameObjects.Image | null = null;
  private level: LevelDef | null = null;
  private id = ++bakeCount;

  constructor(private scene: Phaser.Scene) {
    this.root = scene.add.container(0, 0);
    this.back = scene.add.container(0, 0);
    this.mid = scene.add.container(0, 0);
    this.front = scene.add.container(0, 0);
    this.over = scene.add.container(0, 0);
    this.fx = scene.add.container(0, 0);
    this.root.add([this.back, this.mid, this.front, this.over, this.fx]);
  }

  /** Field units visible on screen: the whole field in portrait, the play band in landscape. */
  static viewBand(portrait: boolean) {
    return portrait ? { top: 0, bottom: FIELD_H } : { top: 150, bottom: 1140 };
  }

  place(x: number, y: number, s: number) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.root.setPosition(x, y).setScale(s);
    const want = Phaser.Math.Clamp(Math.ceil(s * app.viewport.info.scale * 4) / 4, 0.75, 2);
    if (this.level && Math.abs(want - this.res) > 0.24) {
      this.res = want;
      this.bakeStatic();
    } else this.res = want;
  }

  toScreen(p: Pt): Pt {
    return [this.x + p[0] * this.s, this.y + p[1] * this.s];
  }

  toField(x: number, y: number): Pt {
    return [(x - this.x) / this.s, (y - this.y) / this.s];
  }

  load(level: LevelDef, collectedBefore: number[]) {
    this.level = level;
    for (const list of [this.back, this.mid, this.over]) list.removeAll(true);
    this.staticImg = null;
    this.planks = [];
    this.candies = [];
    this.hints = [];
    this.bats = [];
    this.pumpkins = [];
    this.mirrors = [];
    this.lanterns = [];
    this.gates = [];
    this.batFrame = -1;
    this.bakeStatic();

    // Gap hints: dotted line between the two edges (v0 section 3.2). They fade from level 10.
    for (const gap of level.gaps) {
      const g = this.scene.add.graphics();
      const [ax, ay] = gap.a;
      const [bx, by] = gap.b;
      const len = Math.hypot(bx - ax, by - ay);
      const n = Math.max(2, Math.round(len / 16));
      g.fillStyle(C.hint, 1);
      for (let i = 0; i <= n; i++) g.fillCircle(ax + ((bx - ax) * i) / n, ay - 2 + ((by - ay) * i) / n, 3.2);
      g.setAlpha(0.55 * (level.hintAlpha ?? 1));
      this.mid.add(g);
      this.hints.push(g);
    }

    // Ghost planks
    level.roads.forEach((road, i) => {
      if (!road.ghost) return;
      const [a, b] = [road.pts[0], road.pts[road.pts.length - 1]];
      const w = b[0] - a[0];
      const solidKey = bakeOnce(this.scene, `plank${w}`, -6, -6, w + 12, 40, 2, (g) => drawPlank(g, w));
      const ghostKey = bakeOnce(this.scene, `plankg${w}`, -6, -6, w + 12, 40, 2, (g) => drawPlankGhost(g, w));
      const solid = this.scene.add.image(a[0] - 6, a[1] - 6, solidKey).setOrigin(0).setScale(0.5);
      const ghost = this.scene.add.image(a[0] - 6, a[1] - 6, ghostKey).setOrigin(0).setScale(0.5).setAlpha(0);
      this.mid.add([ghost, solid]);
      this.planks.push({ road: i, solid, ghost, shown: true });
    });

    this.loadMechanics(level);

    // Candies
    level.candies.forEach((p, i) => {
      const gold = !collectedBefore.includes(i);
      const key = bakeOnce(this.scene, gold ? 'candyGold' : 'candy', -30, -30, 60, 60, 2, (g) => drawCandy(g, 20, gold));
      const img = this.scene.add.image(p[0], p[1], key).setScale(0.5);
      this.mid.add(img);
      this.candies.push(img);
      this.scene.tweens.add({ targets: img, y: p[1] - 7, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });
  }

  /** Fog, bats, pumpkins, mirrors, lanterns and gates (levels 6 to 20). */
  private loadMechanics(level: LevelDef) {
    const sc = this.scene;
    (level.fog ?? []).forEach((f, i) => {
      const key = bake(sc, `fog${this.id}_${i}`, -20, -20, f.w + 40, f.h + 40, 1.5, (g) => drawFog(g, f, level.id * 7 + i));
      const img = sc.add.image(f.x - 20, f.y - 20, key).setOrigin(0).setScale(1 / 1.5).setAlpha(0.9);
      this.over.add(img);
      sc.tweens.add({ targets: img, x: f.x - 14, duration: 2600 + i * 400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });
    (level.pumpkins ?? []).forEach((p) => {
      const key = bakeOnce(sc, 'bouncePumpkin', -PUMPKIN_R - 8, -PUMPKIN_R * 2 - 24, PUMPKIN_R * 2 + 16, PUMPKIN_R * 2 + 30, 2, drawBouncePumpkin);
      const img = sc.add.image(p.x, p.y, key).setOrigin(0.5, (PUMPKIN_R * 2 + 24) / (PUMPKIN_R * 2 + 30)).setScale(0.5);
      this.mid.add(img);
      this.pumpkins.push(img);
    });
    (level.mirrors ?? []).forEach((m, i) => {
      const color = MIRROR_COLORS[i % MIRROR_COLORS.length];
      const mk = (at: Pt, entry: boolean) => {
        const key = bakeOnce(sc, `mirror${i % MIRROR_COLORS.length}${entry ? 'in' : 'out'}`, -MIRROR_HW - 6, -MIRROR_H - 6, MIRROR_HW * 2 + 12, MIRROR_H + 10, 2, (g) => drawMirror(g, color, entry));
        const img = sc.add.image(at[0], at[1], key).setOrigin(0.5, (MIRROR_H + 6) / (MIRROR_H + 10)).setScale(0.5);
        this.mid.add(img);
        return img;
      };
      this.mirrors.push({ a: mk(m.a, true), b: mk(m.b, false) });
    });
    (level.gates ?? []).forEach((gt) => {
      const color = MIRROR_COLORS[1];
      const key = bakeOnce(sc, `gate${gt.w}x${gt.h}`, -4, -4, gt.w + 8, gt.h + 8, 2, (g) => drawGate(g, gt, color));
      const img = sc.add.image(gt.x - 4, gt.y - 4, key).setOrigin(0).setScale(0.5);
      this.mid.add(img);
      this.gates.push(img);
    });
    (level.lanterns ?? []).forEach((ln) => {
      bakeOnce(sc, 'lantern1', -48, -50, 96, 100, 2, (g) => drawLantern(g, true));
      const key = bakeOnce(sc, 'lantern0', -48, -50, 96, 100, 2, (g) => drawLantern(g, false));
      const img = sc.add.image(ln.x, ln.y, key).setOrigin(48 / 96, 50 / 100).setScale(0.5);
      this.mid.add(img);
      this.lanterns.push(img);
      sc.tweens.add({ targets: img, angle: 4, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });
    (level.bats ?? []).forEach(() => {
      bakeOnce(sc, 'bat1', -40, -32, 80, 56, 2, (g) => drawBat(g, true));
      const key = bakeOnce(sc, 'bat0', -40, -32, 80, 56, 2, (g) => drawBat(g, false));
      const img = sc.add.image(0, 0, key).setOrigin(0.5, 32 / 56).setScale(0.5);
      this.over.add(img);
      this.bats.push(img);
    });
    this.setMechTime(0);
  }

  /** Bats at time t (seconds since GO, or since the level opened while drawing). */
  setMechTime(t: number) {
    const bats = this.level?.bats ?? [];
    const frame = Math.floor(t * 8) % 2;
    bats.forEach((b, i) => {
      const img = this.bats[i];
      if (!img) return;
      const p = batPos(b, t);
      img.setPosition(p[0], p[1]);
      const h = batHeading(b, t);
      const dx = (b.b[0] - b.a[0]) * h;
      if (Math.abs(dx) > 1) img.setFlipX(dx < 0);
      if (frame !== this.batFrame) img.setTexture(frame ? 'bat1' : 'bat0');
    });
    this.batFrame = frame;
  }

  /** A pumpkin threw the car: it squashes and springs back. */
  bounce(i: number) {
    const img = this.pumpkins[i];
    if (!img) return;
    this.scene.tweens.killTweensOf(img);
    img.setScale(0.62, 0.38);
    this.scene.tweens.add({ targets: img, scaleX: 0.5, scaleY: 0.5, duration: 420, ease: 'Elastic.Out' });
  }

  /** The car went into mirror pair i: both mirrors flash. */
  mirrorFlash(i: number) {
    const m = this.mirrors[i];
    if (!m) return;
    for (const img of [m.a, m.b]) {
      this.scene.tweens.killTweensOf(img);
      img.setScale(0.58);
      this.scene.tweens.add({ targets: img, scale: 0.5, duration: 360, ease: 'Back.Out' });
    }
  }

  /** Lantern i is lit and gate g opens. */
  light(i: number, gate: number) {
    this.lanterns[i]?.setTexture('lantern1');
    const img = this.gates[gate];
    const gt = this.level?.gates?.[gate];
    if (img && gt) {
      this.scene.tweens.killTweensOf(img);
      this.scene.tweens.add({ targets: img, y: gt.y - 4 - gt.h * 0.85, alpha: 0.35, duration: 450, ease: 'Cubic.Out' });
    }
  }

  /** Back to the start of a run: lanterns out, gates shut. */
  resetMechanics() {
    this.lanterns.forEach((img) => img.setTexture('lantern0'));
    (this.level?.gates ?? []).forEach((gt, i) => {
      const img = this.gates[i];
      if (!img) return;
      this.scene.tweens.killTweensOf(img);
      img.setPosition(gt.x - 4, gt.y - 4).setAlpha(1);
    });
  }

  /** Lantern hit radius, for the coach pulse. */
  static readonly lanternR = LANTERN_R;

  /** Shows a plank solid or gone, with a quick fade. */
  setPlank(view: PlankView, shown: boolean) {
    if (view.shown === shown) return;
    view.shown = shown;
    this.scene.tweens.killTweensOf([view.solid, view.ghost]);
    this.scene.tweens.add({ targets: view.solid, alpha: shown ? 1 : 0, duration: 120 });
    this.scene.tweens.add({ targets: view.ghost, alpha: shown ? 0 : 0.9, duration: 120 });
  }

  resetCandies() {
    if (!this.level) return;
    this.candies.forEach((img, i) => {
      const p = this.level!.candies[i];
      this.scene.tweens.killTweensOf(img);
      img.setVisible(true).setAlpha(1).setScale(0.5).setPosition(p[0], p[1]);
      this.scene.tweens.add({ targets: img, y: p[1] - 7, duration: 900 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    });
  }

  private bakeStatic() {
    const level = this.level;
    if (!level) return;
    const key = `field${this.id}`;
    const viewBottom = FIELD_H;
    bake(this.scene, key, 0, 0, FIELD_W, FIELD_H, this.res, (g) => {
      drawSky(g, 0, 0, FIELD_W, FIELD_H, [560 - (level.id % 3) * 190, 240 + (level.id % 2) * 40], level.id);
      for (const b of level.blocks) drawBlock(g, b, viewBottom);
      for (const b of level.bats ?? []) drawBatPath(g, b.a, b.b);
      level.roads.forEach((road, i) => {
        if (!road.ghost) drawRoad(g, road.pts, level.id * 10 + i);
      });
      for (const w of level.walls) {
        // The sign faces the side the car comes from: the open side of the wall.
        const facingLeft = w.x + w.w / 2 > FIELD_W / 2;
        drawWall(g, w, facingLeft);
      }
      drawHouse(g, level.house.x, level.house.y);
    });
    if (!this.staticImg) {
      this.staticImg = this.scene.add.image(0, 0, key).setOrigin(0);
      this.back.add(this.staticImg);
    } else this.staticImg.setTexture(key);
    this.staticImg.setScale(1 / this.res);
  }
}
