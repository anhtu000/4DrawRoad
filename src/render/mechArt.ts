// Art for the mechanics from level 6 on: ghost fog, bats, bounce pumpkins, mirrors, lanterns and
// iron gates. Same style as art.ts: flat shapes, thick dark outlines, round corners, cute not scary.
import Phaser from 'phaser';
import { BAT_R, MIRROR_H, MIRROR_HW, PUMPKIN_R } from '../logic/mech.ts';
import type { Pt, RectDef } from '../logic/types.ts';
import { C } from './palette.ts';

type G = Phaser.GameObjects.Graphics;

/** Mirror pairs are told apart by colour: entry and exit of a pair share it. */
export const MIRROR_COLORS = [0x7fd8ff, 0xff9ee8, 0xc5ff8a];
const FOG = 0xd9ecff;
const BAT = 0x6a4fa3;
const BAT_DARK = 0x4a3577;
const LANTERN = 0xffc93d;
const IRON = 0x3a3150;
const IRON_LIGHT = 0x6d6390;

function hash(n: number) {
  const s = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Ghost fog over a rect (local (0,0) = the rect's top-left). Puffy blobs that fill the rect and
 * spill a little past it, with a dotted edge so the no-ink area reads exactly.
 */
export function drawFog(g: G, r: RectDef, seed: number) {
  const pad = 10;
  const n = Math.max(4, Math.round((r.w * r.h) / 2600));
  g.fillStyle(FOG, 0.16);
  g.fillRoundedRect(-pad / 2, -pad / 2, r.w + pad, r.h + pad, 22);
  for (let i = 0; i < n; i++) {
    const x = hash(seed * 13 + i) * r.w;
    const y = hash(seed * 29 + i * 3) * r.h;
    const rad = 18 + hash(seed * 7 + i * 5) * 22;
    g.fillStyle(FOG, 0.1 + hash(i + seed) * 0.08);
    g.fillCircle(x, y, rad);
  }
  // Top edge: a row of soft puffs, so the cloud has a readable top.
  for (let x = 8; x < r.w; x += 22) {
    g.fillStyle(FOG, 0.22);
    g.fillCircle(x, 6 + hash(seed + x) * 6, 14);
  }
  // Dotted edge: ink stops here.
  g.fillStyle(0xffffff, 0.5);
  const step = 14;
  for (let x = 0; x <= r.w; x += step) {
    g.fillCircle(x, 0, 1.8);
    g.fillCircle(x, r.h, 1.8);
  }
  for (let y = step; y < r.h; y += step) {
    g.fillCircle(0, y, 1.8);
    g.fillCircle(r.w, y, 1.8);
  }
}

/** A small round bat, (0,0) = its center, facing right. wingsUp switches the flap frame. */
export function drawBat(g: G, wingsUp: boolean) {
  const R = BAT_R;
  const wy = wingsUp ? -R * 0.9 : R * 0.35;
  for (const s of [-1, 1]) {
    g.fillStyle(C.outline, 1);
    g.fillTriangle(s * R * 0.4, -R * 0.2, s * R * 1.95, wy - 3, s * R * 1.25, R * 0.45);
    g.fillStyle(BAT_DARK, 1);
    g.fillTriangle(s * R * 0.45, -R * 0.12, s * R * 1.8, wy, s * R * 1.18, R * 0.36);
  }
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, R + 3);
  g.fillStyle(BAT, 1);
  g.fillCircle(0, 0, R);
  // ears
  g.fillStyle(C.outline, 1);
  g.fillTriangle(-R * 0.75, -R * 0.45, -R * 0.35, -R * 1.25, -R * 0.1, -R * 0.65);
  g.fillTriangle(R * 0.75, -R * 0.45, R * 0.35, -R * 1.25, R * 0.1, -R * 0.65);
  g.fillStyle(BAT, 1);
  g.fillTriangle(-R * 0.62, -R * 0.5, -R * 0.37, -R * 1.02, -R * 0.2, -R * 0.65);
  g.fillTriangle(R * 0.62, -R * 0.5, R * 0.37, -R * 1.02, R * 0.2, -R * 0.65);
  // eyes and a tiny smile (no fangs)
  for (const ex of [-5, 5]) {
    g.fillStyle(0xffffff, 1);
    g.fillCircle(ex, -2, 4.5);
    g.fillStyle(C.eye, 1);
    g.fillCircle(ex + 1, -1.5, 2.4);
  }
  g.fillStyle(C.blush, 0.8);
  g.fillCircle(-9, 5, 2.6);
  g.fillCircle(9, 5, 2.6);
  g.lineStyle(2, C.outline, 1);
  g.beginPath();
  g.arc(0, 4, 3.5, 0.3, Math.PI - 0.3, false);
  g.strokePath();
}

/** Faint dotted line along a bat's flight. */
export function drawBatPath(g: G, a: Pt, b: Pt) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(2, Math.round(len / 12));
  g.fillStyle(0xff8fb0, 0.45);
  for (let i = 0; i <= n; i++) g.fillCircle(a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n, 2.2);
}

