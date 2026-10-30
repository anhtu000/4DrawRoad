// Level check (v0 section 10.2, brief 5.3, par rules of 22/10 in CLAUDE.md 5e). Runs every level
// through the drawing rules and the physics the game uses, and checks:
//   1. the reference solution wins and collects every candy, also with a little hand shake
//   2. drawing nothing loses
//   3. every gap matters: leaving any one gap unpatched loses
//   4. straight lines across every gap win on levels 1-4 (easy levels set no traps) and lose on the
//      peak levels 14 and 20
//   5. noise: the reference solution with +-2 units on every point wins at least 95 of 100 times
//   6. the same strokes give exactly the same run twice
//   7. par and budget, by the level's rule:
//      patch     T = reference x 1.1, B = T x ratio. Fails when the cheapest win found
//                (tools/search.ts) costs less than LEAK of the reference: the level leaks.
//      cheapest  T = cheapest all-candy win that survives +-6 hand shake x 1.1 (stored as `best`), B = the larger of
//                T x ratio and reference x 1.15, so the obvious solution always fits. Fails when
//                the search finds something cheaper than `best` (run --fix), or `best` is fragile.
//   8. extra checks per level (below)
//
//   npm run levelcheck                 check all levels
//   npm run levelcheck -- --fix        also write par, budget and best into the level files
//   npm run levelcheck -- --trace 5    print the car's path for level 5
//   npm run levelcheck -- 4 5          only some levels
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { inkUsed } from '../src/logic/ink.ts';
import { levelScore } from '../src/logic/score.ts';
import type { LevelDef, Pt } from '../src/logic/types.ts';
import { LEVELS } from '../src/levels/index.ts';
import { Sim, type SimResult } from '../src/sim/sim.ts';
import { Matter } from './matter.ts';
import { drawLines, findCheapest, robustWin, runLines, shake, shakeWins } from './search.ts';

/** B/T per level, from the v0 level table (section 6.2). */
const RATIO: Record<number, number> = {
  1: 3.0, 2: 2.8, 3: 2.6, 4: 2.4, 5: 2.2, 6: 2.0, 7: 1.6, 8: 1.9, 9: 1.55, 10: 1.8,
  11: 1.5, 12: 1.75, 13: 1.45, 14: 1.25, 15: 1.7, 16: 1.4, 17: 1.65, 18: 1.35, 19: 1.6, 20: 1.2,
};
/** Peak levels: straight lines across every gap must lose (v0 section 10.2, step 4). */
const PEAKS = [14, 20];
/** Patch levels: the cheapest win found may not cost less than this share of the reference. */
const LEAK = 0.65;
/** Cheapest levels: the budget leaves this much room over the obvious solution. */
const OBVIOUS_ROOM = 1.15;
/**
 * Cheapest levels: `best` must win this often out of 100 with +-6 units of shake on every point
 * (about 3-4 px on a phone). With +-2 the cheapest wins were pixel-perfect tricks that a bot drawing
 * through the real pointer could not repeat (30/10, report v5 section 14).
 */
const BEST_NOISE_WINS = 80;
/** Shaken copies a candidate must also win in the search: 4 for the leak check, more for `best`. */
const SEEDS = { patch: 4, cheapest: 12 } as const;
/** Hand shake for the search, units per point: the leak check keeps +-2, par on cheapest levels +-6. */
const AMP = { patch: 2, cheapest: 6 } as const;

interface Extra {
  name: string;
  lines: Pt[][];
  expect: 'win' | 'lose' | 'win-no-candy';
  /** Print stars and ink for this one. */
  report?: boolean;
}

