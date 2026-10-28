// Level maps for design work: every part of a level drawn flat, the reference solution (purple)
// and the cheapest known win (gold) with the path the car takes for each, and the events of each
// run (turns, candies, bounces, mirrors, lanterns). Saved as PNG through the Playwright Chromium
// that the test bots use.
//   node --experimental-strip-types tools/levelmap.ts 6 7          some levels, to .levelmaps/
//   node --experimental-strip-types tools/levelmap.ts --file draft.json --out /tmp/x
//   add --lines '[[[x,y],...],...]' to draw one more try (green) on the first level given
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { batPos, LANTERN_R, mirrorBox, PUMPKIN_R, pumpkinCenter } from '../src/logic/mech.ts';
import type { LevelDef, Pt } from '../src/logic/types.ts';
import { LEVELS } from '../src/levels/index.ts';
import { Sim } from '../src/sim/sim.ts';
import { TUNING } from '../src/sim/tuning.ts';
import { Matter } from './matter.ts';
import { drawLines } from './search.ts';
import { inkUsed } from '../src/logic/ink.ts';

const args = process.argv.slice(2);
const opt = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const out = resolve(opt('--out') ?? '.levelmaps');
const file = opt('--file');
const extraLines = opt('--lines') ? (JSON.parse(opt('--lines')!) as Pt[][]) : null;
const ids = args.filter((a, i) => /^\d+$/.test(a) && !['--out', '--file', '--lines'].includes(args[i - 1])).map(Number);

const levels: LevelDef[] = file ? [JSON.parse(readFileSync(file, 'utf8')) as LevelDef] : LEVELS.filter((l) => !ids.length || ids.includes(l.id));