/** Bounce pumpkin, (0,0) = where it sits on the road. A coiled vine shows it is springy. */
export function drawBouncePumpkin(g: G) {
  const R = PUMPKIN_R;
  const cy = -R + 3;
  g.fillStyle(C.outline, 1);
  g.fillEllipse(0, cy, R * 2 + 10, R * 2 + 4);
  g.fillStyle(C.pumpkinDark, 1);
  g.fillEllipse(0, cy, R * 2 + 2, R * 2 - 4);
  g.fillStyle(C.pumpkin, 1);
  g.fillEllipse(-2, cy - 2, R * 2 - 8, R * 2 - 12);
  g.fillStyle(C.pumpkinDark, 0.5);
  for (const rx of [-12, 0, 12]) g.fillEllipse(rx, cy, 5, R * 2 - 16);
  g.fillStyle(C.pumpkinLight, 0.8);
  g.fillEllipse(-11, cy - 12, 14, 6);
  // spring coil on top
  g.lineStyle(3.5, C.outline, 1);
  g.beginPath();
  g.arc(0, cy - R - 2, 7, Math.PI * 0.2, Math.PI * 1.8, false);
  g.strokePath();
  g.lineStyle(2.5, C.stem, 1);
  g.beginPath();
  g.arc(0, cy - R - 2, 7, Math.PI * 0.2, Math.PI * 1.8, false);
  g.strokePath();
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-4, cy - R - 2, 8, 9, 3);
  g.fillStyle(C.stem, 1);
  g.fillRoundedRect(-2, cy - R, 4, 6, 2);
  // happy face
  for (const ex of [-8, 8]) {
    g.fillStyle(C.outline, 1);
    g.fillEllipse(ex, cy - 2, 7, 9);
  }
  g.lineStyle(3, C.outline, 1);
  g.beginPath();
  g.arc(0, cy + 5, 7, 0.25, Math.PI - 0.25, false);
  g.strokePath();
  // up arrow on its belly
  g.fillStyle(0xffffff, 0.85);
  g.fillTriangle(0, cy + 10, -5, cy + 17, 5, cy + 17);
}

/** Standing mirror, (0,0) = where it stands. Entry mirrors swirl, exits sparkle. */
export function drawMirror(g: G, color: number, entry: boolean) {
  const hw = MIRROR_HW;
  const h = MIRROR_H;
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-hw - 4, -h - 4, hw * 2 + 8, h + 8, hw + 4);
  g.fillStyle(0xd8b45a, 1);
  g.fillRoundedRect(-hw, -h, hw * 2, h, hw);
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-hw + 6, -h + 6, hw * 2 - 12, h - 12, hw - 6);
  g.fillStyle(color, 0.75);
  g.fillRoundedRect(-hw + 9, -h + 9, hw * 2 - 18, h - 18, hw - 9);
  g.fillStyle(0xffffff, 0.35);
  g.fillRoundedRect(-hw + 13, -h + 16, 7, h - 40, 4);
  if (entry) {
    g.lineStyle(3, 0xffffff, 0.8);
    for (let k = 0; k < 3; k++) {
      g.beginPath();
      g.arc(0, -h / 2, 6 + k * 6, k, k + Math.PI * 1.2, false);
      g.strokePath();
    }
  } else {
    g.fillStyle(0xffffff, 0.9);
    for (const [sx, sy, s] of [
      [6, -h * 0.66, 5],
      [-6, -h * 0.4, 3.5],
      [8, -h * 0.28, 2.5],
    ] as const) {
      g.fillTriangle(sx - s, sy, sx + s, sy, sx, sy - s * 1.8);
      g.fillTriangle(sx - s, sy, sx + s, sy, sx, sy + s * 1.8);
    }
  }
  // little feet
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-hw + 2, -6, 12, 8, 3);
  g.fillRoundedRect(hw - 14, -6, 12, 8, 3);
}

/** Hanging lantern, (0,0) = its center. The chain goes up 46 units. */
export function drawLantern(g: G, lit: boolean) {
  g.lineStyle(3.5, C.outline, 1);
  g.lineBetween(0, -46, 0, -22);
  g.fillStyle(LANTERN, lit ? 0.2 : 0.08);
  g.fillCircle(0, 0, lit ? 44 : 30);
  if (lit) {
    g.fillStyle(LANTERN, 0.28);
    g.fillCircle(0, 0, 30);
  }
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-18, -23, 36, 46, 10);
  g.fillStyle(lit ? LANTERN : 0xb39a5a, 1);
  g.fillRoundedRect(-14, -16, 28, 34, 8);
  g.fillStyle(lit ? 0xfff3c4 : 0xe0cf9a, 1);
  g.fillRoundedRect(-7, -9, 14, 20, 5);
  if (!lit) {
    // unlit wick
    g.fillStyle(C.outline, 1);
    g.fillRoundedRect(-1.5, -2, 3, 8, 1);
  }
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-15, -26, 30, 7, 3);
  g.fillRoundedRect(-11, 20, 22, 6, 3);
}

/** Iron gate filling a rect, (0,0) = its top-left. A padlock shows it is shut. */
export function drawGate(g: G, r: RectDef, color: number) {
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-3, -3, r.w + 6, r.h + 6, 5);
  g.fillStyle(IRON, 1);
  g.fillRoundedRect(0, 0, r.w, r.h, 4);
  g.fillStyle(IRON_LIGHT, 1);
  const bars = Math.max(2, Math.round(r.w / 8));
  for (let i = 0; i < bars; i++) g.fillRect(2 + (i * (r.w - 6)) / (bars - 1), 4, 3, r.h - 8);
  for (let y = 18; y < r.h - 8; y += 34) g.fillRect(0, y, r.w, 4);
  // lock in the lantern's colour
  const cy = r.h * 0.45;
  g.lineStyle(4, C.outline, 1);
  g.strokeCircle(r.w / 2, cy - 8, 7);
  g.lineStyle(2.5, color, 1);
  g.strokeCircle(r.w / 2, cy - 8, 7);
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(r.w / 2 - 11, cy - 5, 22, 18, 4);
  g.fillStyle(color, 1);
  g.fillRoundedRect(r.w / 2 - 8, cy - 2, 16, 12, 3);
}
