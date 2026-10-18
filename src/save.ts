import { SaveStore } from '@core';

export interface LevelBest {
  stars: number;
  score: number;
  ink: number;
}

// Progress of this prototype. Saved automatically (core/save.ts).
export interface SaveData {
  /** Level on screen when the player left. */
  level: number;
  /** Best result per level id. */
  best: Record<string, LevelBest>;
  /** Candies ever collected per level id (indexes), for the gold ring on new ones. */
  candy: Record<string, number[]>;
  /** Tutorial steps already shown. */
  tutorial: string[];
}

/**
 * Web test builds only: changing this wipes test saves on the next load, so a new round of testing
 * starts from level 1. #reset in the address does the same once.
 */
const WEB_SAVE_EPOCH = '2026-10-19a';

if (__TARGET__ === 'web') {
  try {
    const epochKey = `${__GAME_ID__}.webEpoch`;
    const asked = /(^#|\+)reset(\+|$)/.test(location.hash) || new URLSearchParams(location.search).has('reset');
    if (asked || localStorage.getItem(epochKey) !== WEB_SAVE_EPOCH) {
      localStorage.removeItem(`${__GAME_ID__}.save`);
      localStorage.setItem(epochKey, WEB_SAVE_EPOCH);
    }
    if (asked) {
      const hash = location.hash.replace(/(^#|\+)reset(?=\+|$)/, '$1').replace(/^#\+/, '#').replace(/\+$/, '').replace(/^#$/, '');
      const query = new URLSearchParams(location.search);
      query.delete('reset');
      const qs = query.toString();
      history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + hash);
    }
  } catch {
    // no storage: every load is fresh anyway
  }
}

export const save = new SaveStore<SaveData>({
  key: `${__GAME_ID__}.save`,
  version: 1,
  defaults: () => ({ level: 1, best: {}, candy: {}, tutorial: [] }),
});
