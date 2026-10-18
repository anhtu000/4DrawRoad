// The car on screen: pumpkin body, two wheels and Lumi driving. Follows the simulation with
// interpolation between fixed steps, so it moves smoothly at 60, 120 or 144 Hz.
import Phaser from 'phaser';
import { shapeTexture } from '@core';
import { drawGhost, drawPumpkin, drawWheel } from '../render/art.ts';
import { DRIVER, type Sim } from '../sim/sim.ts';

/** Ghost image center: feet at y = -14, the drawing's feet are 30 (x 0.8 = 24) below its center. */
const GHOST_Y = -14 - 24;
import { TUNING } from '../sim/tuning.ts';

interface Pose {
  x: number;
  y: number;
  a: number;
  w: [number, number, number][];
  dir: 1 | -1;
}

export class CarView {
  readonly root: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Container;
  private pumpkin: Phaser.GameObjects.Image;
  private ghost: Phaser.GameObjects.Image;
  private wheels: Phaser.GameObjects.Image[];
  private prev: Pose | null = null;
  private cur: Pose | null = null;
  private blinkAt = 0;

  constructor(
    private scene: Phaser.Scene,
    parent: Phaser.GameObjects.Container,
  ) {
    const r = TUNING.wheelRadius;
    const wheelTex = shapeTexture(scene, 'wheel', r * 2, r * 2, (g) => drawWheel(g, r), 5);
    const pumpTex = shapeTexture(scene, 'pumpkin', 120, 80, (g) => drawPumpkin(g), 6);
    // Lumi is drawn with her feet at (0, 0); the texture box is centered, so shift the drawing down.
    const ghostTex = shapeTexture(scene, 'ghost', 50, 64, (g) => {
      g.translateCanvas(0, 30);
      drawGhost(g);
    }, 6);
    shapeTexture(scene, 'ghostBlink', 50, 64, (g) => {
      g.translateCanvas(0, 30);
      drawGhost(g, true);
    }, 6);
    this.wheels = [0, 1].map(() => scene.add.image(0, 0, wheelTex.key).setScale(1 / wheelTex.res));
    this.pumpkin = scene.add.image(0, 0, pumpTex.key).setScale(1 / pumpTex.res);
    // Feet 30 below the texture center, tucked into the pumpkin's top (about y = -14 here). At scale
    // 0.8 her body circle matches DRIVER in sim.ts, which is what collects candy.
    this.ghost = scene.add.image(DRIVER.x, GHOST_Y, ghostTex.key).setScale(0.8 / ghostTex.res);
    this.body = scene.add.container(0, 0, [this.ghost, this.pumpkin]);
    this.root = scene.add.container(0, 0, [...this.wheels, this.body]);
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
    };
    this.prev = pose;
    this.cur = pose;
    this.apply(1);
    this.root.setAlpha(1).setVisible(true);
    this.body.setScale(1);
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
    };
    if (!this.prev) this.prev = this.cur;
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
    this.body.scaleX = c.dir === 1 ? Math.abs(this.body.scaleX) : -Math.abs(this.body.scaleX);
    this.wheels.forEach((w, i) => {
      w.setPosition(lerp(p.w[i][0], c.w[i][0]), lerp(p.w[i][1], c.w[i][1]));
      w.setRotation(la(p.w[i][2], c.w[i][2]));
    });
  }

  get position(): [number, number] {
    return [this.body.x, this.body.y];
  }

  /** Blink now and then, and a little bob while waiting. */
  idle(time: number, waiting: boolean) {
    if (time > this.blinkAt) {
      this.blinkAt = time + 2200 + Math.random() * 2500;
      this.ghost.setTexture(`shape:ghostBlink@${this.ghost.texture.key.split('@')[1]}`);
      this.scene.time.delayedCall(120, () => this.ghost.setTexture(this.ghost.texture.key.replace('ghostBlink', 'ghost')));
    }
    this.ghost.y = GHOST_Y + (waiting ? Math.sin(time / 260) * 2 : 0);
  }

  /** Drives into the house: shrink and fade. */
  enterHouse(doorX: number, doorY: number) {
    this.scene.tweens.add({ targets: this.root, alpha: 0, duration: 350 });
    this.scene.tweens.add({ targets: this.body, x: doorX, y: doorY - 26, scaleX: this.body.scaleX * 0.5, scaleY: 0.5, duration: 350 });
  }

  hide() {
    this.root.setVisible(false);
  }
}
