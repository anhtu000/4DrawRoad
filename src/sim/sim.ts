// The run itself: the level, the player's ink and the car in a Matter.js world, stepped at a fixed
// 60 Hz. Same strokes in, same result out, so the game, the hold-GO preview and tools/levelcheck.ts
// all share this file. Matter is passed in: the game hands over Phaser's bundled copy, the Node tools
// load the same source files from the phaser package.
import { downNormal } from '../logic/geom.ts';
import { BAT_R, batPos, LANTERN_R, MIRROR_H, MIRROR_HW, PUMPKIN_POWER, PUMPKIN_PUSH, PUMPKIN_R, pumpkinCenter } from '../logic/mech.ts';
import type { LevelDef, Pt } from '../logic/types.ts';
import { STEP_MS, TUNING } from './tuning.ts';

// Matter's own types are not worth wiring up for this file: the calls used here are few.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MatterLib = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = any;

export type Outcome = 'win' | 'fall' | 'flip' | 'stuck' | 'timeout' | 'bat';

export interface SimResult {
  outcome: Outcome;
  steps: number;
  /** Indexes of the candies the car touched. */
  candies: number[];
}

export type SimEvent =
  | { type: 'candy'; index: number }
  | { type: 'turn'; x: number; y: number }
  | { type: 'bounce'; index: number }
  | { type: 'teleport'; index: number; dx: number; dy: number }
  | { type: 'lantern'; index: number; gate: number };

export interface SimOptions {
  /** Option B of the turn rule: a near-vertical ink stroke also turns the car (?inkturn). */
  inkTurn?: boolean;
  /** Override tuning values, for tools/tune.ts. */
  tuning?: Partial<typeof TUNING>;
}

/** Driver's body as a circle in the chassis frame (facing right). CarView draws Lumi to match. */
export const DRIVER = { x: -6, y: -34, r: 16 };

const CAT_GROUND = 0x0001;
const CAT_CAR = 0x0002;

interface GhostGroup {
  bodies: Body[];
  on: number;
  off: number;
  offset: number;
  /** Shown by the rhythm. */
  visible: boolean;
  /** Collides with the car (can lag behind visible, see updateGhosts). */
  solid: boolean;
}

export class Sim {
  readonly M: MatterLib;
  readonly level: LevelDef;
  readonly engine: Body;
  readonly chassis: Body;
  readonly wheels: Body[];
  readonly tune: typeof TUNING;
  steps = 0;
  dir: 1 | -1;
  result: SimResult | null = null;
  collected: boolean[];
  /** True while at least one wheel touches something. */
  grounded = true;
  /** Which wheels touched the ground on the last step, and the ground's normal under each. */
  readonly wheelDown = [false, false];
  readonly wheelNormal: [number, number][] = [
    [0, -1],
    [0, -1],
  ];
  readonly events: SimEvent[] = [];
  readonly ghosts: GhostGroup[] = [];
  /** Lanterns lit so far, and gates open so far. */
  readonly lit: boolean[];
  readonly gateOpen: boolean[];

  private walls = new Set<Body>();
  private inkSteep = new Set<Body>();
  private carParts = new Set<Body>();
  private pause = 0;
  private turnCooldown = 0;
  private flipCount = 0;
  private inkTurn: boolean;
  private mass = 0;
  /** Chassis positions of the last few seconds, for the 'not getting anywhere' check. */
  private trail: number[] = [];
  private gateBodies: Body[] = [];
  /** Per gap: chassis below the gap line last step, and fell into the gap (crossed its line going down). */
  private gapBelow: boolean[] = [];
  private gapIn: boolean[] = [];
  /** Holes the car can fall into: every gap that is not optional, and every ghost plank. */
  private holes: { a: Pt; b: Pt }[] = [];
  private bounceCooldown = 0;
  private mirrorCooldown = 0;