const Y0 = 140;
const Y1 = 1150;
const poly = (pts: Pt[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

interface Run {
  strokes: Pt[][];
  ink: number;
  path: Pt[];
  marks: { p: Pt; label: string }[];
  outcome: string;
  time: number;
  candies: number;
}

function run(level: LevelDef, lines: Pt[][]): Run {
  const strokes = drawLines(level, lines);
  const sim = new Sim(Matter, level, strokes);
  const path: Pt[] = [];
  const marks: Run['marks'] = [];
  while (!sim.result && sim.steps < TUNING.maxSteps) {
    sim.step();
    const c = sim.chassis.position;
    if (sim.steps % 3 === 0) path.push([c.x, c.y]);
    for (const e of sim.events.splice(0)) {
      const label = e.type === 'candy' ? `candy ${e.index + 1}` : e.type === 'lantern' ? `lantern ${e.index + 1}` : e.type === 'teleport' ? `mirror ${e.index + 1}` : e.type;
      marks.push({ p: [c.x, c.y], label: `${label} ${sim.time.toFixed(1)}s` });
      if (e.type === 'teleport') path.push([NaN, NaN]);
    }
  }
  if (!sim.result) sim.runToEnd();
  return { strokes, ink: inkUsed(strokes), path, marks, outcome: sim.result!.outcome, time: sim.result!.steps / 60, candies: sim.result!.candies.length };
}

function pathSvg(path: Pt[], color: string) {
  const parts: Pt[][] = [[]];
  for (const p of path) {
    if (Number.isNaN(p[0])) parts.push([]);
    else parts[parts.length - 1].push(p);
  }
  return parts.filter((p) => p.length > 1).map((p) => `<polyline points="${poly(p)}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="6 5" opacity="0.9"/>`).join('');
}

function svg(level: LevelDef, runs: { run: Run; ink: string; path: string; name: string }[]) {
  const s: string[] = [];
  s.push(`<rect x="0" y="${Y0}" width="720" height="${Y1 - Y0}" fill="#1d1640"/>`);
  for (let y = 200; y < Y1; y += 100) s.push(`<line x1="0" y1="${y}" x2="720" y2="${y}" stroke="#2c2458" stroke-width="1"/><text x="4" y="${y - 3}" fill="#5c5590" font-size="12">${y}</text>`);
  for (let x = 100; x < 720; x += 100) s.push(`<line x1="${x}" y1="${Y0}" x2="${x}" y2="${Y1}" stroke="#2c2458" stroke-width="1"/><text x="${x + 3}" y="${Y0 + 14}" fill="#5c5590" font-size="12">${x}</text>`);
  for (const f of level.fog ?? []) s.push(`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="#9fe0d0" opacity="0.22" stroke="#9fe0d0" stroke-dasharray="4 4"/>`);
  for (const road of level.roads) {
    const body = [...road.pts, ...[...road.pts].reverse().map((p) => [p[0], p[1] + TUNING.roadThickness] as Pt)];
    s.push(`<polygon points="${poly(body)}" fill="${road.ghost ? '#8e7ad6' : '#5b4673'}" opacity="${road.ghost ? 0.55 : 1}" stroke="#b59bd8" stroke-width="2"/>`);
  }
  for (const w of level.walls) s.push(`<rect x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" fill="#766a92" stroke="#ff9a3d" stroke-width="2"/>`);
  for (const b of level.blocks) s.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${Math.min(b.h, Y1 - b.y)}" fill="#4e4468" stroke="#9a8fb6"/>`);
  (level.gates ?? []).forEach((g, i) => s.push(`<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" fill="none" stroke="#ffd36b" stroke-width="3" stroke-dasharray="3 3"/><text x="${g.x - 4}" y="${g.y - 6}" fill="#ffd36b" font-size="13">gate ${i + 1}</text>`));
  (level.lanterns ?? []).forEach((l, i) => s.push(`<circle cx="${l.x}" cy="${l.y}" r="${LANTERN_R}" fill="#ffd36b" opacity="0.7"/><text x="${l.x + 20}" y="${l.y + 4}" fill="#ffd36b" font-size="13">L${i + 1}→g${l.gate + 1}</text>`));
  (level.pumpkins ?? []).forEach((p) => {
    const c = pumpkinCenter(p);
    s.push(`<circle cx="${c[0]}" cy="${c[1]}" r="${PUMPKIN_R}" fill="#ff8a2b"/><text x="${c[0] - 14}" y="${c[1] + 4}" fill="#1c1430" font-size="11">${p.power ?? ''}</text>`);
  });
  (level.mirrors ?? []).forEach((m, i) => {
    for (const [at, tag] of [[m.a, 'in'], [m.b, 'out']] as const) {
      const r = mirrorBox(at);
      s.push(`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="24" fill="#7fd8ff" opacity="${tag === 'in' ? 0.5 : 0.25}" stroke="#7fd8ff" stroke-width="2"/><text x="${r.x}" y="${r.y - 5}" fill="#7fd8ff" font-size="13">M${i + 1} ${tag}</text>`);
    }
  });
  for (const b of level.bats ?? []) {
    s.push(`<line x1="${b.a[0]}" y1="${b.a[1]}" x2="${b.b[0]}" y2="${b.b[1]}" stroke="#ff6f6f" stroke-width="2" stroke-dasharray="2 4"/>`);
    const p0 = batPos(b, 0);
    s.push(`<circle cx="${p0[0]}" cy="${p0[1]}" r="17" fill="#ff6f6f" opacity="0.8"/><text x="${p0[0] + 20}" y="${p0[1]}" fill="#ff6f6f" font-size="12">bat ${b.speed}/s</text>`);
  }
  for (const g of level.gaps) s.push(`<line x1="${g.a[0]}" y1="${g.a[1]}" x2="${g.b[0]}" y2="${g.b[1]}" stroke="#ffffff" stroke-width="2" stroke-dasharray="2 7" opacity="0.6"/>`);
  level.candies.forEach((c, i) => s.push(`<circle cx="${c[0]}" cy="${c[1]}" r="20" fill="#ff6fb1"/><text x="${c[0] - 4}" y="${c[1] + 5}" fill="#1c1430" font-size="14">${i + 1}</text>`));
  const h = level.house;
  s.push(`<rect x="${h.x - 45}" y="${h.y - 110}" width="90" height="110" fill="#4a3768" stroke="#ffd36b" stroke-width="2"/><rect x="${h.x - 12}" y="${h.y - 40}" width="24" height="40" fill="#ff9a3d"/>`);
  const cx = level.car.x;
  const cy = level.car.y;
  s.push(`<rect x="${cx - 48}" y="${cy - 62}" width="96" height="40" rx="12" fill="#ff8a2b"/><circle cx="${cx - 33}" cy="${cy - 17}" r="17" fill="#2a1f3f"/><circle cx="${cx + 33}" cy="${cy - 17}" r="17" fill="#2a1f3f"/><path d="M${cx + 52 * level.car.dir} ${cy - 45} l${14 * level.car.dir} 0" stroke="#fff" stroke-width="3"/>`);
  for (const r of runs) {
    for (const st of r.run.strokes) s.push(`<polyline points="${poly(st)}" fill="none" stroke="${r.ink}" stroke-width="${TUNING.inkThickness}" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>`);
  }
  for (const r of runs) {
    s.push(pathSvg(r.run.path, r.path));
    for (const m of r.run.marks) s.push(`<circle cx="${m.p[0]}" cy="${m.p[1]}" r="4" fill="${r.path}"/><text x="${m.p[0] + 6}" y="${m.p[1] - 6}" fill="${r.path}" font-size="12">${m.label}</text>`);
  }
  const lines = runs.map((r, i) => `<text x="10" y="${Y1 + 22 + i * 20}" fill="${r.path}" font-size="15">${r.name}: ${r.run.outcome} ${r.run.time.toFixed(1)}s, ink ${r.run.ink.toFixed(0)}, candy ${r.run.candies}/${level.candies.length}</text>`);
  const title = `<text x="10" y="${Y0 - 12}" fill="#fff" font-size="20">Level ${level.id} ${level.name}  T ${level.ink.par}  B ${level.ink.budget}</text>`;
  const H = Y1 - Y0 + 40 + 22 + runs.length * 20;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="${H}" viewBox="0 ${Y0 - 40} 720 ${H}" font-family="sans-serif"><rect x="0" y="${Y0 - 40}" width="720" height="${H}" fill="#120f2a"/>${title}${s.join('')}${lines.join('')}</svg>`;
}

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 720, height: 1200 } });
for (const level of levels) {
  const runs = [{ run: run(level, level.solution), ink: '#9b5cff', path: '#7fe7ff', name: 'reference' }];
  if (level.best) runs.push({ run: run(level, level.best), ink: '#ffc93d', path: '#ffc93d', name: 'best' });
  if (extraLines && level === levels[0]) runs.push({ run: run(level, extraLines), ink: '#5bff9a', path: '#5bff9a', name: 'try' });
  const html = svg(level, runs);
  const h = Number(/height="(\d+)"/.exec(html)![1]);
  await page.setViewportSize({ width: 720, height: h });
  await page.setContent(`<html><body style="margin:0;background:#120f2a">${html}</body></html>`);
  const path = `${out}/level${String(level.id).padStart(2, '0')}.png`;
  await page.screenshot({ path });
  console.log(`${path}: ${runs.map((r) => `${r.name} ${r.run.outcome} ink ${r.run.ink.toFixed(0)} candy ${r.run.candies}/${level.candies.length} ${r.run.time.toFixed(1)}s`).join('; ')}`);
}
await browser.close();
