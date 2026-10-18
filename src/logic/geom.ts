import type { Pt } from './types.ts';

export function dist(a: Pt, b: Pt) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function polylineLength(pts: Pt[]) {
  let sum = 0;
  for (let i = 1; i < pts.length; i++) sum += dist(pts[i - 1], pts[i]);
  return sum;
}

/** Closest point on segment ab to p, and the position t along it (0 = a, 1 = b). */
export function closestOnSegment(p: Pt, a: Pt, b: Pt): { pt: Pt; t: number; d: number } {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  let t = len2 > 0 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const pt: Pt = [a[0] + dx * t, a[1] + dy * t];
  return { pt, t, d: dist(p, pt) };
}

function perpDistance(p: Pt, a: Pt, b: Pt) {
  return closestOnSegment(p, a, b).d;
}

/**
 * Ramer-Douglas-Peucker: drops points that stray less than eps from the line, so a shaky hand
 * is not charged extra ink (v0 section 3.3). Iterative, keeps the first and last point.
 */
export function simplify(pts: Pt[], eps = 3): Pt[] {
  if (pts.length <= 2) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = 1;
  keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop()!;
    let maxD = 0;
    let idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perpDistance(pts[i], pts[s], pts[e]);
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (idx >= 0 && maxD > eps) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Unit normal of segment ab that points down the screen (+y side). */
export function downNormal(a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [nx, ny];
}

export function inRect(p: Pt, r: { x: number; y: number; w: number; h: number }, pad = 0) {
  return p[0] >= r.x - pad && p[0] <= r.x + r.w + pad && p[1] >= r.y - pad && p[1] <= r.y + r.h + pad;
}

/** Angle of a segment from horizontal, in degrees, 0 to 90. */
export function slopeDeg(a: Pt, b: Pt) {
  return (Math.atan2(Math.abs(b[1] - a[1]), Math.abs(b[0] - a[0])) * 180) / Math.PI;
}