  constructor(M: MatterLib, level: LevelDef, strokes: Pt[][], options: SimOptions = {}) {
    this.M = M;
    this.level = level;
    this.tune = { ...TUNING, ...options.tuning } as typeof TUNING;
    this.inkTurn = !!options.inkTurn;
    this.dir = level.car.dir;
    this.collected = level.candies.map(() => false);
    this.lit = (level.lanterns ?? []).map(() => false);
    this.gateOpen = (level.gates ?? []).map(() => false);
    const t = this.tune;

    this.engine = M.Engine.create({
      enableSleeping: false,
      positionIterations: 10,
      velocityIterations: 8,
      constraintIterations: 4,
    });
    // Matter: acceleration per step = gravity.y * scale * (step ms)^2, so scale = g / 1000^2 in units/s^2.
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 1;
    this.engine.gravity.scale = t.gravity / 1e6;

    const statics: Body[] = [];
    const ground = { category: CAT_GROUND, mask: CAT_CAR, group: 0 };

    // Roads: one rectangle per segment, its top edge on the road line.
    for (const road of level.roads) {
      const bodies: Body[] = [];
      for (let i = 1; i < road.pts.length; i++) {
        const a = road.pts[i - 1];
        const b = road.pts[i];
        const n = downNormal(a, b);
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const cx = (a[0] + b[0]) / 2 + (n[0] * t.roadThickness) / 2;
        const cy = (a[1] + b[1]) / 2 + (n[1] * t.roadThickness) / 2;
        const body = M.Bodies.rectangle(cx, cy, len, t.roadThickness, {
          isStatic: true,
          angle: Math.atan2(b[1] - a[1], b[0] - a[0]),
          friction: 1,
          frictionStatic: 1,
          restitution: 0,
          collisionFilter: { ...ground },
          label: 'road',
        });
        bodies.push(body);
      }
      statics.push(...bodies);
      if (road.ghost) {
        this.ghosts.push({ bodies, on: road.ghost.on, off: road.ghost.off, offset: road.ghost.offset ?? 0, visible: true, solid: true });
      }
    }

    for (const w of level.walls) {
      const body = M.Bodies.rectangle(w.x + w.w / 2, w.y + w.h / 2, w.w, w.h, {
        isStatic: true,
        friction: 0.2,
        collisionFilter: { ...ground },
        label: 'wall',
      });
      this.walls.add(body);
      statics.push(body);
    }
    for (const b of level.blocks) {
      statics.push(
        M.Bodies.rectangle(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h, {
          isStatic: true,
          friction: 0.8,
          chamfer: { radius: Math.min(10, b.w / 3) },
          collisionFilter: { ...ground },
          label: 'block',
        }),
      );
    }

    // Gates turn the car like walls while they are shut (they open when their lantern is lit).
    for (const gt of level.gates ?? []) {
      const body = M.Bodies.rectangle(gt.x + gt.w / 2, gt.y + gt.h / 2, gt.w, gt.h, {
        isStatic: true,
        friction: 0.2,
        collisionFilter: { ...ground },
        label: 'gate',
      });
      this.walls.add(body);
      this.gateBodies.push(body);
      statics.push(body);
    }

    // Ink: a rectangle per segment centered on the line, and a round cap at every point so the joins
    // are smooth (no bump where two segments meet).
    const r = t.inkThickness / 2;
    for (const stroke of strokes) {
      for (let i = 0; i < stroke.length; i++) {
        const p = stroke[i];
        statics.push(M.Bodies.circle(p[0], p[1], r, { isStatic: true, friction: 1, frictionStatic: 1, collisionFilter: { ...ground }, label: 'ink' }, 16));
        if (i === 0) continue;
        const a = stroke[i - 1];
        const len = Math.hypot(p[0] - a[0], p[1] - a[1]);
        if (len < 0.5) continue;
        const angle = Math.atan2(p[1] - a[1], p[0] - a[0]);
        const body = M.Bodies.rectangle((a[0] + p[0]) / 2, (a[1] + p[1]) / 2, len, t.inkThickness, {
          isStatic: true,
          angle,
          friction: 1,
          frictionStatic: 1,
          collisionFilter: { ...ground },
          label: 'ink',
        });
        statics.push(body);
        const steep = Math.abs(Math.sin(angle)) > Math.sin((70 * Math.PI) / 180);
        if (steep) this.inkSteep.add(body);
      }
    }

    // Car: chassis and two wheels on springs. One collision group so the parts never hit each other.
    const carFilter = { category: CAT_CAR, mask: CAT_GROUND, group: -1 };
    const wheelY = level.car.y - t.wheelRadius;
    const chassisY = wheelY - t.wheelDrop;
    this.chassis = M.Bodies.rectangle(level.car.x, chassisY, t.chassisW, t.chassisH, {
      chamfer: { radius: 12 },
      friction: t.chassisFriction,
      frictionAir: 0,
      restitution: 0,
      density: 0.0012,
      collisionFilter: carFilter,
      label: 'chassis',
    });
    this.wheels = [-1, 1].map((side) =>
      M.Bodies.circle(level.car.x + (side * t.wheelBase) / 2, wheelY, t.wheelRadius, {
        friction: 1,
        frictionStatic: 1,
        frictionAir: 0,
        restitution: 0,
        density: 0.001,
        collisionFilter: carFilter,
        label: 'wheel',
      }, 40),
    );
    const springs = this.wheels.map((wheel, i) =>
      M.Constraint.create({
        bodyA: this.chassis,
        pointA: { x: ((i === 0 ? -1 : 1) * t.wheelBase) / 2, y: t.wheelDrop },
        bodyB: wheel,
        pointB: { x: 0, y: 0 },
        length: 0,
        stiffness: t.springStiffness,
        damping: t.springDamping,
      }),
    );
    for (const part of [this.chassis, ...this.wheels]) {
      this.carParts.add(part);
      this.mass += part.mass;
    }

    M.Composite.add(this.engine.world, [...statics, this.chassis, ...this.wheels, ...springs]);
    this.holes = [
      ...level.gaps.filter((g) => !g.optional),
      ...level.roads.filter((r) => r.ghost).map((r) => ({ a: r.pts[0], b: r.pts[r.pts.length - 1] })),
    ];
    this.gapBelow = this.holes.map((g) => this.gapDepth(g) > 0);
    this.gapIn = this.holes.map(() => false);
    this.updateGhosts();
  }

