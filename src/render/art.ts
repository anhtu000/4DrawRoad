// Everything in the field is drawn with code (no image files), into textures once per level
// (see Field.ts). Shapes are flat with thick dark outlines and round corners (v0 section 7.1).
import Phaser from 'phaser';
import { downNormal } from '../logic/geom.ts';
import type { BlockDef, Pt, RectDef } from '../logic/types.ts';
import { TUNING } from '../sim/tuning.ts';
import { C } from './palette.ts';

type G = Phaser.GameObjects.Graphics;
/** Phaser 4's typings want Vector2 for point lists; plain {x, y} objects work the same at run time. */
const V = (pts: { x: number; y: number }[]) => pts as unknown as Phaser.Math.Vector2[];

/** Small deterministic noise so the same level always looks the same. */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function mix(a: number, b: number, t: number) {
  const ca = Phaser.Display.Color.IntegerToColor(a);
  const cb = Phaser.Display.Color.IntegerToColor(b);
  return Phaser.Display.Color.GetColor(ca.red + (cb.red - ca.red) * t, ca.green + (cb.green - ca.green) * t, ca.blue + (cb.blue - ca.blue) * t);
}

/** Night sky with moon, stars and hills over a w x h area starting at (x, y). */
export function drawSky(g: G, x: number, y: number, w: number, h: number, moon: Pt | null, seed = 1) {
  const bands = 36;
  for (let i = 0; i < bands; i++) {
    g.fillStyle(mix(C.skyTop, C.skyBottom, i / (bands - 1)), 1);
    g.fillRect(x, y + (h * i) / bands, w, h / bands + 1);
  }
  for (let i = 0; i < Math.round((w * h) / 9000); i++) {
    const sx = x + hash(i * 3 + seed) * w;
    const sy = y + hash(i * 7 + seed * 5) * h * 0.75;
    const r = 0.8 + hash(i * 11 + seed) * 1.8;
    g.fillStyle(C.star, 0.35 + hash(i * 13) * 0.5);
    g.fillCircle(sx, sy, r);
  }
  if (moon) {
    for (let k = 4; k >= 1; k--) {
      g.fillStyle(C.moonGlow, 0.05 * k);
      g.fillCircle(moon[0], moon[1], 64 + (5 - k) * 22);
    }
    g.fillStyle(C.moon, 1);
    g.fillCircle(moon[0], moon[1], 64);
    g.fillStyle(0xf3dfa6, 1);
    g.fillCircle(moon[0] - 20, moon[1] - 14, 11);
    g.fillCircle(moon[0] + 18, moon[1] + 20, 8);
    g.fillCircle(moon[0] + 22, moon[1] - 24, 5);
  }
  // Two rows of soft hills at the bottom.
  for (const [base, amp, color, f] of [
    [y + h * 0.84, 40, C.hillFar, 0.011],
    [y + h * 0.9, 34, C.hillNear, 0.017],
  ] as const) {
    const pts: { x: number; y: number }[] = [{ x, y: y + h }];
    for (let px = x; px <= x + w + 20; px += 20) pts.push({ x: px, y: base - Math.sin(px * f + seed) * amp - Math.sin(px * f * 2.3) * amp * 0.4 });
    pts.push({ x: x + w + 20, y: y + h });
    g.fillStyle(color, 1);
    g.fillPoints(V(pts), true);
  }
}

/** A road piece: rocky band hanging below its top line, with a light top edge. */
export function drawRoad(g: G, pts: Pt[], seed = 0) {
  const t = TUNING.roadThickness;
  const top = pts.map((p) => ({ x: p[0], y: p[1] }));
  const bottom: { x: number; y: number }[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + (i === 0 ? 1 : 0))];
    const n = downNormal(a, b);
    bottom.push({ x: pts[i][0] + n[0] * t, y: pts[i][1] + n[1] * t });
  }
  // Rocky underside: a few lumps between the bottom corners.
  const under: { x: number; y: number }[] = [];
  for (let i = 0; i < bottom.length - 1; i++) {
    const a = bottom[i];
    const b = bottom[i + 1];
    under.push(a);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.floor(len / 26);
    for (let k = 1; k < steps; k++) {
      const f = k / steps;
      under.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f + 4 + hash(seed * 31 + i * 7 + k) * 9 });
    }
  }
  under.push(bottom[bottom.length - 1]);
  const poly = [...top, ...under];
  g.fillStyle(C.outline, 1);
  g.fillPoints(V(poly.map((p) => ({ x: p.x, y: p.y + 4 }))), true);
  g.fillStyle(C.road, 1);
  g.fillPoints(V(poly), true);
  g.lineStyle(4, C.outline, 1);
  g.strokePoints(V(poly), true);
  // Pebbles
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const n = downNormal(a, b);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let k = 0; k < len / 22; k++) {
      const f = hash(seed * 13 + i * 17 + k * 3);
      const d = 10 + hash(seed + i * 5 + k * 11) * (t - 6);
      g.fillStyle(hash(k + i) > 0.5 ? C.pebble : C.roadDark, 0.9);
      g.fillCircle(a[0] + (b[0] - a[0]) * f + n[0] * d, a[1] + (b[1] - a[1]) * f + n[1] * d, 2 + hash(k * 7 + seed) * 2.5);
    }
  }
  g.lineStyle(6, C.roadTop, 1);
  g.strokePoints(V(top), false);
}

