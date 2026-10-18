// The level on screen: a container in field units (720 x 1280) placed and scaled into the
// viewport. Static art is drawn once into one texture; planks, candies and hints are images.
import Phaser from 'phaser';
import { app } from '@core';
import type { LevelDef, Pt } from '../logic/types.ts';
import { drawBlock, drawCandy, drawHouse, drawPlank, drawPlankGhost, drawRoad, drawSky, drawWall } from '../render/art.ts';
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
  private staticImg: Phaser.GameObjects.Image | null = null;
  private level: LevelDef | null = null;
  private id = ++bakeCount;

  constructor(private scene: Phaser.Scene) {
    this.root = scene.add.container(0, 0);
    this.back = scene.add.container(0, 0);
    this.mid = scene.add.container(0, 0);
    this.front = scene.add.container(0, 0);
    this.fx = scene.add.container(0, 0);
    this.root.add([this.back, this.mid, this.front, this.fx]);
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
    for (const list of [this.back, this.mid]) list.removeAll(true);
    this.staticImg = null;
    this.planks = [];
    this.candies = [];
    this.hints = [];
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