  /** Seconds since GO. */
  get time() {
    return this.steps / 60;
  }

  /** Is ghost plank group i solid right now. */
  ghostVisible(i: number) {
    return this.ghosts[i]?.visible ?? true;
  }

  /** One fixed step. Does nothing once the run has ended. */
  step() {
    if (this.result) return;
    const M = this.M;
    const t = this.tune;
    this.steps++;
    this.updateGhosts();

    // Drive: each wheel that touches the ground pushes along that ground (v0 section 3.4). The motor
    // is strong on flat road and weaker uphill: at climbDeg its push only just matches gravity. Steeper
    // than that with both wheels on it, the wheels slip and the car slides back. Above top speed it brakes.
    const down = this.wheels.filter((_, i) => this.wheelDown[i]);
    if (down.length) {
      // Ground direction under the wheels, pointing the way the car drives.
      let tx = 0;
      let ty = 0;
      this.wheels.forEach((_, i) => {
        if (!this.wheelDown[i]) return;
        const n = this.wheelNormal[i];
        tx += -n[1] * this.dir;
        ty += n[0] * this.dir;
      });
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const v = this.chassis.velocity;
      const forward = (v.x * tx + v.y * ty) * 60; // units per second along the ground
      const top = this.pause > 0 ? 0 : t.carSpeed;
      const lim = (t.climbDeg * Math.PI) / 180;
      const uphill = Math.asin(Math.max(-1, Math.min(1, -ty))); // positive going up
      const cap = t.gravity * Math.sin(lim) + t.flatBoost * Math.max(0, Math.min(1, 1 - uphill / lim));
      let accel = Math.max(-cap, Math.min(cap, (top - forward) * 8));
      if (uphill > lim && down.length === 2) accel = -t.slipDecel;
      const f = (accel * this.mass) / 1e6 / down.length;
      for (const w of down) M.Body.applyForce(w, w.position, { x: tx * f, y: ty * f });
    }
    if (this.pause > 0) this.pause--;
    if (this.turnCooldown > 0) this.turnCooldown--;
    if (this.bounceCooldown > 0) this.bounceCooldown--;
    if (this.mirrorCooldown > 0) this.mirrorCooldown--;

    M.Engine.update(this.engine, STEP_MS);

    // Contacts: turn-around walls and ground under the wheels.
    let turnHere = false;
    this.wheelDown[0] = false;
    this.wheelDown[1] = false;
    for (const pair of this.engine.pairs.list) {
      if (!pair.isActive) continue;
      const a = pair.bodyA.parent ?? pair.bodyA;
      const b = pair.bodyB.parent ?? pair.bodyB;
      const carBody = this.carParts.has(a) ? a : this.carParts.has(b) ? b : null;
      if (!carBody) continue;
      const other = carBody === a ? b : a;
      const wi = carBody === this.wheels[0] ? 0 : carBody === this.wheels[1] ? 1 : -1;
      if (wi >= 0 && !this.walls.has(other)) {
        // Ground normal, pointing from the ground to the wheel. Near-vertical contacts are not ground.
        let nx = pair.collision.normal.x;
        let ny = pair.collision.normal.y;
        const cv = pair.contacts?.[0]?.vertex;
        if (cv && nx * (carBody.position.x - cv.x) + ny * (carBody.position.y - cv.y) < 0) {
          nx = -nx;
          ny = -ny;
        }
        if (ny < -0.34) {
          if (this.wheelDown[wi]) {
            const prev = this.wheelNormal[wi];
            const ax = prev[0] + nx;
            const ay = prev[1] + ny;
            const l = Math.hypot(ax, ay) || 1;
            this.wheelNormal[wi] = [ax / l, ay / l];
          } else this.wheelNormal[wi] = [nx, ny];
          this.wheelDown[wi] = true;
        }
      }
      const turner = this.walls.has(other) || (this.inkTurn && this.inkSteep.has(other));
      if (turner && this.turnCooldown === 0) {
        // Only when the car drives into it, not when it rolls away.
        const ahead = (other.position.x - this.chassis.position.x) * this.dir > 0;
        if (ahead) turnHere = true;
      }
    }
    this.grounded = this.wheelDown[0] || this.wheelDown[1];
    if (turnHere) {
      this.dir = this.dir === 1 ? -1 : 1;
      this.pause = t.turnPauseSteps;
      this.turnCooldown = 30;
      this.events.push({ type: 'turn', x: this.chassis.position.x, y: this.chassis.position.y });
    }

    this.checkPumpkins();
    this.checkMirrors();
    this.checkCandies();
    this.checkLanterns();
    this.checkEnd();
  }

