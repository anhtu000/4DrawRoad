// Measures the car against the targets in the brief (section 4.5): top speed, steepest climb,
// jump distance off a 30 degree ramp, a 200 unit drop, and bumps on a hand-drawn ink line.
//   node --experimental-strip-types tools/tune.ts
import { Sim } from '../src/sim/sim.ts';
import type { LevelDef, Pt } from '../src/logic/types.ts';
import { Matter } from './matter.ts';

function level(partial: Partial<LevelDef>): LevelDef {
  return {
    id: 0,
    name: 'tune',
    car: { x: 80, y: 700, dir: 1 },
    house: { x: 5000, y: 0 },
    roads: [],
    walls: [],
    blocks: [],
    gaps: [],
    candies: [],
    ink: { budget: 1000, par: 100 },
    solution: [],
    ...partial,
  };
}

const deg = (r: number) => (r * 180) / Math.PI;

// 1. Top speed on flat road.
{
  const sim = new Sim(Matter, level({ roads: [{ pts: [[0, 700], [2000, 700]] }] }), []);
  const xs: number[] = [];
  for (let i = 0; i < 180; i++) {
    sim.step();
    xs.push(sim.chassis.position.x);
  }
  const v = (xs[179] - xs[119]) * 1; // units per second over the last second
  const t90 = xs.findIndex((x, i) => i > 0 && (x - xs[i - 1]) * 60 > 0.9 * v);
  console.log(`speed: ${v.toFixed(0)} u/s, 90% of top speed after ${(t90 / 60).toFixed(2)} s, crosses 720 units in ${(720 / v).toFixed(2)} s`);
}

// 2. Climb: flat, then a long ramp at angle a.
for (const a of [30, 35, 38, 40, 42, 45, 50]) {
  const rad = (a * Math.PI) / 180;
  const run = 260;
  const top: Pt = [300 + run, 900 - Math.tan(rad) * run];
  const sim = new Sim(Matter, level({ car: { x: 120, y: 900, dir: 1 }, roads: [{ pts: [[0, 900], [300, 900], top, [top[0] + 400, top[1]]] }] }), []);
  sim.runToEnd(60 * 10);
  let maxX = 0;
  // run again to see how far it got
  const sim2 = new Sim(Matter, level({ car: { x: 120, y: 900, dir: 1 }, roads: [{ pts: [[0, 900], [300, 900], top, [top[0] + 400, top[1]]] }] }), []);
  for (let i = 0; i < 600 && !sim2.result; i++) {
    sim2.step();
    maxX = Math.max(maxX, sim2.chassis.position.x);
  }
  const made = maxX > top[0] + 40;
  console.log(`climb ${a} deg: ${made ? 'climbs' : 'fails'} (furthest x ${maxX.toFixed(0)}, top at ${top[0].toFixed(0)}), outcome ${sim.result?.outcome}`);
}

// 3. Jump: flat road, then a straight ramp at angle a, length L, ending at an edge.
for (const [a, L] of [[25, 90], [30, 90], [35, 90], [30, 60]] as const) {
  const rad = (a * Math.PI) / 180;
  const edge: Pt = [400 + Math.cos(rad) * L, 800 - Math.sin(rad) * L];
  const sim = new Sim(Matter, level({ car: { x: 100, y: 800, dir: 1 }, roads: [{ pts: [[0, 800], [400, 800], edge] }] }), []);
  let left = false;
  let apex = Infinity;
  let land = NaN;
  let flight = 0;
  let maxTilt = 0;
  for (let i = 0; i < 600; i++) {
    sim.step();
    const c = sim.chassis.position;
    if (!left && c.x > edge[0] + 10) left = true;
    if (left) {
      flight++;
      apex = Math.min(apex, c.y);
      maxTilt = Math.max(maxTilt, Math.abs(deg(sim.chassis.angle)));
      // back down to the ramp-end height (chassis center offset kept the same as at take-off)
      if (c.y > edge[1] - 30 && flight > 10) {
        land = c.x - edge[0];
        break;
      }
    }
  }
  console.log(`jump ${a} deg ramp ${L}: lands ${land.toFixed(0)} units past the edge at take-off height, rises ${(edge[1] - 30 - apex).toFixed(0)}, ${(flight / 60).toFixed(2)} s in the air, tilt up to ${maxTilt.toFixed(0)} deg`);
}

