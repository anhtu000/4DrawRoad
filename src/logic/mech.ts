// Geometry of the mechanics from level 6 on (fog, bats, pumpkins, mirrors, lanterns, gates), shared
// by the physics, the drawing rules and the level art so they always agree.
import type { BatDef, LevelDef, MirrorDef, Pt, PumpkinDef, RectDef } from './types.ts';

/** Bat body radius (hit circle). */
export const BAT_R = 17;
/** Pumpkin body radius; it sits on the road. */
export const PUMPKIN_R = 26;
export const PUMPKIN_POWER = 560;
export const PUMPKIN_PUSH = 100;
/** Lantern hit radius (the car has to touch it, like a candy). */
export const LANTERN_R = 18;
/** Mirror frame: half width and height above the surface it stands on. */
export const MIRROR_HW = 26;
export const MIRROR_H = 108;

/** Where a bat is t seconds after GO (or after the level opened, while drawing). */
export function batPos(b: BatDef, t: number): Pt {
  const len = Math.hypot(b.b[0] - b.a[0], b.b[1] - b.a[1]);
  if (len < 1 || b.speed <= 0) return [b.a[0], b.a[1]];
  const period = (2 * len) / b.speed;
  const s = ((((t + (b.offset ?? 0)) % period) + period) % period) * b.speed;
  const u = s > len ? 2 * len - s : s;
  const f = u / len;
  return [b.a[0] + (b.b[0] - b.a[0]) * f, b.a[1] + (b.b[1] - b.a[1]) * f];
}

/** Which way the bat is flying at time t: 1 toward b, -1 back toward a. */
export function batHeading(b: BatDef, t: number): 1 | -1 {
  const len = Math.hypot(b.b[0] - b.a[0], b.b[1] - b.a[1]);
  if (len < 1 || b.speed <= 0) return 1;
  const period = (2 * len) / b.speed;
  const s = ((((t + (b.offset ?? 0)) % period) + period) % period) * b.speed;
  return s > len ? -1 : 1;
}

export function pumpkinCenter(p: PumpkinDef): Pt {
  return [p.x, p.y - PUMPKIN_R + 3];
}

export function pumpkinBox(p: PumpkinDef): RectDef {
  return { x: p.x - PUMPKIN_R - 4, y: p.y - 2 * PUMPKIN_R - 6, w: 2 * PUMPKIN_R + 8, h: 2 * PUMPKIN_R + 6 };
}

export function mirrorBox(at: Pt): RectDef {
  return { x: at[0] - MIRROR_HW, y: at[1] - MIRROR_H, w: 2 * MIRROR_HW, h: MIRROR_H };
}

/** Places where ink may not go because of a mechanic (fog, gates, mirror frames, pumpkins). */
export function mechZones(level: LevelDef): RectDef[] {
  const out: RectDef[] = [...(level.fog ?? []), ...(level.gates ?? [])];
  for (const m of level.mirrors ?? []) out.push(mirrorBox(m.a), mirrorBox(m.b));
  for (const p of level.pumpkins ?? []) out.push(pumpkinBox(p));
  return out;
}

export type { MirrorDef };