/** U-turn wall: stone slab with a round orange sign. */
export function drawWall(g: G, r: RectDef, facingLeft: boolean) {
  const rad = Math.min(10, r.w / 2);
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(r.x - 3, r.y - 3, r.w + 6, r.h + 6, rad + 2);
  g.fillStyle(C.stone, 1);
  g.fillRoundedRect(r.x, r.y, r.w, r.h, rad);
  g.fillStyle(C.stoneDark, 1);
  g.fillRect(r.x + r.w * 0.6, r.y + rad, r.w * 0.3, r.h - rad * 2);
  for (let k = 0; k < r.h / 40; k++) {
    g.fillStyle(C.stoneLight, 0.5);
    g.fillRect(r.x + 4, r.y + 20 + k * 40, r.w * 0.35, 3);
  }
  // Sign on a little post, on the side the car comes from.
  const cx = facingLeft ? r.x - 26 : r.x + r.w + 26;
  const cy = r.y + 46;
  g.fillStyle(C.outline, 1);
  g.fillRect(Math.min(cx, r.x + r.w / 2), cy - 3, Math.abs(cx - (r.x + r.w / 2)), 6);
  drawUturnSign(g, cx, cy, 22, facingLeft);
}

export function drawUturnSign(g: G, cx: number, cy: number, R: number, mirror: boolean) {
  g.fillStyle(C.outline, 1);
  g.fillCircle(cx, cy, R + 3);
  g.fillStyle(C.sign, 1);
  g.fillCircle(cx, cy, R);
  g.lineStyle(5, 0xffffff, 1);
  const s = mirror ? -1 : 1;
  g.beginPath();
  g.arc(cx, cy, R * 0.5, Math.PI * 0.15, Math.PI * 1.25, false);
  g.strokePath();
  // arrow head at the end of the arc
  const ax = cx + Math.cos(Math.PI * 1.25) * R * 0.5;
  const ay = cy + Math.sin(Math.PI * 1.25) * R * 0.5;
  g.fillStyle(0xffffff, 1);
  g.fillTriangle(ax - 7 * s, ay + 1, ax + 7 * s, ay - 3, ax + 1 * s, ay + 9);
}

/** A rock column with a friendly gravestone on top. */
export function drawBlock(g: G, b: BlockDef, viewBottom: number) {
  const h = Math.min(b.h, viewBottom - b.y);
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(b.x - 3, b.y - 3, b.w + 6, h + 6, 8);
  g.fillStyle(C.stoneDark, 1);
  g.fillRoundedRect(b.x, b.y, b.w, h, 6);
  g.fillStyle(C.stone, 0.6);
  for (let k = 0; k < h / 30; k++) g.fillRect(b.x + 4 + (k % 2) * 10, b.y + 22 + k * 30, b.w * 0.4, 4);
  if (b.look === 'grave') {
    const w = b.w + 6;
    const x = b.x + b.w / 2;
    const top = b.y - 30;
    g.fillStyle(C.outline, 1);
    g.fillRoundedRect(x - w / 2 - 3, top - 3, w + 6, 40, { tl: w / 2, tr: w / 2, bl: 4, br: 4 });
    g.fillStyle(C.stoneLight, 1);
    g.fillRoundedRect(x - w / 2, top, w, 34, { tl: w / 2 - 2, tr: w / 2 - 2, bl: 3, br: 3 });
    g.fillStyle(C.eye, 1);
    g.fillCircle(x - 7, top + 15, 2.6);
    g.fillCircle(x + 7, top + 15, 2.6);
    g.lineStyle(2.5, C.eye, 1);
    g.beginPath();
    g.arc(x, top + 19, 5, 0.2, Math.PI - 0.2, false);
    g.strokePath();
  }
}

