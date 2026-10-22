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
}

export type TutorialKind = 'draw' | 'multi' | 'candy' | 'par' | 'jump' | 'ghost';

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