  /** Pumpkins are springy, not solid: touching one (driving into it or landing on it) throws the car. */
  private checkPumpkins() {
    if (this.bounceCooldown > 0) return;
    (this.level.pumpkins ?? []).forEach((pk, i) => {
      if (this.bounceCooldown === 0 && this.touches(pumpkinCenter(pk), PUMPKIN_R)) this.launch(i);
    });
  }

  /** A pumpkin throws the car: same velocity for every part, so the car keeps its shape. */
  private launch(index: number) {
    const pk = this.level.pumpkins![index];
    const vx = (this.dir * (pk.push ?? PUMPKIN_PUSH)) / 60;
    const vy = -(pk.power ?? PUMPKIN_POWER) / 60;
    for (const part of this.carParts) this.M.Body.setVelocity(part, { x: vx, y: vy });
    this.M.Body.setAngularVelocity(this.chassis, 0);
    this.bounceCooldown = 30;
    this.events.push({ type: 'bounce', index });
  }

  /** Entering mirror a moves the whole car to mirror b, keeping its speed and direction. */
  private checkMirrors() {
    if (this.mirrorCooldown > 0) return;
    const c = this.chassis.position;
    (this.level.mirrors ?? []).forEach((m, i) => {
      if (this.mirrorCooldown > 0) return;
      if (Math.abs(c.x - m.a[0]) > MIRROR_HW - 6 || c.y > m.a[1] || c.y < m.a[1] - MIRROR_H) return;
      const dx = m.b[0] - m.a[0];
      const dy = m.b[1] - m.a[1];
      for (const part of this.carParts) this.M.Body.setPosition(part, { x: part.position.x + dx, y: part.position.y + dy });
      this.trail = [];
      // The car did not fall into anything on the way: start the hole tracking again from here.
      this.gapBelow = this.holes.map((g) => this.gapDepth(g) > 0);
      this.gapIn.fill(false);
      this.mirrorCooldown = 30;
      this.events.push({ type: 'teleport', index: i, dx, dy });
    });
  }

  private checkLanterns() {
    (this.level.lanterns ?? []).forEach((ln, i) => {
      if (this.lit[i] || !this.touches([ln.x, ln.y], LANTERN_R)) return;
      this.lit[i] = true;
      const body = this.gateBodies[ln.gate];
      if (body && !this.gateOpen[ln.gate]) {
        this.gateOpen[ln.gate] = true;
        body.collisionFilter.mask = 0;
        this.walls.delete(body);
      }
      this.events.push({ type: 'lantern', index: i, gate: ln.gate });
    });
  }

  /** Does any part of the car (chassis box, Lumi, wheels) touch a circle at p of radius R. */
  touches(p: Pt, R: number) {
    const t = this.tune;
    const c = this.chassis;
    const cos = Math.cos(-c.angle);
    const sin = Math.sin(-c.angle);
    const dx = p[0] - c.position.x;
    const dy = p[1] - c.position.y;
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    const bx = Math.max(-t.chassisW / 2, Math.min(t.chassisW / 2, lx));
    const by = Math.max(-t.chassisH / 2, Math.min(t.chassisH / 2, ly));
    if (Math.hypot(lx - bx, ly - by) < R) return true;
    // Lumi, the driver, sits on top a little toward the back (same circle as CarView draws).
    if (Math.hypot(lx - DRIVER.x * this.dir, ly - DRIVER.y) < R + DRIVER.r) return true;
    return this.wheels.some((w) => Math.hypot(p[0] - w.position.x, p[1] - w.position.y) < R + t.wheelRadius);
  }

