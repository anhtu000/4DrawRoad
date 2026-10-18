// Ink on screen. Finished strokes are baked into textures (cheap to draw on phones); only the
// stroke under the finger is a live Graphics, redrawn when it gets a new point.
import Phaser from 'phaser';
import type { Pt } from '../logic/types.ts';
import { C } from '../render/palette.ts';
import { TUNING } from '../sim/tuning.ts';
import { bake } from './Field.ts';

const W = TUNING.inkThickness;

function drawStroke(g: Phaser.GameObjects.Graphics, pts: Pt[], alpha = 1) {
  const layers: [number, number, number][] = [
    [W + 12, C.inkGlow, 0.16 * alpha],
    [W + 4, 0x2a1450, 0.9 * alpha],
    [W, C.ink, alpha],
    [W * 0.32, C.inkCore, 0.85 * alpha],
  ];
  for (const [w, color, a] of layers) {
    g.lineStyle(w, color, a);
    g.fillStyle(color, a);
    for (let i = 1; i < pts.length; i++) g.lineBetween(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    // round joins and caps
    for (const p of pts) g.fillCircle(p[0], p[1], w / 2);
  }
}

let nextId = 1;

/** Points per baked piece of the stroke under the finger. */
const CHUNK = 12;

export class InkLayer {
  private live: Phaser.GameObjects.Graphics;
  private baked: { img: Phaser.GameObjects.Image; key: string }[] = [];
  /**
   * The stroke under the finger is baked into images every CHUNK points; only the newest few points
   * stay in the live Graphics. A Graphics is rebuilt every frame (and twice with the loupe on), so a
   * long live stroke cost about 55 ms a frame with the CPU slowed 6x; baked pieces cost almost nothing.
   */
  private liveChunks: { img: Phaser.GameObjects.Image; key: string }[] = [];
  private livePts: Pt[] | null = null;
  private liveFrom = 0;
  private liveRes = 1;

  constructor(
    private scene: Phaser.Scene,
    private parent: Phaser.GameObjects.Container,
  ) {
    this.live = scene.add.graphics();
    parent.add(this.live);
  }

  /** Redraws the stroke being drawn. res: pixels per field unit for the baked pieces. */
  setLive(pts: Pt[] | null, res = this.liveRes) {
    this.liveRes = res;
    if (pts !== this.livePts) this.dropChunks();
    this.livePts = pts;
    this.live.clear();
    if (!pts || !pts.length) return;
    while (pts.length - this.liveFrom > CHUNK + 1) {
      const piece = pts.slice(this.liveFrom, this.liveFrom + CHUNK + 1);
      this.liveChunks.push(this.bakePiece(piece, res));
      this.liveFrom += CHUNK;
    }
    const tail = pts.slice(this.liveFrom);
    drawStroke(this.live, tail.length === 1 ? [tail[0], tail[0]] : tail);
    this.parent.bringToTop(this.live);
  }

  private dropChunks() {
    for (const c of this.liveChunks) {
      c.img.destroy();
      if (this.scene.textures.exists(c.key)) this.scene.textures.remove(c.key);
    }
    this.liveChunks = [];
    this.liveFrom = 0;
  }

  /** Replaces all finished strokes. */
  setStrokes(strokes: Pt[][], res: number) {
    for (const b of this.baked) {
      b.img.destroy();
      if (this.scene.textures.exists(b.key)) this.scene.textures.remove(b.key);
    }
    this.baked = [];
    for (const s of strokes) this.add(s, res);
  }

  private add(pts: Pt[], res: number) {
    this.baked.push(this.bakePiece(pts, res));
    this.parent.bringToTop(this.live);
  }

  private bakePiece(pts: Pt[], res: number) {
    const pad = W + 8;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const p of pts) {
      x0 = Math.min(x0, p[0]);
      y0 = Math.min(y0, p[1]);
      x1 = Math.max(x1, p[0]);
      y1 = Math.max(y1, p[1]);
    }
    x0 -= pad;
    y0 -= pad;
    x1 += pad;
    y1 += pad;
    const key = `ink${nextId++}`;
    bake(this.scene, key, x0, y0, x1 - x0, y1 - y0, res, (g) => drawStroke(g, pts));
    const img = this.scene.add.image(x0, y0, key).setOrigin(0).setScale(1 / res);
    this.parent.add(img);
    return { img, key };
  }

  /** Short glow pulse over all ink (GO pressed). */
  flash() {
    for (const b of this.baked) {
      this.scene.tweens.add({ targets: b.img, alpha: 0.6, duration: 90, yoyo: true });
    }
  }
}
