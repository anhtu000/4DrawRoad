// Cheapest robust ink that still wins, per level (tools/search.ts). Prints it next to the reference
// solution and the par, with and without collecting every candy.
//   npm run cheapest            all levels
//   npm run cheapest -- 4 5     some levels
//   npm run cheapest -- --lines print the cheapest lines too
import { starLimits } from '../src/logic/score.ts';
import { LEVELS } from '../src/levels/index.ts';
import { findCheapest, runLines } from './search.ts';

const args = process.argv.slice(2);
const ids = args.filter((a) => /^\d+$/.test(a)).map(Number);
const showLines = args.includes('--lines');

for (const level of LEVELS) {
  if (ids.length && !ids.includes(level.id)) continue;
  const t0 = Date.now();
  const ref = runLines(level, level.solution).ink;
  const lim = starLimits(level.ink.par, level.ink.budget);
  const cells: string[] = [];
  for (const needCandy of [true, false]) {
    const r = findCheapest(level, needCandy);
    cells.push(r ? `${needCandy ? 'all candy' : 'any candy'} ${r.ink.toFixed(0)} (${((r.ink / ref) * 100).toFixed(0)}% of reference)` : `${needCandy ? 'all candy' : 'any candy'}: reference does not win robustly`);
    if (r && showLines) console.log(`  level ${level.id} ${needCandy ? 'all candy' : 'any candy'} lines ${JSON.stringify(r.lines)}`);
  }
  console.log(`level ${level.id} ${level.name}: reference ${ref.toFixed(0)}, par ${level.ink.par}, 3 stars up to ${lim.three.toFixed(0)}; cheapest ${cells.join('; ')}  [${((Date.now() - t0) / 1000).toFixed(0)} s]`);
}
