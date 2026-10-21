// The car on screen (Pumpkin Buggy, src/render/car.ts). Follows the simulation with interpolation
// between fixed steps, so it moves smoothly at 60, 120 or 144 Hz, and adds the life the physics
// does not have: Lumi bobs and floats in the air, the scarf streams with speed, the vine antenna
// sways when the car speeds up or brakes, the body squashes on landing and at a U-turn, the lamp
// glows and the exhaust puffs little ghosts. None of it feeds back into the physics.
import Phaser from 'phaser';
import { shapeTexture } from '@core';
import { COCKPIT_AT, drawBeam, drawCarEyes, drawCockpitLip, drawFender, drawLumi, drawPuff, drawScarfTail, drawShell, drawTyre, drawVine, RIG } from '../render/car.ts';
import { DRIVER, type Sim } from '../sim/sim.ts';
import { TUNING } from '../sim/tuning.ts';

interface Pose {
  x: number;
  y: number;
  a: number;
  w: [number, number, number][];
  dir: 1 | -1;
  /** Chassis velocity, units per second. */
  vx: number;
  vy: number;
  grounded: boolean;
}

interface Puff {
  img: Phaser.GameObjects.Image;
  life: number;
  vx: number;
  vy: number;
}

const PUFFS = 12;
const PUFF_LIFE = 0.75;

export class CarView {
  readonly root: Phaser.GameObjects.Container;
  /** Everything that moves with the chassis (flipped for the driving direction). */
  private body: Phaser.GameObjects.Container;
  /** Fenders: same pose as body, but drawn in front of the tyres. */
  private front: Phaser.GameObjects.Container;
  private lumi: Phaser.GameObjects.Image;
  private scarf: Phaser.GameObjects.Image;
  private vine: Phaser.GameObjects.Image;
  private beam: Phaser.GameObjects.Image;
  private wheels: Phaser.GameObjects.Image[];
  private puffs: Puff[] = [];
  private eyes: Phaser.GameObjects.Image;
  private lumiKey = '';
  private blinkKey = '';
  private eyesKey = '';
  private eyesBlinkKey = '';
  private carBlinkAt = 0;
  private prev: Pose | null = null;
  private cur: Pose | null = null;
  private blinkAt = 0;
  private lastTime = 0;
  /** Squash and stretch: 1 = rest. Driven by tweens. */
  private squash = { x: 1, y: 1 };
  /** Vine angle (radians) and its angular speed: a small spring. */
  private vineA = 0;
  private vineV = 0;
  private lastVx = 0;
  private lumiLift = 0;
  private puffClock = 0;
  private wasGrounded = true;
  private hidden = false;

  constructor(
    private scene: Phaser.Scene,
    parent: Phaser.GameObjects.Container,
  ) {
    const r = TUNING.wheelRadius;
    const tex = (key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void, pad = 6) => shapeTexture(scene, `car-${key}`, w, h, draw, pad);
    const img = (t: { key: string; res: number }, x = 0, y = 0) => scene.add.image(x, y, t.key).setScale(1 / t.res);

    const shell = tex('shell', 140, 70, drawShell);
    const lip = tex('lip', 60, 18, (g) => drawCockpitLip(g));
    const lumi = tex('lumi', 44, 76, (g) => drawLumi(g));
    const lumiBlink = tex('lumiBlink', 44, 76, (g) => drawLumi(g, true));
    const eyes = tex('eyes', 34, 26, (g) => drawCarEyes(g));
    const eyesBlink = tex('eyesBlink', 34, 26, (g) => drawCarEyes(g, true));
    // Oversized boxes so the image centre is the pivot: the scarf knot, the vine foot, the lamp.
    const scarf = tex('scarf', 70, 22, drawScarfTail, 4);
    const vine = tex('vine', 44, 64, drawVine, 4);
    const beam = tex('beam', 150, 64, drawBeam, 2);
    const fender = tex('fender', 52, 28, drawFender, 4);
    const tyre = tex('tyre', r * 2 + 8, r * 2 + 8, (g) => drawTyre(g, r), 4);
    const puff = tex('puff', 18, 14, drawPuff, 3);
    this.lumiKey = lumi.key;
    this.blinkKey = lumiBlink.key;
    this.eyesKey = eyes.key;
    this.eyesBlinkKey = eyesBlink.key;

    this.beam = img(beam, RIG.lamp.x, RIG.lamp.y).setBlendMode(Phaser.BlendModes.ADD);
    this.vine = img(vine, RIG.vine.x, RIG.vine.y);
    const shellImg = img(shell);
    this.scarf = img(scarf, RIG.scarfKnot.x, RIG.scarfKnot.y);
    this.lumi = img(lumi, RIG.lumi.x, RIG.lumi.y);
    this.eyes = img(eyes, RIG.eyes.x, RIG.eyes.y);
    const lipImg = img(lip, COCKPIT_AT.x, COCKPIT_AT.y);
    this.body = scene.add.container(0, 0, [this.beam, this.vine, shellImg, this.eyes, this.scarf, this.lumi, lipImg]);
    this.front = scene.add.container(0, 0, RIG.fenders.map((f) => img(fender, f.x, f.y)));
    this.wheels = [0, 1].map(() => img(tyre));
    for (let i = 0; i < PUFFS; i++) {
      const p = img(puff).setVisible(false);
      this.puffs.push({ img: p, life: 0, vx: 0, vy: 0 });
    }
    this.root = scene.add.container(0, 0, [...this.puffs.map((p) => p.img), this.body, ...this.wheels, this.front]);
    parent.add(this.root);
  }

