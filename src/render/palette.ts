// One palette for the whole game: a cute night, not a scary one (v0 section 7.1).
// Kept away from #83FFE7, which Poki asks thumbnails to avoid.
export const C = {
  page: 0x120f2a,
  skyTop: 0x1a1440,
  skyBottom: 0x3b2c6e,
  moon: 0xfff1c2,
  moonGlow: 0xffe08a,
  star: 0xffffff,
  hillFar: 0x2b2257,
  hillNear: 0x231b47,

  road: 0x5b4673,
  roadDark: 0x3d2d52,
  roadTop: 0xb59bd8,
  outline: 0x1c1430,
  pebble: 0x7a6496,

  stone: 0x766a92,
  stoneDark: 0x4e4468,
  stoneLight: 0x9a8fb6,
  sign: 0xff9a3d,

  houseWall: 0x4a3768,
  houseRoof: 0x2c2045,
  window: 0xffd36b,
  door: 0xff9a3d,

  pumpkin: 0xff8a2b,
  pumpkinDark: 0xd8611a,
  pumpkinLight: 0xffb15e,
  stem: 0x5bbf6a,
  wheel: 0x2a1f3f,
  hub: 0x9d8cc2,

  ghost: 0xf6f2ff,
  ghostShade: 0xd9d0f2,
  scarf: 0xff7a3d,
  blush: 0xff9ec4,
  eye: 0x241838,

  ink: 0x9b5cff,
  inkGlow: 0xa86bff,
  inkCore: 0xeedcff,

  plank: 0xc9b9ff,
  plankDark: 0x8e7ad6,

  candy: 0xff6fb1,
  candyLight: 0xffc2de,
  candyBow: 0xffd36b,

  gold: 0xffc93d,
  silver: 0xd8d6ea,
  hint: 0xffffff,
} as const;

export const TEXT = {
  main: '#ffffff',
  dim: '#c9c0ea',
  gold: '#ffd36b',
  dark: '#2a1a00',
};
