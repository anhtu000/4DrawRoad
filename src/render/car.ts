// The default car, "Pumpkin Buggy" (Bí Ngô Lăn Lóc in the v0 design), drawn with code in parts so
// CarView can move them: a hollowed pumpkin shell with its own blinking eyes and Lumi in the
// cockpit, chunky tyres, fenders, a curly vine antenna, a scarf that flies in the wind, a bumper
// lamp and an exhaust pipe that puffs little ghosts.
//
// Every function draws in the car's own frame: origin at the chassis centre, facing right (+x),
// y down, field units. The physics box is 96 x 26 around the origin, the wheels sit at (±33, 16)
// with radius 17, and Lumi's body matches DRIVER in sim.ts (candy is collected with those shapes),
// so the art keeps to the same outline.
import Phaser from 'phaser';
import { C } from './palette.ts';

type G = Phaser.GameObjects.Graphics;
type P = { x: number; y: number };
const V = (pts: P[]) => pts as unknown as Phaser.Math.Vector2[];

/** Car-only colours, on top of the shared palette. */
export const CAR = {
  shell: 0xff8a2b,
  shellDark: 0xd2581a,
  shellDeep: 0xa8421a,
  shellLight: 0xffb867,
  shellShine: 0xffe0b0,
  cabin: 0x3a1d2c,
  cabinDeep: 0x24121c,
  frame: 0x2e2340,
  frameLight: 0x56467a,
  bolt: 0xb7a6e0,
  tyre: 0x2a1f3f,
  tyreLight: 0x433460,
  rim: 0x9d8cc2,
  rimLight: 0xd6caf5,
  lamp: 0xffe9a3,
  lampCore: 0xfff8e0,
  glow: 0xffd36b,
  vine: 0x4fae5f,
  vineDark: 0x2f7a42,
  leaf: 0x7ad27f,
  scarf: 0xff5a36,
  scarfStripe: 0xffe6c7,
  ghost: 0xf6f2ff,
  ghostShade: 0xd6ccf3,
  blush: 0xff9ec4,
  eye: 0x241838,
  puff: 0xe9e3ff,
} as const;

/** Where the moving parts attach, in the car frame. CarView places its images here. */
export const RIG = {
  /** Lumi's body centre; equals DRIVER in sim.ts. */
  lumi: { x: -6, y: -34 },
  /** Back of Lumi's neck: the scarf tail hangs from here. */
  scarfKnot: { x: -18, y: -24 },
  /** Foot of the vine antenna, on the back of the shell. */
  vine: { x: -40, y: -16 },
  /** The car's own eyes, on the nose (v0 7.1: every car has big eyes that blink). */
  eyes: { x: 34, y: -10 },
  /** Headlamp lens, on the front bumper. */
  lamp: { x: 57, y: 9 },
  /** Mouth of the exhaust pipe. */
  exhaust: { x: -62, y: 6 },
  /** Fender centres over the wheels. */
  fenders: [
    { x: -33, y: 15 },
    { x: 33, y: 15 },
  ],
} as const;

// ------------------------------------------------------------------ helpers

function ellipsePts(cx: number, cy: number, rx: number, ry: number, from = 0, to = Math.PI * 2, n = 48): P[] {
  const pts: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = from + ((to - from) * i) / n;
    pts.push({ x: cx + Math.cos(t) * rx, y: cy + Math.sin(t) * ry });
  }
  return pts;
}

/**
 * Pumpkin outline: a wide ellipse whose top and bottom are pinched in at the ribs, so it reads as a
 * pumpkin and not an egg even at 60 pixels wide.
 */
function pumpkinPts(cx: number, cy: number, rx: number, ry: number, lobes = 5, pinch = 0.07): P[] {
  const pts: P[] = [];
  const n = 120;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const s = Math.sin(t);
    // Lobes show on the top and bottom edges only (sides stay round).
    const lobe = 1 - pinch * Math.abs(s) * (1 - Math.abs(Math.cos(lobes * (t - Math.PI / 2) * 0.5)));
    pts.push({ x: cx + Math.cos(t) * rx, y: cy + s * ry * lobe });
  }
  return pts;
}

function strokeArc(g: G, cx: number, cy: number, rx: number, ry: number, from: number, to: number, width: number, color: number, alpha = 1) {
  g.lineStyle(width, color, alpha);
  g.strokePoints(V(ellipsePts(cx, cy, rx, ry, from, to, 24)), false);
}

// ------------------------------------------------------------------ shell

const SHELL = { cx: 0, cy: -5, rx: 57, ry: 21 };
/** Cockpit opening on top of the shell, behind the middle. */
const COCKPIT = { cx: -8, cy: -21, rx: 25, ry: 5 };