/** Extra checks per level. Lines are drawn with the same rules as a finger. */
const EXTRAS: Record<number, Extra[]> = {
  3: [{ name: 'patch without the ramp wins without the candy', lines: [[[470, 687], [300, 582]]], expect: 'win-no-candy' }],
  4: [{ name: 'straight bridges win without candies', lines: [[[320, 463], [470, 533]], [[440, 787], [220, 787]]], expect: 'win-no-candy', report: true }],
  5: [
    { name: 'straight line across the hole is cut by the stone', lines: [[[240, 527], [420, 527]], [[600, 767], [450, 767]]], expect: 'lose' },
    { name: 'flat bridge on the lower road misses the high candy', lines: [[[160, 527], [238, 482]], [[600, 767], [450, 767]]], expect: 'win-no-candy' },
    { name: 'ramp over the stone (the v0 lesson)', lines: [[[160, 527], [238, 482]], [[600, 767], [530, 745], [450, 767]]], expect: 'win', report: true },
  ],
  10: [
    { name: 'flat bridge on the bottom road misses the high candy', lines: [[[300, 447], [460, 447]], [[425, 667], [500, 667]], [[280, 907], [480, 907]]], expect: 'win-no-candy' },
    { name: 'no patch: the car falls through the plank', lines: [[[300, 447], [460, 447]], [[280, 907], [380, 877], [480, 907]]], expect: 'lose' },
    { name: 'patch too short: the car falls through the plank', lines: [[[300, 447], [460, 447]], [[260, 667], [340, 667]], [[280, 907], [380, 877], [480, 907]]], expect: 'lose' },
    { name: 'short patch timed with the plank', lines: [[[300, 447], [460, 447]], [[425, 667], [500, 667]], [[280, 907], [380, 877], [480, 907]]], expect: 'win', report: true },
  ],
  6: [{ name: 'straight lines are cut by the fog', lines: [[[300, 420], [480, 380]], [[520, 640], [300, 600]], [[290, 860], [480, 820]]], expect: 'lose' }],
  7: [{ name: 'low road (no ramp up to the ledge) misses the ledge candies', lines: [[[600, 647], [437, 545], [323, 545], [290, 607]], [[200, 867], [276, 833]], [[380, 833], [470, 827]]], expect: 'win-no-candy', report: true }],
  8: [
    { name: 'straight bridge under the first bat', lines: [[[380, 380], [200, 340]], [[300, 580], [500, 580]], [[480, 800], [260, 800]]], expect: 'lose' },
    { name: 'flat bridge on the middle road misses the candy by the bat', lines: [[[560, 387], [400, 300], [215, 300], [200, 347]], [[300, 587], [500, 587]], [[600, 807], [450, 742], [290, 742], [260, 807]]], expect: 'win-no-candy' },
  ],
  11: [{ name: 'no patch on the first plank: it is gone when the car gets there', lines: [[[600, 587], [450, 520], [290, 520], [260, 587]], [[190, 807], [470, 807]], [[480, 1027], [370, 995], [260, 1027]]], expect: 'lose' }],
  14: [{ name: 'second way: ramp over the pumpkin and a long bridge', lines: [[[570, 347], [437, 267], [293, 267], [260, 347]], [[150, 587], [300, 510], [400, 510], [450, 587], [572, 587]], [[620, 847], [520, 785], [340, 785], [320, 847]], [[240, 847], [175, 825], [110, 847]]], expect: 'win-no-candy', report: true }],
  18: [{ name: 'flat bridge under the lantern: the gate stays shut', lines: [[[130, 367], [230, 295], [365, 295], [380, 367]], [[500, 367], [560, 345], [620, 367]], [[200, 747], [400, 747]], [[600, 1007], [470, 945], [290, 945], [270, 1007]]], expect: 'lose' }],
  20: [
    { name: 'second way: ramp over the pumpkin and a long bridge', lines: [[[130, 337], [230, 265], [365, 265], [380, 337]], [[470, 337], [570, 337]], [[600, 567], [470, 510], [310, 510], [300, 567]], [[620, 827], [505, 745], [430, 745], [400, 827], [200, 827]], [[150, 1087], [210, 1030], [350, 1030], [360, 1087]], [[480, 1087], [540, 1065], [600, 1087]]], expect: 'win', report: true },
    { name: 'dip under the fog misses the lantern: the gate stays shut', lines: [[[130, 337], [230, 265], [365, 265], [380, 337]], [[470, 337], [570, 337]], [[480, 567], [440, 645], [340, 645], [300, 567]], [[300, 827], [200, 827]], [[150, 1087], [210, 1030], [350, 1030], [360, 1087]], [[480, 1087], [540, 1065], [600, 1087]]], expect: 'lose' },
  ],
};