  /** Puts the car at its start pose (edit mode). */
  setStart(x: number, roadY: number, dir: 1 | -1) {
    const t = TUNING;
    const wy = roadY - t.wheelRadius;
    const cy = wy - t.wheelDrop;
    const pose: Pose = {
      x,
      y: cy,
      a: 0,
      w: [
        [x - t.wheelBase / 2, wy, 0],
        [x + t.wheelBase / 2, wy, 0],
      ],
      dir,
      vx: 0,
      vy: 0,
      grounded: true,
    };
    this.prev = pose;
    this.cur = pose;
    this.hidden = false;
    this.root.setAlpha(1).setVisible(true);
    this.squash.x = 1;
    this.squash.y = 1;
    this.scene.tweens.killTweensOf(this.squash);
    this.scene.tweens.killTweensOf(this.body);
    this.vineA = 0;
    this.vineV = 0;
    this.lumiLift = 0;
    this.wasGrounded = true;
    for (const p of this.puffs) {
      p.life = 0;
      p.img.setVisible(false);
    }
    this.apply(1);
  }

  /** Call after every simulation step. */
  capture(sim: Sim) {
    this.prev = this.cur;
    const c = sim.chassis;
    this.cur = {
      x: c.position.x,
      y: c.position.y,
      a: c.angle,
      w: sim.wheels.map((w: { position: { x: number; y: number }; angle: number }) => [w.position.x, w.position.y, w.angle]) as [number, number, number][],
      dir: sim.dir,
      vx: c.velocity.x * 60,
      vy: c.velocity.y * 60,
      grounded: sim.grounded,
    };
    if (!this.prev) this.prev = this.cur;
    // Landing: a squash, and dust puffs at the wheels when it was a real drop.
    if (this.cur.grounded && !this.wasGrounded && this.prev.vy > 140) {
      const k = Math.min(1, (this.prev.vy - 140) / 300);
      this.bounce(1 + 0.1 * k + 0.03, 1 - 0.14 * k - 0.04);
      if (k > 0.2) for (const w of this.cur.w) this.spawnPuff(w[0], w[1] + TUNING.wheelRadius - 4, (Math.random() - 0.5) * 60, -25, 0.8);
    }
    this.wasGrounded = this.cur.grounded;
  }

  /** The car turned at a wall: a quick squash so the flip reads as a move, not a glitch. */
  turned() {
    this.bounce(0.86, 1.1);
  }

  private bounce(sx: number, sy: number) {
    this.scene.tweens.killTweensOf(this.squash);
    this.squash.x = sx;
    this.squash.y = sy;
    this.scene.tweens.add({ targets: this.squash, x: 1, y: 1, duration: 260, ease: 'Back.Out' });
  }

  /** Draws the pose between the last two steps (alpha 0..1). */
  apply(alpha: number) {
    const p = this.prev;
    const c = this.cur;
    if (!p || !c) return;
    const lerp = (a: number, b: number) => a + (b - a) * alpha;
    const la = (a: number, b: number) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * alpha;
    const x = lerp(p.x, c.x);
    const y = lerp(p.y, c.y);
    const a = la(p.a, c.a);
    this.body.setPosition(x, y).setRotation(a);
    this.wheels.forEach((w, i) => {
      w.setPosition(lerp(p.w[i][0], c.w[i][0]), lerp(p.w[i][1], c.w[i][1]));
      w.setRotation(la(p.w[i][2], c.w[i][2]));
    });
    this.syncFront();
  }

  private syncFront() {
    const dir = this.cur?.dir ?? 1;
    this.body.setScale(dir * this.squash.x, this.squash.y);
    this.front.setPosition(this.body.x, this.body.y).setRotation(this.body.rotation).setScale(this.body.scaleX, this.body.scaleY);
  }

  get position(): [number, number] {
    return [this.body.x, this.body.y];
  }

