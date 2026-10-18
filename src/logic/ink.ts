// Where ink may go, how a stroke is cut at forbidden places, and where its ends snap.
// Shared by the drawing input and the level tools, so an authored solution follows the same rules.
import { INK, TUNING } from '../sim/tuning.ts';
import { closestOnSegment, dist, downNormal, inRect, polylineLength, simplify } from './geom.ts';
import type { LevelDef, Pt, RectDef } from './types.ts';

interface RoadSeg {
  a: Pt;
  b: Pt;
  n: Pt;
  ghost: boolean;
}

export interface InkZones {
  rects: RectDef[];
  roads: RoadSeg[];
}

/** Car start box, so a stroke can never trap the car. */
export function carBox(level: LevelDef): RectDef {
  const { x, y } = level.car;
  return { x: x - 64, y: y - 90, w: 128, h: 96 };
}

/** House box: ink stays off the house. The bottom 40 units are free, so a patch can run up to a door. */
export function houseBox(level: LevelDef): RectDef {
  const { x, y } = level.house;
  return { x: x - 50, y: y - 150, w: 100, h: 110 };
}

export function inkZones(level: LevelDef): InkZones {
  const rects: RectDef[] = [...level.walls, ...level.blocks, houseBox(level), carBox(level)];
  const roads: RoadSeg[] = [];
  for (const road of level.roads) {
    for (let i = 1; i < road.pts.length; i++) {
      const a = road.pts[i - 1];
      const b = road.pts[i];
      roads.push({ a, b, n: downNormal(a, b), ghost: !!road.ghost });
    }
  }
  return { rects, roads };
}

const HALF = TUNING.inkThickness / 2;

/**
 * True where the center line of a stroke may not pass: outside the drawing area, inside walls,
 * blocks, the house or the car's start box, and inside the body of a road. The top few units of a
 * road are allowed so a patch can sit flush with it. Ghost planks are never in the way: drawing
 * over them is a choice the player may make (v0 section 3.2).
 */
export function forbidden(p: Pt, zones: InkZones): boolean {
  if (p[0] < 6 || p[0] > 714 || p[1] < INK.top || p[1] > INK.bottom) return true;
  for (const r of zones.rects) if (inRect(p, r, HALF)) return true;
  const deep = TUNING.roadThickness + HALF;
  for (const s of zones.roads) {
    if (s.ghost) continue;
    const dx = s.b[0] - s.a[0];
    const dy = s.b[1] - s.a[1];
    const len2 = dx * dx + dy * dy;
    const t = ((p[0] - s.a[0]) * dx + (p[1] - s.a[1]) * dy) / len2;
    if (t < 0 || t > 1) continue;
    const depth = (p[0] - s.a[0]) * s.n[0] + (p[1] - s.a[1]) * s.n[1];
    if (depth > INK.roadSink && depth < deep) return true;
  }
  return false;
}

const SAMPLE = 3;

/**
 * Splits a raw line into the parts that are allowed. A part ends at the last allowed point before a
 * forbidden place and the next part starts at the first allowed point after it (v0: "the stroke is
 * cut at the edge, no ink is charged").
 */
export function cutLine(pts: Pt[], zones: InkZones): Pt[][] {
  const runs: Pt[][] = [];
  let cur: Pt[] = [];
  const close = () => {
    if (cur.length >= 2 && polylineLength(cur) >= INK.minLength) runs.push(cur);
    cur = [];
  };
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    if (i === 0) {
      if (!forbidden(p, zones)) cur.push(p);
      continue;
    }
    const prev = pts[i - 1];
    const d = dist(prev, p);
    const n = Math.max(1, Math.ceil(d / SAMPLE));
    let lastOk: Pt | null = cur.length ? prev : null;
    for (let k = 1; k <= n; k++) {
      const q: Pt = [prev[0] + ((p[0] - prev[0]) * k) / n, prev[1] + ((p[1] - prev[1]) * k) / n];
      if (forbidden(q, zones)) {
        if (cur.length) {
          if (lastOk && lastOk !== cur[cur.length - 1]) cur.push(lastOk);
          close();
        }
        lastOk = null;
      } else {
        if (!cur.length) cur.push(q);
        lastOk = q;
      }
    }
    if (cur.length && lastOk && lastOk !== cur[cur.length - 1]) cur.push(lastOk);
  }
  close();
  return runs;
}

/**
 * Where a stroke end should snap: the top of a nearby road (sunk by half the ink thickness, so the
 * patch is flush with the road) or the end of an existing stroke. Null when nothing is close.
 */
export function snapPoint(p: Pt, zones: InkZones, strokes: Pt[][], radius: number = INK.snapRadius): Pt | null {
  let best: Pt | null = null;
  let bestD = radius;
  for (const s of zones.roads) {
    const c = closestOnSegment(p, s.a, s.b);
    if (c.d < bestD) {
      const q: Pt = [c.pt[0] + s.n[0] * HALF, c.pt[1] + s.n[1] * HALF];
      if (!forbidden(q, zones)) {
        best = q;
        bestD = c.d;
      }
    }
  }
  for (const st of strokes) {
    for (const end of [st[0], st[st.length - 1]]) {
      const d = dist(p, end);
      if (d < bestD) {
        best = [end[0], end[1]];
        bestD = d;
      }
    }
  }
  return best;
}

/** A finished stroke: smoothed, as the physics and the ink count see it. */
export function finishStroke(raw: Pt[]): Pt[] {
  return simplify(raw, INK.simplifyEps);
}

/** Ink used by a set of strokes. */
export function inkUsed(strokes: Pt[][]): number {
  return strokes.reduce((sum, s) => sum + polylineLength(s), 0);
}

/**
 * Applies the drawing rules to an authored line (level solutions, tools): the ends snap like a
 * finger's would, forbidden parts are cut out, and each part is smoothed.
 */
export function drawLike(line: Pt[], zones: InkZones, existing: Pt[][] = []): Pt[][] {
  const pts = line.map((p) => [p[0], p[1]] as Pt);
  const s0 = snapPoint(pts[0], zones, existing);
  if (s0) pts[0] = s0;
  const s1 = snapPoint(pts[pts.length - 1], zones, existing);
  if (s1) pts[pts.length - 1] = s1;
  // Densify like a finger would (a point every few units), so cutting works the same way.
  const dense: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const n = Math.max(1, Math.ceil(dist(a, b) / INK.minSpacing));
    for (let k = 1; k <= n; k++) dense.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return cutLine(dense, zones).map(finishStroke);
}