  /** Steps until the run ends (or maxSteps). */
  runToEnd(maxSteps = this.tune.maxSteps): SimResult {
    while (!this.result && this.steps < maxSteps) this.step();
    if (!this.result) this.finish('timeout');
    return this.result!;
  }

  private updateGhosts() {
    const time = this.steps / 60;
    for (const g of this.ghosts) {
      const cycle = g.on + g.off;
      const phase = (((time + g.offset) % cycle) + cycle) % cycle;
      g.visible = phase < g.on;
      // A plank that comes back while the car is inside it stays passable until the car is clear,
      // so it never pops the car up out of a fall.
      let solid = g.visible;
      if (solid && !g.solid) {
        // Resting on top of it (a patch of ink flush with the plank) is fine: only a real overlap counts.
        for (const part of this.carParts) {
          const hits = this.M.Query.collides(part, g.bodies) as { depth: number }[];
          if (hits.some((h) => h.depth > 3)) {
            solid = false;
            break;
          }
        }
      }
      if (solid === g.solid) continue;
      g.solid = solid;
      for (const body of g.bodies) body.collisionFilter.mask = solid ? CAT_CAR : 0;
    }
  }

  private checkCandies() {
    const R = 22; // candy box radius
    this.level.candies.forEach((p, i) => {
      if (this.collected[i] || !this.touches(p, R)) return;
      this.collected[i] = true;
      this.events.push({ type: 'candy', index: i });
    });
  }

  private checkEnd() {
    const t = this.tune;
    const c = this.chassis;
    const { house } = this.level;
    if (Math.abs(c.position.x - house.x) < 34 && c.position.y > house.y - 90 && c.position.y < house.y + 4) return this.finish('win');
    for (const bat of this.level.bats ?? []) if (this.touches(batPos(bat, this.time), BAT_R)) return this.finish('bat');
    // A gap is a hole, and so is a ghost plank: once the car drops through its line it has fallen,
    // even if a road or a patch further down would catch it (no shortcuts through the levels below).
    for (let i = 0; i < this.holes.length; i++) {
      const g = this.holes[i];
      const depth = this.gapDepth(g);
      const below = depth > 0;
      const inside = c.position.x > Math.min(g.a[0], g.b[0]) && c.position.x < Math.max(g.a[0], g.b[0]);
      if (below && !this.gapBelow[i] && inside) this.gapIn[i] = true;
      if (!below) this.gapIn[i] = false;
      this.gapBelow[i] = below;
      if (this.gapIn[i] && depth > t.gapFallDepth) return this.finish('fall');
    }
    if (c.position.y > 1280 + 80 || c.position.x < -140 || c.position.x > 860) return this.finish('fall');
    const angle = Math.atan2(Math.sin(c.angle), Math.cos(c.angle));
    this.flipCount = Math.abs(angle) > (100 * Math.PI) / 180 ? this.flipCount + 1 : 0;
    if (this.flipCount > t.flipSteps) return this.finish('flip');
    // Stuck: the car has stayed inside a small box for a while (stopped, or rocking in a dip it
    // cannot climb out of).
    this.trail.push(c.position.x, c.position.y);
    const keep = t.stuckSteps * 2;
    if (this.trail.length > keep) this.trail.splice(0, this.trail.length - keep);
    if (this.trail.length === keep && this.pause === 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < keep; i += 2) {
        const x = this.trail[i];
        const y = this.trail[i + 1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (maxX - minX < t.stuckBox && maxY - minY < t.stuckBox) return this.finish('stuck');
    }
    if (this.steps >= t.maxSteps) return this.finish('timeout');
  }

  /** How far the chassis center is below a gap's line (negative above), at the closest x on the line. */
  private gapDepth(g: { a: Pt; b: Pt }) {
    const c = this.chassis.position;
    const [l, r] = g.a[0] < g.b[0] ? [g.a, g.b] : [g.b, g.a];
    const x = Math.max(l[0], Math.min(r[0], c.x));
    const f = r[0] > l[0] ? (x - l[0]) / (r[0] - l[0]) : 0;
    return c.y - (l[1] + (r[1] - l[1]) * f);
  }

  private finish(outcome: Outcome) {
    this.result = {
      outcome,
      steps: this.steps,
      candies: this.collected.flatMap((v, i) => (v ? [i] : [])),
    };
  }
}