/** The shell with everything fixed to it: frame, cockpit hole, ribs, moon emblem, headlamp, pipe. */
export function drawShell(g: G) {
  const { cx, cy, rx, ry } = SHELL;

  // Undercarriage: a dark frame bar between the wheels, with rivets.
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-50, 4, 100, 14, 6);
  g.fillStyle(CAR.frame, 1);
  g.fillRoundedRect(-47, 6, 94, 9, 4);
  g.fillStyle(CAR.frameLight, 1);
  g.fillRect(-45, 7, 90, 2);
  g.fillStyle(CAR.bolt, 1);
  for (const bx of [-14, 0, 14]) g.fillCircle(bx, 11, 1.8);

  // Exhaust pipe at the back, under the shell.
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(-66, 1, 26, 11, 4);
  g.fillStyle(CAR.frameLight, 1);
  g.fillRoundedRect(-63, 3, 21, 7, 3);
  g.fillStyle(CAR.cabinDeep, 1);
  g.fillEllipse(-63, 6.5, 5, 7);

  // Shell: outline, deep shade, body colour, highlight.
  g.fillStyle(C.outline, 1);
  g.fillPoints(V(pumpkinPts(cx, cy + 1, rx + 4, ry + 4)), true);
  g.fillStyle(CAR.shellDeep, 1);
  g.fillPoints(V(pumpkinPts(cx, cy, rx, ry)), true);
  g.fillStyle(CAR.shellDark, 1);
  g.fillPoints(V(pumpkinPts(cx - 1, cy - 1.5, rx - 2, ry - 2.5)), true);
  g.fillStyle(CAR.shell, 1);
  g.fillPoints(V(pumpkinPts(cx - 3, cy - 3, rx - 7, ry - 6)), true);

  // Wheel wells: dark half-moons the tyres sit in front of, so they read as arches.
  for (const f of RIG.fenders) {
    g.fillStyle(C.outline, 1);
    g.fillPoints(V(ellipsePts(f.x, 16, 22, 21, Math.PI, Math.PI * 2, 24)), true);
    g.fillStyle(CAR.cabinDeep, 1);
    g.fillPoints(V(ellipsePts(f.x, 16, 19, 18, Math.PI, Math.PI * 2, 24)), true);
  }

  // Ribs: curved grooves, ")" toward the front and "(" toward the back.
  for (const [rcx, w, front] of [
    [-34, 10, false],
    [-13, 7, false],
    [13, 7, true],
    [34, 10, true],
  ] as const) {
    const from = front ? -Math.PI / 2 : Math.PI / 2;
    const to = front ? Math.PI / 2 : (Math.PI * 3) / 2;
    strokeArc(g, rcx, cy - 2, w, ry - 6, from, to, 3, CAR.shellDark, 0.9);
  }
  // Light catching the upper back of the shell.
  g.fillStyle(CAR.shellLight, 0.9);
  g.fillEllipse(-30, cy - 11, 26, 7);
  g.fillStyle(CAR.shellShine, 0.9);
  g.fillEllipse(-36, cy - 12, 9, 3.5);

  // Cockpit: a dark recess cut into the top, flush with the shell (a raised light ring here read as
  // a hat brim around Lumi's neck). Lumi is drawn in front of it, the front lip over her.
  g.fillStyle(C.outline, 1);
  g.fillEllipse(COCKPIT.cx, COCKPIT.cy, COCKPIT.rx * 2 + 4, COCKPIT.ry * 2 + 4);
  g.fillStyle(CAR.cabin, 1);
  g.fillEllipse(COCKPIT.cx, COCKPIT.cy + 0.5, COCKPIT.rx * 2 - 2, COCKPIT.ry * 2 - 1);
  g.fillStyle(CAR.cabinDeep, 1);
  g.fillEllipse(COCKPIT.cx, COCKPIT.cy + 1.5, COCKPIT.rx * 2 - 12, COCKPIT.ry * 2 - 4);

  // Smile on the nose, under the eyes (the eyes are their own image so they can blink).
  strokeArc(g, 44, 2, 6, 4, 0.25, Math.PI - 0.55, 2.6, C.outline);
  g.fillStyle(CAR.blush, 0.75);
  g.fillEllipse(30, 3, 9, 4.5);

  // Front bumper with the headlamp.
  g.fillStyle(C.outline, 1);
  g.fillRoundedRect(42, 4, 20, 11, 5);
  g.fillStyle(CAR.frameLight, 1);
  g.fillRoundedRect(44, 6, 16, 7, 3.5);
  g.fillStyle(C.outline, 1);
  g.fillCircle(RIG.lamp.x, RIG.lamp.y, 5.5);
  g.fillStyle(CAR.glow, 1);
  g.fillCircle(RIG.lamp.x, RIG.lamp.y, 3.8);
  g.fillStyle(CAR.lampCore, 1);
  g.fillCircle(RIG.lamp.x + 0.8, RIG.lamp.y - 1, 1.8);
}