/** Cute haunted house standing on the road at (x, y). The door is centered on x. */
export function drawHouse(g: G, x: number, y: number) {
  const w = 104;
  const h = 84;
  const left = x - w / 2;
  const top = y - h;
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(left - 4, top - 4, w + 8, h + 6, 8);
  g.fillStyle(C.houseWall, 1);
  g.fillRoundedRect(left, top, w, h, 6);
  // roof
  g.fillStyle(C.outline, 1);
  g.fillTriangle(left - 16, top + 6, x, top - 58, left + w + 16, top + 6);
  g.fillStyle(C.houseRoof, 1);
  g.fillTriangle(left - 8, top + 2, x, top - 50, left + w + 8, top + 2);
  // chimney
  g.fillStyle(C.outline, 1);
  g.fillRect(x + 22, top - 50, 18, 30);
  g.fillStyle(C.houseRoof, 1);
  g.fillRect(x + 25, top - 47, 12, 26);
  // round attic window
  g.fillStyle(C.outline, 1);
  g.fillCircle(x, top - 18, 11);
  g.fillStyle(C.window, 1);
  g.fillCircle(x, top - 18, 8);
  // windows
  for (const wx of [left + 18, left + w - 18]) {
    g.fillStyle(C.outline, 1);
    g.fillRoundedRect(wx - 11, top + 14, 22, 22, 4);
    g.fillStyle(C.window, 1);
    g.fillRoundedRect(wx - 8, top + 17, 16, 16, 3);
    g.fillStyle(C.outline, 1);
    g.fillRect(wx - 1, top + 17, 2, 16);
  }
  // door
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(x - 20, y - 52, 40, 52, { tl: 20, tr: 20, bl: 0, br: 0 });
  g.fillStyle(C.door, 1);
  g.fillRoundedRect(x - 16, y - 48, 32, 48, { tl: 16, tr: 16, bl: 0, br: 0 });
  g.fillStyle(C.outline, 1);
  g.fillCircle(x + 8, y - 24, 3);
}

/** Pumpkin car body, local (0,0) = chassis center, facing right. */
export function drawPumpkin(g: G) {
  const W = 108;
  const H = 54;
  const cy = -4;
  g.fillStyle(C.outline, 1);
  g.fillEllipse(0, cy, W + 8, H + 8);
  g.fillStyle(C.pumpkinDark, 1);
  g.fillEllipse(0, cy, W, H);
  g.fillStyle(C.pumpkin, 1);
  g.fillEllipse(-4, cy - 2, W - 10, H - 8);
  // ribs
  g.fillStyle(C.pumpkinDark, 0.55);
  for (const rx of [-30, -6, 18]) g.fillEllipse(rx, cy, 6, H - 16);
  g.fillStyle(C.pumpkinLight, 0.8);
  g.fillEllipse(-26, cy - 14, 26, 9);
  // stem
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-32, cy - H / 2 - 12, 14, 16, 4);
  g.fillStyle(C.stem, 1);
  g.fillRoundedRect(-29, cy - H / 2 - 9, 8, 12, 3);
  // eyes (front = right)
  for (const ex of [26, 42]) {
    g.fillStyle(C.outline, 1);
    g.fillEllipse(ex, cy - 2, 15, 19);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(ex, cy - 2, 11, 15);
    g.fillStyle(C.eye, 1);
    g.fillCircle(ex + 2, cy, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(ex + 3.5, cy - 2, 1.5);
  }
  // smile
  g.lineStyle(3, C.outline, 1);
  g.beginPath();
  g.arc(36, cy + 8, 7, 0.3, Math.PI - 0.3, false);
  g.strokePath();
}

