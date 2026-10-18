// The prototype's six levels (brief section 5.3). One JSON file per level (v0 section 10.1).
import type { LevelDef } from '../logic/types.ts';
import l01 from './01.json' with { type: 'json' };
import l02 from './02.json' with { type: 'json' };
import l03 from './03.json' with { type: 'json' };
import l04 from './04.json' with { type: 'json' };
import l05 from './05.json' with { type: 'json' };
import l10 from './10.json' with { type: 'json' };

export const LEVELS: LevelDef[] = [l01, l02, l03, l04, l05, l10] as unknown as LevelDef[];

export function levelById(id: number) {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

/** The level after this one, or null after the last. */
export function nextLevel(id: number) {
  const i = LEVELS.findIndex((l) => l.id === id);
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}