/** The car's eyes, side by side on the nose, looking ahead. Origin = RIG.eyes. */
export function drawCarEyes(g: G, blink = false) {
  // Far eye a little smaller and behind, so the face reads in three-quarter view.
  const eyes = [
    { x: -6, y: 0.5, w: 11, h: 14 },
    { x: 6, y: 0, w: 13, h: 16 },
  ];
  for (const e of eyes) {
    g.fillStyle(C.outline, 1);
    g.fillEllipse(e.x, e.y, e.w + 5, e.h + 5);
    if (blink) {
      g.fillStyle(CAR.shell, 1);
      g.fillEllipse(e.x, e.y, e.w, e.h);
      strokeArc(g, e.x, e.y - 1, e.w * 0.42, e.h * 0.22, 0.2, Math.PI - 0.2, 2.6, C.outline);
      continue;
    }
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(e.x, e.y, e.w, e.h);
    g.fillStyle(CAR.eye, 1);
    g.fillEllipse(e.x + e.w * 0.18, e.y + 0.5, e.w * 0.52, e.h * 0.6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(e.x + e.w * 0.3, e.y - e.h * 0.14, e.w * 0.13);
  }
}

/**
 * Front half of the cockpit rim, drawn over Lumi so she sits inside the pumpkin. Origin = cockpit
 * centre (COCKPIT.cx, COCKPIT.cy); CarView places the image there.
 */
export function drawCockpitLip(g: G) {
  const { rx, ry } = COCKPIT;
  const outer = ellipsePts(0, 0, rx + 2, ry + 2, 0, Math.PI, 28);
  const inner = ellipsePts(0, 1, rx - 3, ry - 2.5, Math.PI, 0, 28);
  g.fillStyle(C.outline, 1);
  g.fillPoints(V([...outer, ...inner]), true);
  const outer2 = ellipsePts(0, 0, rx, ry, 0.05, Math.PI - 0.05, 28);
  const inner2 = ellipsePts(0, 1, rx - 1.5, ry - 1, Math.PI - 0.05, 0.05, 28);
  g.fillStyle(CAR.shell, 1);
  g.fillPoints(V([...outer2, ...inner2]), true);
  g.fillStyle(CAR.shellShine, 0.8);
  g.fillEllipse(rx * 0.55, ry * 0.5, 7, 2);
}

/** Where CarView puts the cockpit lip image. */
export const COCKPIT_AT = { x: COCKPIT.cx, y: COCKPIT.cy };

/** Front fender over a wheel. Drawn in front of the tyre; origin = fender centre. */
export function drawFender(g: G) {
  const outer = ellipsePts(0, 1, 24, 22, Math.PI * 1.08, Math.PI * 1.92, 20);
  const inner = ellipsePts(0, 1, 19.5, 17.5, Math.PI * 1.92, Math.PI * 1.08, 20);
  g.fillStyle(C.outline, 1);
  g.fillPoints(V([...outer, ...inner]), true);
  const o2 = ellipsePts(0, 1, 22.5, 20.5, Math.PI * 1.1, Math.PI * 1.9, 20);
  const i2 = ellipsePts(0, 1, 21, 19, Math.PI * 1.9, Math.PI * 1.1, 20);
  g.fillStyle(CAR.shellDark, 1);
  g.fillPoints(V([...o2, ...i2]), true);
}

// ------------------------------------------------------------------ wheels

/** Chunky tyre with tread blocks, a lilac rim, five spokes and a hub cap. Origin = hub. */
export function drawTyre(g: G, r: number) {
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, r + 2.5);
  // Tread blocks around the edge.
  const blocks = 12;
  for (let i = 0; i < blocks; i++) {
    const a = (i / blocks) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const w = 3.2;
    const pts: P[] = [
      { x: ca * (r - 1) - sa * w, y: sa * (r - 1) + ca * w },
      { x: ca * (r + 2) - sa * w * 0.8, y: sa * (r + 2) + ca * w * 0.8 },
      { x: ca * (r + 2) + sa * w * 0.8, y: sa * (r + 2) - ca * w * 0.8 },
      { x: ca * (r - 1) + sa * w, y: sa * (r - 1) - ca * w },
    ];
    g.fillPoints(V(pts), true);
  }
  g.fillStyle(CAR.tyre, 1);
  g.fillCircle(0, 0, r);
  g.fillStyle(CAR.tyreLight, 1);
  for (let i = 0; i < blocks; i++) {
    const a = ((i + 0.5) / blocks) * Math.PI * 2;
    g.fillCircle(Math.cos(a) * (r - 3), Math.sin(a) * (r - 3), 1.4);
  }
  // Rim
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, r * 0.66);
  g.fillStyle(CAR.rim, 1);
  g.fillCircle(0, 0, r * 0.58);
  g.fillStyle(CAR.cabinDeep, 1);
  g.fillCircle(0, 0, r * 0.46);
  // Spokes
  g.lineStyle(3.4, CAR.rim, 1);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    g.lineBetween(0, 0, Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5);
  }
  // Hub cap
  g.fillStyle(C.outline, 1);
  g.fillCircle(0, 0, r * 0.24);
  g.fillStyle(CAR.shell, 1);
  g.fillCircle(0, 0, r * 0.17);
  // Shine on the rim, so the turning is easy to see.
  g.fillStyle(CAR.rimLight, 1);
  g.fillCircle(-r * 0.32, -r * 0.32, 1.7);
}

