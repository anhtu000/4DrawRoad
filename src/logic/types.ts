// Level data, shared by the game, the solver tools and the level check.
// Coordinates are field units: the field is 720 x 1280, origin top-left, y grows downward.

export type Pt = [number, number];

export interface GhostTiming {
  /** Seconds visible, then seconds gone. The cycle restarts at 0 when GO is pressed. */
  on: number;
  off: number;
  /** Seconds already into the cycle at GO. 0 = the plank has just appeared. */
  offset?: number;
}

export interface RoadDef {
  /** Top surface of the road, left to right. The road body hangs below it. */
  pts: Pt[];
  /** Ghost plank: blinks in and out on a fixed rhythm (brief 4.3). */
  ghost?: GhostTiming;
}

export interface RectDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WallDef extends RectDef {
  /** The car turns around when it touches this wall (rule A, brief 4.1). */
  turn: true;
}

export interface BlockDef extends RectDef {
  /** Look only: 'grave' draws a gravestone. */
  look?: 'grave' | 'rock';
}

export interface GapDef {
  /** Road edges on each side of the gap. The dotted hint joins them. */
  a: Pt;
  b: Pt;
  /**
   * A way the player may bridge but does not have to (a fork to a candy route). Drawn as a hint, but
   * it is not a hole: the car may drop past it to the road below.
   */
  optional?: boolean;
}

/**
 * Bat (from level 8): flies back and forth between a and b at a steady speed and sends the car home
 * with a "Boo!" when it touches it. Ink does not stop it. Like ghost planks, the flight restarts at
 * GO, so the run never depends on when GO is pressed (brief 3.1, line 4).
 */
export interface BatDef {
  a: Pt;
  b: Pt;
  /** Units per second. */
  speed: number;
  /** Seconds already into the flight at GO (0 = at a, heading for b). */
  offset?: number;
}

/** Bounce pumpkin (from level 12): sits on a road at x, y and throws the car up when it touches it. */
export interface PumpkinDef {
  x: number;
  /** Road surface the pumpkin sits on. */
  y: number;
  /** Upward speed it gives the car, units per second (default 560: the car rises about 370). */
  power?: number;
  /** Forward speed it gives the car, units per second (default 100: it lands about 220 ahead on a road 220 higher). */
  push?: number;
}

/** Mirror pair (from level 15): the car drives into mirror a and comes out of mirror b, same speed. */
export interface MirrorDef {
  /** Entry mirror: x and the road surface it stands on. */
  a: Pt;
  /** Exit mirror: x and the surface it stands on (or the spot in the air the car appears at). */
  b: Pt;
}

/** Lantern (from level 17): hangs at x, y; when the car touches it, gate number `gate` opens. */
export interface LanternDef {
  x: number;
  y: number;
  gate: number;
}

export type TutorialKind = 'draw' | 'multi' | 'candy' | 'par' | 'jump' | 'ghost' | 'fog' | 'bat' | 'bounce' | 'mirror' | 'lantern';

export interface LevelDef {
  id: number;
  name: string;
  /** Car start: x, the road surface y under the car, and which way it drives. */
  car: { x: number; y: number; dir: 1 | -1 };
  /** House: x of the door, y of the road it stands on. The car wins when it reaches the door. */
  house: { x: number; y: number };
  roads: RoadDef[];
  walls: WallDef[];
  blocks: BlockDef[];
  gaps: GapDef[];
  candies: Pt[];
  /** Ghost fog (from level 6): ink cannot be drawn inside. The car drives through it. */
  fog?: RectDef[];
  bats?: BatDef[];
  pumpkins?: PumpkinDef[];
  mirrors?: MirrorDef[];
  lanterns?: LanternDef[];
  /** Iron gates: solid, and turn the car like a wall, until their lantern is lit. Then they open. */
  gates?: RectDef[];
  /** Ink budget B and par T, in field units of line length. */
  ink: { budget: number; par: number };
  /**
   * How par T is set (decision 22/10, CLAUDE.md 5e):
   *   patch     levels 1-3: T = the reference solution (patch every gap) x 1.1; levelcheck fails if
   *             a much cheaper win exists (the level leaks)
   *   cheapest  from level 4: T = the cheapest robust win found by tools/search.ts that collects
   *             every candy (`best`) x 1.1; the budget still leaves room for the obvious solution
   */
  parRule: 'patch' | 'cheapest';
  /** Reference solution that wins and collects every candy: the obvious way a new player patches it. */
  solution: Pt[][];
  /** Other known wins (all candy). The search starts from these too. */
  alt?: Pt[][][];
  /** Cheapest robust win found (parRule 'cheapest'); written by levelcheck --fix. */
  best?: Pt[][];
  /** Dotted gap hints: 1 = full, below 1 fades them (from level 10, brief 3.3). */
  hintAlpha?: number;
  tutorial?: TutorialKind;
  /** Hold GO to see the jump arc (levels 5 to 8 in the v0 design). */
  preview?: boolean;
}
