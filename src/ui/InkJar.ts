// The ink jar (v0 section 3.3): remaining ink as a bar, a gold mark for 3 stars and a silver one
// for 2 stars. Keep the ink level right of the gold mark and the level is 3 stars.
import Phaser from 'phaser';
import { app, shapeImage } from '@core';
import { starLimits } from '../logic/score.ts';
import { starIcon } from '../render/icons.ts';
import { C } from '../render/palette.ts';

export class InkJar extends Phaser.GameObjects.Container {
  readonly barW: number;
  private fill: Phaser.GameObjects.Rectangle;
  private shine: Phaser.GameObjects.Rectangle;
  private gold: Phaser.GameObjects.Container;
  private silver: Phaser.GameObjects.Container;
  private label: Phaser.GameObjects.Text;
  private stars: Phaser.GameObjects.Image[] = [];
  private budget = 1;
  private limits = { three: 0, two: 0 };
  private shown = -1;

  constructor(scene: Phaser.Scene, width: number) {
    super(scene, 0, 0);
    const w = width;
    const h = 40;
    this.barW = w - 16;
    const frame = shapeImage(scene, 0, 0, `jar|${w}`, w + 24, h + 16, (g) => {
      // cork on the left, glass body
      g.fillStyle(C.outline, 1);
      g.fillRoundedRect(-w / 2 - 14, -h / 2 - 6, 22, h + 12, 6);
      g.fillStyle(0xb98a5a, 1);
      g.fillRoundedRect(-w / 2 - 11, -h / 2 - 3, 16, h + 6, 4);
      g.fillStyle(C.outline, 1);
      g.fillRoundedRect(-w / 2, -h / 2 - 4, w + 8, h + 8, h / 2 + 4);
      g.fillStyle(0x1d1636, 1);
      g.fillRoundedRect(-w / 2 + 4, -h / 2, w, h, h / 2);
    });
    this.fill = scene.add.rectangle(-this.barW / 2 + 4, 0, this.barW, h - 12, C.ink).setOrigin(0, 0.5);
    this.shine = scene.add.rectangle(-this.barW / 2 + 4, -7, this.barW, 5, C.inkCore, 0.55).setOrigin(0, 0.5);
    this.gold = this.mark(C.gold, 26);
    this.silver = this.mark(C.silver, 20);
    this.label = scene.add
      .text(w / 2 - 14, 0, '', { fontFamily: app.theme.font, fontStyle: '900', fontSize: 22, color: '#ffffff', stroke: '#1c1430', strokeThickness: 5 })
      .setOrigin(1, 0.5);
    this.add([frame, this.fill, this.shine, this.silver, this.gold, this.label]);
    for (let i = 0; i < 3; i++) {
      const s = shapeImage(scene, w / 2 + 40 + i * 34, 0, 'star30', 30, 30, (g) => starIcon(g, 30, C.gold));
      this.stars.push(s);
      this.add(s);
    }
    scene.add.existing(this);
  }

  /** Total width including the star row, for layout. */
  get fullWidth() {
    return this.barW + 16 + 24 + 110;
  }

  private mark(color: number, size: number) {
    const c = this.scene.add.container(0, 0);
    const tick = this.scene.add.rectangle(0, 0, 5, 40, color).setStrokeStyle(2, C.outline);
    const star = shapeImage(this.scene, 0, -34, `star${size}|${color}`, size, size, (g) => starIcon(g, size, color));
    c.add([tick, star]);
    return c;
  }

  setLevel(par: number, budget: number) {
    this.budget = budget;
    this.limits = starLimits(par, budget);
    this.gold.x = this.xFor(budget - this.limits.three);
    this.silver.x = this.xFor(budget - this.limits.two);
    this.shown = -1;
  }

  private xFor(remaining: number) {
    return -this.barW / 2 + 4 + (this.barW * Phaser.Math.Clamp(remaining / this.budget, 0, 1));
  }

  /** used: ink spent so far. */
  setUsed(used: number) {
    const remaining = Math.max(0, this.budget - used);
    const rounded = Math.round(remaining);
    if (rounded === this.shown) return;
    this.shown = rounded;
    const frac = Phaser.Math.Clamp(remaining / this.budget, 0, 1);
    this.fill.width = Math.max(0, this.barW * frac);
    this.shine.width = Math.max(0, this.barW * frac - 10);
    this.label.setText(String(rounded));
    const stars = used <= this.limits.three + 0.01 ? 3 : used <= this.limits.two + 0.01 ? 2 : 1;
    this.stars.forEach((s, i) => s.setAlpha(i < stars ? 1 : 0.22));
    this.fill.fillColor = frac < 0.12 ? 0xff5d7a : C.ink;
  }

  /** Little shake, for "out of ink" and the par tutorial. */
  shake() {
    this.scene.tweens.add({ targets: this, x: this.x + 8, duration: 50, yoyo: true, repeat: 3 });
  }

  /** Pulse the gold mark (par tutorial, level 4). */
  pulseGold() {
    this.scene.tweens.add({ targets: this.gold, scale: 1.35, duration: 300, yoyo: true, repeat: 5, ease: 'Sine.InOut' });
  }

  goldScreenPos(): [number, number] {
    return [this.x + this.gold.x * this.scaleX, this.y];
  }
}