// ------------------------------------------------------------------ Lumi

/**
 * Lumi, the driver: a drop of ghost light with a wisp on top, big eyes, a knitted scarf. Origin =
 * her body centre (RIG.lumi). Faces right. Only the part above the cockpit lip shows.
 */
export function drawLumi(g: G, blink = false) {
  // A round drop. The tip is short and leans back like a candle flame in the wind, so the outline
  // never reads as a pointed hood. Circle centre (0, 3), radius 15.
  const R = 15;
  const cy = 3;
  const shape: P[] = [];
  // Round part: from the upper front, down and around to the upper back.
  for (let i = 0; i <= 44; i++) {
    const t = -Math.PI * 0.32 + (i / 44) * Math.PI * 1.46;
    shape.push({ x: Math.cos(t) * R, y: cy + Math.sin(t) * R });
  }
  // Tip: two curves from the back of the head to a point up and behind, and back to the crown.
  const back = shape[shape.length - 1];
  // Swept back more than up: a wisp of flame in the wind, not a point on top of the head.
  const tip = { x: -R * 1.42, y: cy - R * 1.08 };
  const front = shape[0];
  const quad = (p0: P, p1: P, p2: P, n = 14) => {
    const out: P[] = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const u = 1 - t;
      out.push({ x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y });
    }
    return out;
  };
  shape.push(...quad(back, { x: -R * 1.2, y: cy - R * 0.62 }, tip));
  shape.push(...quad(tip, { x: -R * 0.15, y: cy - R * 1.5 }, front));
  g.fillStyle(C.outline, 1);
  g.fillPoints(V(shape.map((p) => ({ x: p.x * 1.13, y: (p.y - cy) * 1.11 + cy + 0.4 }))), true);
  g.fillStyle(CAR.ghost, 1);
  g.fillPoints(V(shape), true);
  // Shade on the back side, light spot on the crown.
  g.fillStyle(CAR.ghostShade, 1);
  g.fillEllipse(-9, cy + 5, 8, 16);
  g.fillStyle(0xffffff, 1);
  g.fillEllipse(4, cy - 10, 7, 3.5);

  // Eyes, looking ahead.
  if (blink) {
    strokeArc(g, 0.5, 0, 3.6, 2.2, 0.15, Math.PI - 0.15, 2.8, CAR.eye);
    strokeArc(g, 10, 0, 3.6, 2.2, 0.15, Math.PI - 0.15, 2.8, CAR.eye);
  } else {
    for (const ex of [0.5, 10]) {
      g.fillStyle(CAR.eye, 1);
      g.fillEllipse(ex, 0, 7.4, 10);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(ex + 1.5, -2.6, 1.9);
      g.fillCircle(ex - 1.2, 2.4, 0.9);
    }
  }
  g.fillStyle(CAR.blush, 0.9);
  g.fillEllipse(-5, 6, 6, 3.2);
  g.fillEllipse(13.5, 6, 5, 3);
  // Small smile
  strokeArc(g, 5.5, 6.5, 2.6, 1.8, 0.2, Math.PI - 0.2, 1.9, CAR.eye);

  // Scarf around the neck: stripes in the knit.
  const band: P[] = [
    { x: -15.5, y: 10.5 },
    { x: 14.5, y: 11 },
    { x: 13.5, y: 17 },
    { x: -15, y: 16.5 },
  ];
  g.fillStyle(C.outline, 1);
  g.fillPoints(V(band.map((p, i) => ({ x: p.x + (i === 0 || i === 3 ? -2 : 2), y: p.y + (i < 2 ? -2 : 2) }))), true);
  g.fillStyle(CAR.scarf, 1);
  g.fillPoints(V(band), true);
  g.fillStyle(CAR.scarfStripe, 1);
  for (const sx of [-9, -1, 7]) g.fillRect(sx, 11.2, 2.4, 5.6);
}

