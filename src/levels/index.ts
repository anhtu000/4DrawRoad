// All 20 levels (v0 section 6.2, brief v2 section 7). One JSON file per level (v0 section 10.1).
import type { LevelDef } from '../logic/types.ts';
import l01 from './01.json' with { type: 'json' };
import l02 from './02.json' with { type: 'json' };
import l03 from './03.json' with { type: 'json' };
import l04 from './04.json' with { type: 'json' };
import l05 from './05.json' with { type: 'json' };
import l06 from './06.json' with { type: 'json' };
import l07 from './07.json' with { type: 'json' };
import l08 from './08.json' with { type: 'json' };
import l09 from './09.json' with { type: 'json' };
import l10 from './10.json' with { type: 'json' };
import l11 from './11.json' with { type: 'json' };
import l12 from './12.json' with { type: 'json' };
import l13 from './13.json' with { type: 'json' };
import l14 from './14.json' with { type: 'json' };
import l15 from './15.json' with { type: 'json' };
import l16 from './16.json' with { type: 'json' };
import l17 from './17.json' with { type: 'json' };
import l18 from './18.json' with { type: 'json' };
import l19 from './19.json' with { type: 'json' };
import l20 from './20.json' with { type: 'json' };

export const LEVELS: LevelDef[] = [l01, l02, l03, l04, l05, l06, l07, l08, l09, l10, l11, l12, l13, l14, l15, l16, l17, l18, l19, l20] as unknown as LevelDef[];

export function levelById(id: number) {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

/** The level after this one, or null after the last. */
export function nextLevel(id: number) {
  const i = LEVELS.findIndex((l) => l.id === id);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}
