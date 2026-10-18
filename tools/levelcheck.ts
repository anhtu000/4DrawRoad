// Level check (v0 section 10.2, brief 5.3). Runs every level's reference solution through the
// drawing rules and the physics the game uses, and checks:
//   1. the solution wins and collects every candy
//   2. par T = solution ink x 1.10 matches the level file (budget B = T x the ratio for that level)
//   3. drawing nothing loses
//   4. straight lines across every gap win on levels 1-4 (easy levels set no traps)
//   5. the solution with +-2 units of noise on every point wins at least 95 of 100 times
//   6. the same strokes give exactly the same run twice
//   7. extra checks per level (below)
//
//   node --experimental-strip-types tools/levelcheck.ts            check all levels
//   node --experimental-strip-types tools/levelcheck.ts --fix      also write par and budget into the files
//   node --experimental-strip-types tools/levelcheck.ts --trace 5  print the car's path for level 5
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { drawLike, inkUsed, inkZones } from '../src/logic/ink.ts';
import { levelScore } from '../src/logic/score.ts';
import type { LevelDef, Pt } from '../src/logic/types.ts';
import { LEVELS } from '../src/levels/index.ts';
import { Sim, type SimResult } from '../src/sim/sim.ts';
import { Matter } from './matter.ts';

/** B/T per level, from the v0 level table (section 6.2). */
const RATIO: Record<number, number> = { 1: 3.0, 2: 2.8, 3: 2.6, 4: 2.4, 5: 2.2, 6: 2.0, 7: 1.6, 8: 1.9, 9: 1.55, 10: 1.8 };

interface Extra {
  name: string;
  lines: Pt[][];
  expect: 'win' | 'lose' | 'win-no-candy';
  /** Print stars and ink for this one. */
  report?: boolean;
}

/** Extra checks per level. Lines are drawn with the same rules as a finger. */
const EXTRAS: Record<number, Extra[]> = {
  3: [{ name: 'straight bridges win without the candy', lines: [[[340, 487], [460, 487]], [[250, 697], [430, 697]]], expect: 'win-no-candy' }],
  4: [
    { name: 'straight bridges win without candies', lines: [[[320, 463], [470, 533]], [[440, 787], [220, 787]]], expect: 'win-no-candy' },
  ],
  5: [
    { name: 'straight line across the hole is cut by the stone', lines: [[[240, 527], [420, 527]], [[600, 767], [500, 767]]], expect: 'lose' },
    { name: 'flat bridge on the lower road misses the high candy', lines: [[[160, 527], [238, 482]], [[600, 767], [480, 767]]], expect: 'win-no-candy' },
    { name: 'arch over the stone wins (more ink)', lines: [[[170, 527], [293, 476], [347, 476], [420, 527]], [[600, 767], [550, 732], [500, 767]]], expect: 'win', report: true },
  ],
  10: [
    { name: 'flat bridge on the bottom road misses the high candy', lines: [[[300, 447], [460, 447]], [[425, 667], [500, 667]], [[280, 907], [480, 907]]], expect: 'win-no-candy' },
    { name: 'no patch: the car falls through the plank', lines: [[[300, 447], [460, 447]], [[280, 907], [380, 877], [480, 907]]], expect: 'lose' },
    { name: 'patch too short: the car falls through the plank', lines: [[[300, 447], [460, 447]], [[260, 667], [340, 667]], [[280, 907], [380, 877], [480, 907]]], expect: 'lose' },
    { name: 'ink over the whole plank wins (more ink)', lines: [[[300, 447], [460, 447]], [[260, 667], [500, 667]], [[280, 907], [380, 877], [480, 907]]], expect: 'win', report: true },
  ],
};

const args = process.argv.slice(2);
const fix = args.includes('--fix');
const traceId = args.includes('--trace') ? Number(args[args.indexOf('--trace') + 1]) : 0;

function draw(level: LevelDef, lines: Pt[][]): Pt[][] {
  const zones = inkZones(level);
  const strokes: Pt[][] = [];
  for (const line of lines) strokes.push(...drawLike(line, zones, strokes));
  return strokes;
}

function run(level: LevelDef, strokes: Pt[][]): SimResult & { sim: Sim } {
  const sim = new Sim(Matter, level, strokes);
  const r = sim.runToEnd();
  return { ...r, sim };
}

let seed = 12345;
function rnd() {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}

const describe = (r: SimResult, level: LevelDef) => `${r.outcome} in ${(r.steps / 60).toFixed(1)} s, candy ${r.candies.length}/${level.candies.length}`;

let failures = 0;
const rows: string[] = [];

