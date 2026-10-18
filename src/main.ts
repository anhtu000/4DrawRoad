import { startGame } from '@core';
import game from './game.json';
import en from './i18n/en.json';
import { save } from './save';
import { PlayScene } from './scenes/PlayScene';

export const SOUNDS = ['ui-tap', 'pop', 'win', 'boo', 'scratch', 'turn', 'go', 'land'];

startGame({
  id: game.id,
  title: game.title,
  languages: { en },
  scenes: [PlayScene],
  playScene: 'Play',
  // Poki: no title screen, the first touch is already play (brief 5.1, v0 section 8).
  menu: false,
  save,
  preload: (scene) => {
    // A single-file build (npm run build:single) carries the sounds inline in window.__ASSETS.
    const inline = (window as unknown as { __ASSETS?: Record<string, string> }).__ASSETS;
    for (const key of SOUNDS) {
      const path = `audio/${key}.wav`;
      scene.load.audio(key, inline?.[path] ?? path);
    }
  },
  // Poki runs its own ad pacing: no timers of our own (Poki guide, section 7).
  ads: { midgameGapSec: 0, silentFailures: true },
  theme: {
    background: game.background,
    primary: 0xff9a3d,
    primaryText: '#2a1300',
    surface: 0x2d2358,
    surfaceText: '#ffffff',
    text: '#ffffff',
    textDim: '#c9c0ea',
    reward: 0x8b5cf6,
    rewardText: '#ffffff',
  },
});