const args = process.argv.slice(2);
const fix = args.includes('--fix');
const traceId = args.includes('--trace') ? Number(args[args.indexOf('--trace') + 1]) : 0;
const only = args.filter((a, i) => /^\d+$/.test(a) && args[i - 1] !== '--trace').map(Number);

const describe = (r: SimResult, level: LevelDef) => `${r.outcome} in ${(r.steps / 60).toFixed(1)} s, candy ${r.candies.length}/${level.candies.length}`;
const fileOf = (level: LevelDef) => fileURLToPath(new URL(`../src/levels/${String(level.id).padStart(2, '0')}.json`, import.meta.url));

function noiseWins(level: LevelDef, lines: Pt[][], amp = 2) {
  let wins = 0;
  let candyWins = 0;
  for (let i = 0; i < 100; i++) {
    const r = runLines(level, shake(lines, 1000 + i * 37, amp)).result;
    if (r.outcome === 'win') wins++;
    if (r.outcome === 'win' && r.candies.length === level.candies.length) candyWins++;
  }
  return { wins, candyWins };
}

let failures = 0;
const rows: string[] = [];

for (const level of LEVELS) {
  if (only.length && !only.includes(level.id)) continue;
  const fail = (msg: string) => {
    failures++;
    console.log(`  FAIL ${msg}`);
  };
  const t0 = Date.now();
  console.log(`\nLevel ${level.id} ${level.name} (par rule: ${level.parRule})`);
  const strokes = drawLines(level, level.solution);
  const used = inkUsed(strokes);
  const res = new Sim(Matter, level, strokes).runToEnd();

  if (traceId === level.id) {
    const sim = new Sim(Matter, level, strokes);
    while (!sim.result && sim.steps < 2400) {
      sim.step();
      if (sim.steps % 6 === 0) console.log(`    t ${(sim.steps / 60).toFixed(2)}  x ${sim.chassis.position.x.toFixed(0)} y ${sim.chassis.position.y.toFixed(0)} a ${((sim.chassis.angle * 180) / Math.PI).toFixed(0)} dir ${sim.dir} ground ${sim.grounded ? 1 : 0}`);
      for (const e of sim.events.splice(0)) console.log(`    event ${JSON.stringify(e)}`);
    }
    console.log(`    result ${JSON.stringify(sim.result)}`);
  }

  // 1
  const allCandy = res.candies.length === level.candies.length;
  if (res.outcome !== 'win' || !allCandy) fail(`reference: ${describe(res, level)}`);
  else if (!robustWin(level, level.solution, true)) fail('reference wins, but not with a little hand shake');
  else console.log(`  ok   reference: ${describe(res, level)}, ink ${used.toFixed(0)}`);

  // 2
  const empty = runLines(level, []).result;
  if (empty.outcome === 'win') fail('drawing nothing wins');
  else console.log(`  ok   no ink: ${empty.outcome}`);

  // 3: leave one gap open (the reference lines that start or end at it removed). Optional gaps
  // (a fork to a candy route) may be left open.
  level.gaps.forEach((g, gi) => {
    if (g.optional) return;
    const near = (p: Pt) => [g.a, g.b].some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 30);
    const lines = level.solution.filter((line) => !near(line[0]) && !near(line[line.length - 1]));
    if (lines.length === level.solution.length) return;
    const r = runLines(level, lines).result;
    if (r.outcome === 'win') fail(`gap ${gi + 1} left open still wins (${describe(r, level)})`);
    else console.log(`  ok   gap ${gi + 1} left open: ${r.outcome}`);
  });

  // 4
  const straight = runLines(
    level,
    level.gaps.filter((g) => !g.optional).map((g) => [g.a, g.b]),
  ).result;
  if (level.id <= 4) {
    if (straight.outcome !== 'win') fail(`straight lines across the gaps: ${describe(straight, level)}`);
    else console.log(`  ok   straight lines win (${describe(straight, level)})`);
  } else if (PEAKS.includes(level.id)) {
    if (straight.outcome === 'win') fail(`peak level: straight lines across the gaps win (${describe(straight, level)})`);
    else console.log(`  ok   peak level: straight lines lose (${describe(straight, level)})`);
  } else console.log(`  info straight lines: ${describe(straight, level)}`);

  // 5
  const noise = noiseWins(level, level.solution);
  if (noise.wins < 95) fail(`noise +-2: won ${noise.wins}/100 (all candy ${noise.candyWins})`);
  else console.log(`  ok   noise +-2: won ${noise.wins}/100, all candy ${noise.candyWins}/100`);

  // 6
  const again = new Sim(Matter, level, drawLines(level, level.solution)).runToEnd();
  if (again.steps !== res.steps || again.candies.length !== res.candies.length) fail('same strokes, different run');
  else console.log('  ok   repeatable');

  // 7
  const ratio = RATIO[level.id] ?? 2;
  let par: number;
  let budget: number;
  let bestInk = used;
  let bestLines: Pt[][] | undefined;
  const seeds = [level.solution, ...(level.best ? [level.best] : []), ...(level.alt ?? [])];
  let found: { lines: Pt[][]; ink: number } | null = null;
  // Cheapest levels: par may only rest on a win that survives the full noise test.
  const sturdy = level.parRule === 'cheapest' ? (lines: Pt[][]) => noiseWins(level, lines, AMP.cheapest).candyWins >= BEST_NOISE_WINS : undefined;
  // Cheapest levels: a quick win rate first (16 of 20 shaken copies), then the full 100-run test.
  // With +-6 shake even the reference loses now and then, so "every copy wins" would be too strict.
  const quick = level.parRule === 'cheapest' ? (lines: Pt[][]) => shakeWins(level, lines, true, 20, AMP.cheapest) >= 16 : undefined;
  for (const seed of seeds) {
    const r = findCheapest(level, true, seed, 3, SEEDS[level.parRule], sturdy, AMP[level.parRule], quick);
    if (r && (!found || r.ink < found.ink)) found = r;
  }
  // Cheapest levels: keep going from the cheapest so far until it stops improving, so --fix and a
  // later check agree. Patch levels stop after one round: the leak check asks what a normal stroke
  // can save (ends cut short, one hole), not what a dotted line of many tiny pieces can (on a
  // 35-degree climb a line with several 20-40 unit holes still wins, at about half the ink; it still
  // only earns the same 3 stars, so it is noted in the report rather than failed here).
  for (let round = 0; found && level.parRule === 'cheapest' && round < 6; round++) {
    const r = findCheapest(level, true, found.lines, 3, SEEDS[level.parRule], sturdy, AMP[level.parRule], quick);
    if (!r || r.ink >= found.ink - 0.5) break;
    found = r;
  }
  if (level.parRule === 'patch') {
    par = Math.round(used * 1.1);
    budget = Math.round(par * ratio);
    if (found && found.ink < used * LEAK) fail(`leak: a win with ${found.ink.toFixed(0)} ink (${((found.ink / used) * 100).toFixed(0)}% of the reference), lines ${JSON.stringify(found.lines)}`);
    else console.log(`  ok   no leak: cheapest found ${found ? found.ink.toFixed(0) : '-'} ink (${found ? ((found.ink / used) * 100).toFixed(0) : '-'}% of the reference, limit ${LEAK * 100}%)`);
  } else {
    const stored = level.best ? runLines(level, level.best) : null;
    const storedOk = !!stored && stored.result.outcome === 'win' && stored.result.candies.length === level.candies.length && quick!(level.best!);
    const storedInk = storedOk ? stored!.ink : Infinity;
    if (found && found.ink < storedInk - 1) {
      if (fix) {
        bestLines = found.lines;
        bestInk = found.ink;
        console.log(`  fix  best ${Number.isFinite(storedInk) ? storedInk.toFixed(0) : 'none'} -> ${found.ink.toFixed(0)} ink`);
      } else {
        fail(`a cheaper win exists: ${found.ink.toFixed(0)} ink (best in the file: ${Number.isFinite(storedInk) ? storedInk.toFixed(0) : 'none'}); run with --fix`);
        if (storedOk) bestInk = storedInk;
      }
    } else if (storedOk) {
      bestLines = level.best;
      bestInk = storedInk;
      console.log(`  ok   best: ${storedInk.toFixed(0)} ink, nothing cheaper found`);
    } else fail('no robust cheap win found');
    if (bestLines) {
      const n = noiseWins(level, bestLines, AMP.cheapest);
      if (n.candyWins < BEST_NOISE_WINS) fail(`best is fragile: noise +-6 won ${n.wins}/100, all candy ${n.candyWins}/100`);
      else console.log(`  ok   best with noise +-6: won ${n.wins}/100, all candy ${n.candyWins}/100`);
    }
    par = Math.round(bestInk * 1.1);
    budget = Math.max(Math.round(par * ratio), Math.round(used * OBVIOUS_ROOM));
  }
  const changed = Math.abs(par - level.ink.par) > 1 || Math.abs(budget - level.ink.budget) > 2 || (bestLines && JSON.stringify(bestLines) !== JSON.stringify(level.best));
  if (changed) {
    if (fix) {
      const data = JSON.parse(readFileSync(fileOf(level), 'utf8'));
      data.ink = { budget, par };
      if (bestLines) data.best = bestLines;
      writeFileSync(fileOf(level), JSON.stringify(data, null, 2) + '\n');
      console.log(`  fix  par ${level.ink.par} -> ${par}, budget ${level.ink.budget} -> ${budget}`);
      level.ink = { budget, par };
      if (bestLines) level.best = bestLines;
    } else fail(`par ${level.ink.par} / budget ${level.ink.budget}, rule says ${par} / ${budget} (run with --fix)`);
  } else console.log(`  ok   par ${level.ink.par}, budget ${level.ink.budget} (B/T ${(level.ink.budget / level.ink.par).toFixed(2)})`);

  // 8
  for (const extra of EXTRAS[level.id] ?? []) {
    const { result: r, ink } = runLines(level, extra.lines);
    const ok = extra.expect === 'win' ? r.outcome === 'win' : extra.expect === 'lose' ? r.outcome !== 'win' : r.outcome === 'win' && r.candies.length < level.candies.length;
    const sc = levelScore(ink, level.ink.par, level.ink.budget, r.candies.length);
    const detail = `${describe(r, level)}${extra.report ? `, ink ${ink.toFixed(0)}, ${sc.stars} stars (${sc.ink})` : ''}`;
    if (!ok) fail(`${extra.name}: ${detail}`);
    else console.log(`  ok   ${extra.name}: ${detail}`);
  }

  const refScore = levelScore(used, level.ink.par, level.ink.budget, res.candies.length);
  const bestScore = levelScore(bestInk, level.ink.par, level.ink.budget, level.candies.length);
  rows.push(
    `| ${level.id} | ${level.name} | ${level.parRule} | ${level.ink.par} | ${level.ink.budget} | ${level.candies.length} | ${(res.steps / 60).toFixed(1)} | ${used.toFixed(0)} (${refScore.stars}★) | ${found ? found.ink.toFixed(0) : '-'} | ${level.parRule === 'cheapest' ? `${bestInk.toFixed(0)} (${bestScore.stars}★)` : '-'} | ${noise.wins}/100 |`,
  );
  console.log(`  time ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

console.log('\n| Level | Name | Rule | T | B | Candy | Run (s) | Reference ink | Cheapest found | Best ink | Noise wins |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of rows) console.log(r);
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exitCode = failures ? 1 : 0;
