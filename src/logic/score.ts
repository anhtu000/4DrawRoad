// Ink score with a par (v0 section 4): full 1000 up to par T, then an S-curve down to 400 at the
// budget B. Stars come from the ink score only; each candy adds 100 to the level score.

export function inkScore(used: number, par: number, budget: number): number {
  const x = Math.min(1, Math.max(0, (used - par) / (budget - par)));
  const s = x * x * (3 - 2 * x);
  return Math.round(1000 - 600 * s);
}

export const STAR_SCORES = [700, 950] as const;

export function starsFor(score: number): 1 | 2 | 3 {
  return score >= STAR_SCORES[1] ? 3 : score >= STAR_SCORES[0] ? 2 : 1;
}

/** Position x (0..1 of the spare ink) where the smoothstep score falls to `score`. */
function xForScore(score: number): number {
  const target = (1000 - score) / 600;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (m * m * (3 - 2 * m) < target) lo = m;
    else hi = m;
  }
  return lo;
}

const X3 = xForScore(STAR_SCORES[1] - 0.5);
const X2 = xForScore(STAR_SCORES[0] - 0.5);

/** Most ink that still gives 3 stars and 2 stars. The ink jar marks them. */
export function starLimits(par: number, budget: number) {
  return { three: par + (budget - par) * X3, two: par + (budget - par) * X2 };
}

export function levelScore(used: number, par: number, budget: number, candies: number) {
  const ink = inkScore(used, par, budget);
  return { ink, total: ink + 100 * candies, stars: starsFor(ink) };
}