for (const level of LEVELS) {
  const fail = (msg: string) => {
    failures++;
    console.log(`  FAIL ${msg}`);
  };
  console.log(`\nLevel ${level.id} ${level.name}`);
  const strokes = draw(level, level.solution);
  const used = inkUsed(strokes);
  const res = run(level, strokes);

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
  if (res.outcome !== 'win' || !allCandy) fail(`solution: ${describe(res, level)}`);
  else console.log(`  ok   solution: ${describe(res, level)}, ink ${used.toFixed(0)}`);

  // 2
  const ratio = RATIO[level.id] ?? 2;
  const par = Math.round(used * 1.1);
  const budget = Math.round(par * ratio);
  if (Math.abs(par - level.ink.par) > 1 || Math.abs(budget - level.ink.budget) > 2) {
    if (fix) {
      const file = fileURLToPath(new URL(`../src/levels/${String(level.id).padStart(2, '0')}.json`, import.meta.url));
      const data = JSON.parse(readFileSync(file, 'utf8'));
      data.ink = { budget, par };
      writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
      console.log(`  fix  par ${level.ink.par} -> ${par}, budget ${level.ink.budget} -> ${budget}`);
      level.ink = { budget, par };
    } else fail(`par ${level.ink.par} / budget ${level.ink.budget}, solution says ${par} / ${budget} (run with --fix)`);
  } else console.log(`  ok   par ${level.ink.par}, budget ${level.ink.budget} (B/T ${(level.ink.budget / level.ink.par).toFixed(2)})`);

  // 3
  const empty = run(level, []);
  if (empty.outcome === 'win') fail('drawing nothing wins');
  else console.log(`  ok   no ink: ${empty.outcome}`);

  // 4
  const straight = draw(
    level,
    level.gaps.map((g) => [g.a, g.b]),
  );
  const sr = run(level, straight);
  if (level.id <= 4) {
    if (sr.outcome !== 'win') fail(`straight lines across the gaps: ${describe(sr, level)}`);
    else console.log(`  ok   straight lines win (${describe(sr, level)})`);
  } else console.log(`  info straight lines: ${describe(sr, level)}`);

  // 4b: every gap matters. Leave one gap open (the solution lines that start or end at it removed): no win.
  level.gaps.forEach((g, gi) => {
    const near = (p: Pt) => [g.a, g.b].some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 30);
    const lines = level.solution.filter((line) => !near(line[0]) && !near(line[line.length - 1]));
    if (lines.length === level.solution.length) return;
    const r = run(level, draw(level, lines));
    if (r.outcome === 'win') fail(`gap ${gi + 1} left open still wins (${describe(r, level)})`);
    else console.log(`  ok   gap ${gi + 1} left open: ${r.outcome}`);
  });

  // 5
  let wins = 0;
  let candyWins = 0;
  for (let i = 0; i < 100; i++) {
    const noisy = level.solution.map((line) => line.map((p) => [p[0] + (rnd() * 4 - 2), p[1] + (rnd() * 4 - 2)] as Pt));
    const r = run(level, draw(level, noisy));
    if (r.outcome === 'win') wins++;
    if (r.outcome === 'win' && r.candies.length === level.candies.length) candyWins++;
  }
  if (wins < 95) fail(`noise +-2: won ${wins}/100 (all candy ${candyWins})`);
  else console.log(`  ok   noise +-2: won ${wins}/100, all candy ${candyWins}/100`);

  // 6
  const again = run(level, draw(level, level.solution));
  const same = again.steps === res.steps && again.sim.chassis.position.x === res.sim.chassis.position.x && again.sim.chassis.position.y === res.sim.chassis.position.y;
  if (!same) fail('same strokes, different run');
  else console.log('  ok   repeatable');

  // 7
  for (const extra of EXTRAS[level.id] ?? []) {
    const st = draw(level, extra.lines);
    const r = run(level, st);
    const ok =
      extra.expect === 'win' ? r.outcome === 'win' : extra.expect === 'lose' ? r.outcome !== 'win' : r.outcome === 'win' && r.candies.length < level.candies.length;
    const ink = inkUsed(st);
    const sc = levelScore(ink, level.ink.par, level.ink.budget, r.candies.length);
    const detail = `${describe(r, level)}${extra.report ? `, ink ${ink.toFixed(0)}, ${sc.stars} stars (${sc.ink})` : ''}`;
    if (!ok) fail(`${extra.name}: ${detail}`);
    else console.log(`  ok   ${extra.name}: ${detail}`);
  }

  const sc = levelScore(used, level.ink.par, level.ink.budget, res.candies.length);
  rows.push(`| ${level.id} | ${level.name} | ${level.ink.par} | ${level.ink.budget} | ${(level.ink.budget / level.ink.par).toFixed(2)} | ${level.candies.length} | ${(res.steps / 60).toFixed(1)} | ${wins}/100 | ${sc.stars} |`);
}

console.log('\n| Level | Name | T | B | B/T | Candy | Run (s) | Noise wins | Solution stars |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const r of rows) console.log(r);
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exitCode = failures ? 1 : 0;