/** Lumi, the ghost driver: a teardrop with an orange scarf. Local (0,0) = bottom center. */
export function drawGhost(g: G, blink = false) {
  const outline = (draw: () => void) => draw();
  outline(() => {
    g.fillStyle(C.outline, 1);
    g.fillCircle(0, -24, 19);
    g.fillTriangle(-16, -30, 16, -30, 0, -56);
    g.fillRoundedRect(-19, -26, 38, 26, 8);
  });
  g.fillStyle(C.ghost, 1);
  g.fillCircle(0, -24, 16);
  g.fillTriangle(-13, -30, 13, -30, 0, -52);
  g.fillRoundedRect(-16, -26, 32, 23, 7);
  g.fillStyle(C.ghostShade, 1);
  g.fillEllipse(-8, -30, 6, 10);
  // eyes
  g.fillStyle(C.eye, 1);
  if (blink) {
    g.fillRect(-1, -29, 7, 2.5);
    g.fillRect(9, -29, 7, 2.5);
  } else {
    g.fillEllipse(2, -28, 5.5, 7.5);
    g.fillEllipse(12, -28, 5.5, 7.5);
  }
  g.fillStyle(C.blush, 0.9);
  g.fillEllipse(-1, -21, 6, 3.5);
  g.fillStyle(C.blush, 0.9);
  g.fillEllipse(15, -21, 6, 3.5);
  // scarf
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-18, -16, 36, 11, 5);
  g.fillStyle(C.scarf, 1);
  g.fillRoundedRect(-16, -14, 32, 7, 3);
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-22, -14, 10, 17, 4);
  g.fillStyle(C.scarf, 1);
  g.fillRoundedRect(-20, -12, 6, 13, 3);
}

export function drawWheel(g: G, r: number) {
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, r + 2.5);
  g.fillStyle(C.wheel, 1);
  g.fillCircle(0, 0, r);
  g.fillStyle(C.hub, 1);
  g.fillCircle(0, 0, r * 0.42);
  g.lineStyle(3, C.hub, 1);
  for (let k = 0; k < 3; k++) {
    const a = (k * Math.PI * 2) / 3;
    g.lineBetween(0, 0, Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8);
  }
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, r * 0.15);
}

/** Wrapped candy, about 2r wide. gold adds a ring: never collected yet (v0 section 5.1). */
export function drawCandy(g: G, r: number, gold: boolean) {
  g.fillStyle(C.candy, 0.18);
  g.fillCircle(0, 0, r * 1.25);
  if (gold) {
    g.lineStyle(3, C.gold, 0.9);
    g.strokeCircle(0, 0, r * 1.12);
  }
  g.fillStyle(C.outline, 1);
  g.fillTriangle(-r * 0.55, 0, -r * 1.05, -r * 0.5, -r * 1.05, r * 0.5);
  g.fillTriangle(r * 0.55, 0, r * 1.05, -r * 0.5, r * 1.05, r * 0.5);
  g.fillStyle(C.candyBow, 1);
  g.fillTriangle(-r * 0.5, 0, -r * 0.92, -r * 0.36, -r * 0.92, r * 0.36);
  g.fillTriangle(r * 0.5, 0, r * 0.92, -r * 0.36, r * 0.92, r * 0.36);
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, r * 0.62);
  g.fillStyle(C.candy, 1);
  g.fillCircle(0, 0, r * 0.52);
  g.fillStyle(C.candyLight, 1);
  g.fillEllipse(-r * 0.15, -r * 0.18, r * 0.42, r * 0.22);
  g.lineStyle(3, 0xffffff, 0.7);
  g.lineBetween(-r * 0.3, r * 0.3, r * 0.3, -r * 0.3);
}

/** Ghost plank texture body: w long, drawn at (0,0) = top-left of its top line. */
export function drawPlank(g: G, w: number) {
  const t = TUNING.roadThickness - 6;
  g.fillStyle(C.outline, 0.8);
  g.fillRoundedRect(-3, -3, w + 6, t + 6, 6);
  g.fillStyle(C.plank, 1);
  g.fillRoundedRect(0, 0, w, t, 5);
  g.fillStyle(C.plankDark, 0.8);
  for (let x = 30; x < w; x += 40) g.fillRect(x, 3, 3, t - 6);
  g.fillStyle(0xffffff, 0.45);
  g.fillRect(4, 3, w - 8, 4);
}

/** Dashed outline of a plank while it is gone. */
export function drawPlankGhost(g: G, w: number) {
  const t = TUNING.roadThickness - 6;
  g.lineStyle(3, C.plank, 0.8);
  for (let x = 0; x < w; x += 18) {
    g.lineBetween(x, 0, Math.min(w, x + 10), 0);
    g.lineBetween(x, t, Math.min(w, x + 10), t);
  }
  g.lineBetween(0, 0, 0, t);
  g.lineBetween(w, 0, w, t);
}

/** Pointing hand for the tutorial. Fingertip at (0,0). */
export function drawHand(g: G) {
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-9, -4, 18, 46, 9);
  g.fillCircle(6, 46, 22);
  g.fillStyle(C.ghost, 1);
  g.fillRoundedRect(-6, -1, 12, 44, 6);
  g.fillCircle(6, 46, 19);
  g.fillStyle(C.ghostShade, 1);
  g.fillCircle(14, 52, 7);
}
