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
  /** Reference solution that wins and collects every candy (levelcheck runs it). */
  solution: Pt[][];
  /** Dotted gap hints: 1 = full, below 1 fades them (from level 10, brief 3.3). */
  hintAlpha?: number;
  tutorial?: TutorialKind;
  /** Hold GO to see the jump arc (levels 5 to 8 in the v0 design). */
  preview?: boolean;
}