// 4. Drop of 200 units off an edge.
for (const drop of [200, 220]) {
  const sim = new Sim(Matter, level({ car: { x: 120, y: 500, dir: 1 }, roads: [{ pts: [[0, 500], [400, 500]] }, { pts: [[300, 500 + drop], [900, 500 + drop]] }] }), []);
  let maxTilt = 0;
  let landedAt = 0;
  for (let i = 0; i < 300; i++) {
    sim.step();
    maxTilt = Math.max(maxTilt, Math.abs(deg(sim.chassis.angle)));
    if (!landedAt && sim.chassis.position.y > 500 + drop - 60) landedAt = i;
  }
  console.log(`drop ${drop}: max tilt ${maxTilt.toFixed(0)} deg, upright at the end: ${Math.abs(deg(sim.chassis.angle)) < 10}, fall time ${(landedAt / 60).toFixed(2)} s, speed after ${(Math.hypot(sim.chassis.velocity.x, sim.chassis.velocity.y) * 60).toFixed(0)} u/s`);
}

// 5. Bumps: straight ink bridge over a 140 gap, flush with the road (ends 7 below the road top),
//    and a shaky hand-drawn bridge (noise +-1.5, points every 6 units, smoothed).
import { simplify } from '../src/logic/geom.ts';
function bumpTest(name: string, stroke: Pt[]) {
  const sim = new Sim(Matter, level({ car: { x: 80, y: 700, dir: 1 }, roads: [{ pts: [[0, 700], [300, 700]] }, { pts: [[440, 700], [900, 700]] }] }), [stroke]);
  let maxVy = 0;
  let minSpeed = Infinity;
  for (let i = 0; i < 240; i++) {
    sim.step();
    const c = sim.chassis;
    if (c.position.x > 260 && c.position.x < 500) {
      maxVy = Math.max(maxVy, Math.abs(c.velocity.y * 60));
      minSpeed = Math.min(minSpeed, c.velocity.x * 60);
    }
  }
  console.log(`bridge ${name}: worst vertical speed ${maxVy.toFixed(1)} u/s, slowest ${minSpeed.toFixed(0)} u/s, ${sim.result?.outcome ?? 'running'} at x ${sim.chassis.position.x.toFixed(0)}`);
}
bumpTest('straight', [[296, 707], [444, 707]]);
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const shaky: Pt[] = [];
for (let x = 296; x <= 444; x += 6) shaky.push([x, 707 + rnd() * 1.5]);
bumpTest('shaky raw', shaky);
bumpTest('shaky smoothed', simplify(shaky, 3));
const wobble: Pt[] = [];
for (let x = 296; x <= 444; x += 6) wobble.push([x, 707 + Math.sin(x / 9) * 4]);
bumpTest('wobble 4 smoothed', simplify(wobble, 3));
bumpTest('7 high step', [[296, 700], [444, 700]]);

// 6. Widest gap the car crosses with no ink at full speed, and how deep it can follow a dip into a wide gap.
for (const w of [60, 80, 100, 110, 120, 140]) {
  const sim = new Sim(Matter, level({ car: { x: 80, y: 700, dir: 1 }, roads: [{ pts: [[0, 700], [400, 700]] }, { pts: [[400 + w, 700], [1200, 700]] }], house: { x: 700, y: 700 } }), []);
  const r = sim.runToEnd(600);
  console.log(`gap ${w} with no ink at full speed: ${r.outcome}`);
}
