// Cheapest ink that still wins, per level (22/10, after playtest round 1 showed players beating par
// by 30-45%). Each reference stroke may be dropped, trimmed at either end, or replaced by a short ramp
// up from either edge; coordinate descent, one stroke at a time, two passes. It only finds what these
// variants can express, so a human can still find cheaper: treat the result as an upper bound.
//   npm run cheapest
import { drawLike, inkUsed, inkZones } from '../src/logic/ink.ts';
import type { LevelDef, Pt } from '../src/logic/types.ts';
import { LEVELS } from '../src/levels/index.ts';
import { Sim } from '../src/sim/sim.ts';
import { starLimits } from '../src/logic/score.ts';
import { Matter } from './matter.ts';

const draw = (level: LevelDef, lines: Pt[][]) => { const z = inkZones(level); const s: Pt[][] = []; for (const l of lines) if (l.length >= 2) s.push(...drawLike(l, z, s)); return s; };
const run = (level: LevelDef, lines: Pt[][]) => { const st = draw(level, lines); const r = new Sim(Matter, level, st).runToEnd(); return { r, ink: inkUsed(st) }; };

function trim(line: Pt[], t0: number, t1: number): Pt[] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < line.length; i++) { const d = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]); seg.push(d); total += d; }
  const at = (t: number): Pt => { let d = t * total; for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? Math.min(1, d / seg[i]) : 0; return [line[i][0] + (line[i + 1][0] - line[i][0]) * f, line[i][1] + (line[i + 1][1] - line[i][1]) * f]; } d -= seg[i]; } return line[line.length - 1]; };
  const out: Pt[] = [at(t0)];
  let acc = 0;
  for (let i = 0; i < seg.length; i++) { acc += seg[i]; const t = acc / total; if (t > t0 && t < t1) out.push(line[i + 1]); }
  out.push(at(t1));
  return out;
}

function variants(line: Pt[]): Pt[][] {
  const v: Pt[][] = [[]];
  const T = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  for (const t0 of T) for (const t1 of T.map((x) => 1 - x)) if (t1 - t0 >= 0.2) v.push(trim(line, t0, t1));
  // short ramps up from either end
  for (const end of [0, 1]) {
    const a = end === 0 ? line[0] : line[line.length - 1];
    const b = end === 0 ? line[1] : line[line.length - 2];
    const dx = Math.sign(b[0] - a[0]) || 1;
    for (const ang of [10, 20, 30]) for (const L of [30, 50, 70, 90]) {
      const r = (ang * Math.PI) / 180;
      v.push([a, [a[0] + dx * Math.cos(r) * L, a[1] - Math.sin(r) * L]]);
    }
  }
  return v;
}

for (const level of LEVELS) {
  const ref = run(level, level.solution);
  for (const needCandy of [true, false]) {
    let cur = level.solution.map((l) => l.slice());
    let best = ref.ink;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < cur.length; i++) {
        for (const cand of variants(level.solution[i])) {
          const trial = cur.map((l, k) => (k === i ? cand : l));
          const { r, ink } = run(level, trial);
          if (r.outcome !== 'win') continue;
          if (needCandy && r.candies.length < level.candies.length) continue;
          if (ink < best - 0.5) { best = ink; cur = trial; }
        }
      }
    }
    const lim = starLimits(level.ink.par, level.ink.budget);
    console.log(`level ${level.id} ${needCandy ? 'all candy' : 'any candy'}: cheapest found ${best.toFixed(0)} ink (reference ${ref.ink.toFixed(0)}, par ${level.ink.par}, 3-star limit ${lim.three.toFixed(0)})`);
  }
}