/** Scarf tail, hanging from the knot (origin) toward -x. CarView turns it with the wind. */
export function drawScarfTail(g: G) {
  const pts: P[] = [
    { x: 1, y: -3 },
    { x: -9, y: -4.5 },
    { x: -20, y: -3 },
    { x: -28, y: -5 },
    { x: -27, y: 2.5 },
    { x: -19, y: 4.5 },
    { x: -9, y: 4 },
    { x: 1, y: 3.5 },
  ];
  g.fillStyle(C.outline, 1);
  g.fillPoints(V(pts.map((p) => ({ x: p.x * 1.08, y: p.y * 1.45 }))), true);
  g.fillStyle(CAR.scarf, 1);
  g.fillPoints(V(pts), true);
  g.fillStyle(CAR.scarfStripe, 1);
  g.fillRect(-12, -3.5, 2.4, 7.5);
  g.fillRect(-21, -3, 2.4, 7);
  // Fringe
  g.lineStyle(1.6, CAR.scarf, 1);
  for (const fy of [-3, 0, 3]) g.lineBetween(-27, fy, -31, fy + 0.8);
}

// ------------------------------------------------------------------ vine antenna, lamp beam, puff

/** Curly vine growing up from its foot (origin), with a leaf. CarView sways it. */
export function drawVine(g: G) {
  const pts: P[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    pts.push({ x: -Math.sin(t * 2.6) * 6 - t * 4, y: -t * 26 });
  }
  g.lineStyle(6, C.outline, 1);
  g.strokePoints(V(pts), false);
  g.lineStyle(3.2, CAR.vine, 1);
  g.strokePoints(V(pts), false);
  // Curl at the top
  const top = pts[pts.length - 1];
  strokeArc(g, top.x + 3.5, top.y, 4, 4, Math.PI * 0.9, Math.PI * 2.4, 4.5, C.outline);
  strokeArc(g, top.x + 3.5, top.y, 4, 4, Math.PI * 0.9, Math.PI * 2.4, 2.2, CAR.vine);
  // Leaf
  const lx = pts[9].x;
  const ly = pts[9].y;
  const leaf: P[] = [
    { x: lx, y: ly },
    { x: lx + 7, y: ly - 7 },
    { x: lx + 15, y: ly - 6 },
    { x: lx + 9, y: ly + 1 },
  ];
  g.fillStyle(C.outline, 1);
  g.fillPoints(V(leaf.map((p) => ({ x: p.x + (p.x - lx) * 0.18, y: p.y + (p.y - ly) * 0.25 + 0.5 }))), true);
  g.fillStyle(CAR.leaf, 1);
  g.fillPoints(V(leaf), true);
  g.lineStyle(1.2, CAR.vineDark, 1);
  g.lineBetween(lx + 1, ly - 0.5, lx + 12, ly - 5);
  // Stump where it grows from the shell
  g.fillStyle(C.outline, 1);
  g.fillEllipse(0, 1, 12, 7);
  g.fillStyle(CAR.vineDark, 1);
  g.fillEllipse(0, 0.5, 8, 4);
}

/** Soft cone of lamp light toward +x from the origin. Shown with additive blending. */
export function drawBeam(g: G) {
  const len = 54;
  const steps = 14;
  for (let k = 0; k < steps; k++) {
    const f = 1 - k / steps;
    const reach = len * (0.35 + 0.65 * f);
    const spread = 3 + 15 * f;
    g.fillStyle(CAR.glow, 0.03);
    g.fillTriangle(0, -1.5, reach, -spread * 0.8, reach, spread);
  }
  g.fillStyle(CAR.lampCore, 0.22);
  g.fillCircle(0, 0, 5);
}

/** One ghostly exhaust puff. */
export function drawPuff(g: G) {
  g.fillStyle(CAR.puff, 0.95);
  g.fillCircle(0, 0, 6);
  g.fillCircle(-4, 2, 4);
  g.fillCircle(4, 2.5, 3.5);
  g.fillStyle(0xffffff, 0.9);
  g.fillCircle(-1.5, -2, 2);
}
