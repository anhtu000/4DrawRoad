// Search for the cheapest ink that still wins a level, with the drawing rules and the physics the
// game uses. Starting from the level's reference solution, each line may be dropped, trimmed at
// either end, split with a hole in the middle, or replaced by a short ramp or pad at either end.
// Coordinate descent over the lines, a few passes. A candidate only counts when it also wins with a
// little hand shake (ROBUST_SEEDS runs with +-2 units of noise per point), so par never rests on a
// pixel-perfect trick. levelcheck asks for more shake (+-6) on levels whose par comes from the
// cheapest win: a phone finger is not more precise than that (decision 30/10).
//
// Used by tools/levelcheck.ts (leak check on "patch" levels, par on "cheapest" levels) and by
// tools/cheapest.ts. The result is an upper bound: a player can still find something cheaper.
import { drawLike, inkUsed, inkZones } from '../src/logic/ink.ts';
import type { LevelDef, Pt } from '../src/logic/types.ts';
import { Sim } from '../src/sim/sim.ts';
import { Matter } from './matter.ts';

export interface SearchResult {
  /** Lines as authored (before the drawing rules), ready to store in the level file. */
  lines: Pt[][];
  /** Ink after the drawing rules (snapping, cutting, smoothing). */
  ink: number;
  tried: number;
}

const ROBUST_SEEDS = 4;

export function drawLines(level: LevelDef, lines: Pt[][]): Pt[][] {
  const zones = inkZones(level);
  const strokes: Pt[][] = [];
  for (const line of lines) if (line.length >= 2) strokes.push(...drawLike(line, zones, strokes));
  return strokes;
}

export function runLines(level: LevelDef, lines: Pt[][]) {
  const strokes = drawLines(level, lines);
  const result = new Sim(Matter, level, strokes).runToEnd();
  return { result, ink: inkUsed(strokes) };
}

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function shake(lines: Pt[][], seed: number, amp = 2): Pt[][] {
  const r = rng(seed);
  return lines.map((l) => l.map((p) => [p[0] + (r() * 2 - 1) * amp, p[1] + (r() * 2 - 1) * amp] as Pt));
}

function good(level: LevelDef, lines: Pt[][], needCandy: boolean) {
  const { result } = runLines(level, lines);
  return result.outcome === 'win' && (!needCandy || result.candies.length === level.candies.length);
}

/** Wins as drawn and with hand shake: `seeds` copies with every point moved up to `amp` units. */
export function robustWin(level: LevelDef, lines: Pt[][], needCandy: boolean, seeds = ROBUST_SEEDS, amp = 2) {
  if (!good(level, lines, needCandy)) return false;
  for (let k = 1; k <= seeds; k++) if (!good(level, shake(lines, 7919 * k, amp), needCandy)) return false;
  return true;
}

function lengthOf(line: Pt[]) {
  let sum = 0;
  for (let i = 1; i < line.length; i++) sum += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
  return sum;
}

/** The part of a polyline between fractions t0 and t1 of its length. */
function part(line: Pt[], t0: number, t1: number): Pt[] {
  const total = lengthOf(line);
  const at = (t: number): Pt => {
    let d = t * total;
    for (let i = 1; i < line.length; i++) {
      const seg = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
      if (d <= seg || i === line.length - 1) {
        const f = seg ? Math.min(1, d / seg) : 0;
        return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * f, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * f];
      }
      d -= seg;
    }
    return line[line.length - 1];
  };
  const out: Pt[] = [at(t0)];
  let acc = 0;
  for (let i = 1; i < line.length; i++) {
    acc += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    const t = acc / total;
    if (t > t0 + 1e-6 && t < t1 - 1e-6) out.push(line[i]);
  }
  out.push(at(t1));
  return out;
}

const r1 = (p: Pt): Pt => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10];

/** Replacement options for one line (each option is one or two lines), rounded to 0.1 unit. */
function options(line: Pt[]): Pt[][][] {
  return rawOptions(line).map((opt) => opt.map((l) => l.map(r1)));
}

function rawOptions(line: Pt[]): Pt[][][] {
  const opts: Pt[][][] = [[]];
  const T = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
  for (const t0 of T) for (const cut of T) {
    const t1 = 1 - cut;
    if (t1 - t0 >= 0.15 && (t0 > 0 || cut > 0)) opts.push([part(line, t0, t1)]);
  }
  // Hole in the middle: keep [0, a] and [b, 1].
  for (const a of [0.15, 0.25, 0.35, 0.45]) for (const b of [0.55, 0.65, 0.75, 0.85]) opts.push([part(line, 0, a), part(line, b, 1)]);
  // Short ramps or pads at either end, pointing into the gap.
  for (const end of [0, 1]) {
    const a = end === 0 ? line[0] : line[line.length - 1];
    const b = end === 0 ? line[1] : line[line.length - 2];
    const dx = Math.sign(b[0] - a[0]) || 1;
    for (const ang of [0, 10, 20, 30, 40]) for (const len of [20, 35, 50, 70, 90]) {
      const r = (ang * Math.PI) / 180;
      opts.push([[a, [a[0] + dx * Math.cos(r) * len, a[1] - Math.sin(r) * len]]]);
    }
  }
  return opts;
}

/**
 * Cheapest robust win found from `start` (default: the level's reference solution). Lines are
 * changed one at a time; each line's options come from its original shape.
 */
export function findCheapest(
  level: LevelDef,
  needCandy: boolean,
  start: Pt[][] = level.solution,
  passes = 3,
  seeds = ROBUST_SEEDS,
  /** Extra test for a cheaper candidate that already passed the shaken copies (for example a full noise test). */
  accept: (lines: Pt[][]) => boolean = () => true,
  /** Hand shake of the shaken copies, units per point. */
  amp = 2,
): SearchResult | null {
  let tried = 0;
  if (!robustWin(level, start, needCandy, seeds, amp)) return null;
  // Every line slot holds one or two lines.
  let slots: Pt[][][] = start.map((l) => [l]);
  const flat = (s: Pt[][][]) => s.flat().filter((l) => l.length >= 2);
  let best = runLines(level, flat(slots)).ink;
  for (let pass = 0; pass < passes; pass++) {
    let improved = false;
    for (let i = 0; i < slots.length; i++) {
      for (const opt of options(start[i])) {
        const trial = slots.map((s, k) => (k === i ? opt : s));
        const lines = flat(trial);
        const { result, ink } = runLines(level, lines);
        tried++;
        if (ink >= best - 0.5) continue;
        if (result.outcome !== 'win' || (needCandy && result.candies.length < level.candies.length)) continue;
        if (!robustWin(level, lines, needCandy, seeds, amp) || !accept(lines)) continue;
        best = ink;
        slots = trial;
        improved = true;
      }
    }
    if (!improved) break;
  }
  // Options are already rounded to 0.1 (see options()), so what is stored is exactly what was tested.
  const lines = flat(slots);
  return { lines, ink: runLines(level, lines).ink, tried };
}