  /** Every frame, in every state: blink, bob, scarf, vine, lamp, puffs. */
  idle(time: number, waiting: boolean) {
    const dt = Math.min(0.05, Math.max(0, (time - (this.lastTime || time)) / 1000));
    this.lastTime = time;
    const c = this.cur;
    const vx = c ? c.vx : 0;
    const vy = c ? c.vy : 0;
    const speed = Math.hypot(vx, vy);
    const dir = c?.dir ?? 1;

    // Lumi and the car blink now and then, each on its own clock.
    if (time > this.blinkAt) {
      this.blinkAt = time + 2200 + Math.random() * 2500;
      this.lumi.setTexture(this.blinkKey);
      this.scene.time.delayedCall(120, () => this.lumi.setTexture(this.lumiKey));
    }
    if (time > this.carBlinkAt) {
      this.carBlinkAt = time + 2600 + Math.random() * 3000;
      this.eyes.setTexture(this.eyesBlinkKey);
      this.scene.time.delayedCall(130, () => this.eyes.setTexture(this.eyesKey));
    }

    // Lumi: a slow float while waiting; in the air she lifts a little out of her seat.
    const targetLift = c && !c.grounded ? Phaser.Math.Clamp(vy * 0.012, -3, 5) : 0;
    this.lumiLift += (targetLift - this.lumiLift) * Math.min(1, dt * 10);
    const float = waiting ? Math.sin(time / 300) * 1.6 : Math.sin(time / 90) * 0.4 * Math.min(1, speed / 200);
    this.lumi.y = RIG.lumi.y - this.lumiLift + float;
    this.lumi.rotation = waiting ? Math.sin(time / 520) * 0.04 : -Phaser.Math.Clamp(Math.abs(vx) / 3000, 0, 0.08);

    // Scarf: hangs down when still, streams back with speed, flutters faster the faster it goes.
    const s = Phaser.Math.Clamp(speed / 260, 0, 1);
    const flutter = Math.sin(time / (110 - 60 * s)) * (0.06 + 0.16 * s);
    this.scarf.rotation = -1.05 + 0.95 * s + flutter + (waiting ? Math.sin(time / 700) * 0.06 : 0);
    this.scarf.scaleX = (0.85 + 0.2 * s) / this.texRes(this.scarf);

    // Vine antenna: a damped spring kicked by the car speeding up or slowing down.
    const ax = dt > 0 ? (vx - this.lastVx) / dt : 0;
    this.lastVx = vx;
    const kick = Phaser.Math.Clamp(ax * dir * 0.00035, -0.6, 0.6);
    this.vineV += (-120 * this.vineA - 9 * this.vineV - kick * 60) * dt;
    this.vineA = Phaser.Math.Clamp(this.vineA + this.vineV * dt, -0.7, 0.7);
    this.vine.rotation = this.vineA + Math.sin(time / 640) * 0.05;

    // Lamp: warm, with a faint flicker.
    this.beam.alpha = this.hidden ? 0 : 0.85 + Math.sin(time / 170) * 0.06 + Math.sin(time / 53) * 0.03;

    // Exhaust: little ghost puffs while driving on the ground.
    if (c && c.grounded && speed > 40 && !waiting && !this.hidden) {
      this.puffClock -= dt;
      if (this.puffClock <= 0) {
        this.puffClock = 0.16 + Math.random() * 0.06;
        const pipe = this.toField(RIG.exhaust.x, RIG.exhaust.y);
        this.spawnPuff(pipe[0], pipe[1], -dir * (30 + Math.random() * 20), -18 - Math.random() * 14, 0.55);
      }
    }
    for (const p of this.puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const f = 1 - p.life / PUFF_LIFE;
      p.img.x += p.vx * dt;
      p.img.y += p.vy * dt;
      p.img.alpha = 0.8 * (1 - f);
      const base = p.img.getData('base') as number;
      p.img.setScale((base * (0.6 + 0.9 * f)) / this.texRes(p.img));
      if (p.life <= 0) p.img.setVisible(false);
    }

    this.syncFront();
  }

  private texRes(img: Phaser.GameObjects.Image) {
    const m = /@([\d.]+)$/.exec(img.texture.key);
    return m ? Number(m[1]) : 1;
  }

  /** Car-frame point to field coordinates, using the pose on screen. */
  private toField(lx: number, ly: number): [number, number] {
    const b = this.body;
    const sx = lx * b.scaleX;
    const sy = ly * b.scaleY;
    const cos = Math.cos(b.rotation);
    const sin = Math.sin(b.rotation);
    return [b.x + sx * cos - sy * sin, b.y + sx * sin + sy * cos];
  }

  private spawnPuff(x: number, y: number, vx: number, vy: number, scale: number) {
    const p = this.puffs.find((q) => q.life <= 0) ?? this.puffs[0];
    p.life = PUFF_LIFE;
    p.vx = vx;
    p.vy = vy;
    p.img.setData('base', scale);
    p.img.setPosition(x, y).setVisible(true).setAlpha(0.8);
  }

  /** Drives into the house: shrink and fade. */
  enterHouse(doorX: number, doorY: number) {
    this.scene.tweens.add({ targets: this.root, alpha: 0, duration: 350 });
    this.scene.tweens.add({ targets: this.squash, x: 0.5, y: 0.5, duration: 350 });
    this.scene.tweens.add({ targets: this.body, x: doorX, y: doorY - 26, duration: 350 });
  }

  hide() {
    this.hidden = true;
    this.root.setVisible(false);
  }
}

// DRIVER in sim.ts must stay where Lumi is drawn, or candy pickups would not match the picture.
if (DRIVER.x !== RIG.lumi.x || DRIVER.y !== RIG.lumi.y) throw new Error('CarView: RIG.lumi and DRIVER differ');
