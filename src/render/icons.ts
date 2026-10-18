// Button icons, same signature as core/ui/icons.ts: drawn centered in a size x size box.
import type Phaser from 'phaser';
import { C } from './palette.ts';

type G = Phaser.GameObjects.Graphics;

export const undoIcon = (g: G, size: number, color: number) => {
  const r = size * 0.3;
  g.lineStyle(size * 0.12, color, 1);
  g.beginPath();
  g.arc(size * 0.04, size * 0.04, r, Math.PI * 1.05, Math.PI * 0.55, false);
  g.strokePath();
  g.fillStyle(color, 1);
  const x = -r + size * 0.04;
  const y = size * 0.02;
  g.fillTriangle(x - size * 0.17, y - size * 0.02, x + size * 0.15, y - size * 0.02, x - size * 0.01, y + size * 0.2);
};

export const trashIcon = (g: G, size: number, color: number) => {
  const w = size * 0.5;
  g.fillStyle(color, 1);
  g.fillRoundedRect(-w / 2 - size * 0.06, -size * 0.3, w + size * 0.12, size * 0.09, size * 0.03);
  g.fillRect(-size * 0.08, -size * 0.38, size * 0.16, size * 0.08);
  g.fillRoundedRect(-w / 2, -size * 0.18, w, size * 0.52, size * 0.06);
  g.fillStyle(0x000000, 0.25);
  for (const dx of [-0.13, 0, 0.13]) g.fillRect(dx * size - size * 0.025, -size * 0.1, size * 0.05, size * 0.36);
};

export const goIcon = (g: G, size: number, color: number) => {
  g.fillStyle(color, 1);
  g.fillTriangle(-size * 0.22, -size * 0.32, -size * 0.22, size * 0.32, size * 0.34, 0);
};

export const stopIcon = (g: G, size: number, color: number) => {
  g.fillStyle(color, 1);
  g.fillRoundedRect(-size * 0.26, -size * 0.26, size * 0.52, size * 0.52, size * 0.08);
};

export const menuIcon = (g: G, size: number, color: number) => {
  g.fillStyle(color, 1);
  for (const dy of [-0.24, 0, 0.24]) g.fillRoundedRect(-size * 0.32, dy * size - size * 0.06, size * 0.64, size * 0.12, size * 0.06);
};

export const restartIcon = (g: G, size: number, color: number) => {
  const r = size * 0.3;
  g.lineStyle(size * 0.12, color, 1);
  g.beginPath();
  g.arc(0, 0, r, Math.PI * 0.3, Math.PI * 1.9, false);
  g.strokePath();
  g.fillStyle(color, 1);
  const a = Math.PI * 1.9;
  const x = Math.cos(a) * r;
  const y = Math.sin(a) * r;
  g.fillTriangle(x - size * 0.16, y - size * 0.06, x + size * 0.16, y - size * 0.06, x + size * 0.02, y + size * 0.16);
};

export function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : outer;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

export const starIcon = (g: G, size: number, color: number) => {
  g.fillStyle(C.outline, 1);
  g.fillPoints(starPoints(0, size * 0.03, size * 0.5, size * 0.24) as unknown as Phaser.Math.Vector2[], true);
  g.fillStyle(color, 1);
  g.fillPoints(starPoints(0, size * 0.02, size * 0.42, size * 0.19) as unknown as Phaser.Math.Vector2[], true);
};

export const lockIcon = (g: G, size: number, color: number) => {
  g.lineStyle(size * 0.1, color, 1);
  g.beginPath();
  g.arc(0, -size * 0.08, size * 0.17, Math.PI, 0, false);
  g.strokePath();
  g.fillStyle(color, 1);
  g.fillRoundedRect(-size * 0.27, -size * 0.08, size * 0.54, size * 0.4, size * 0.06);
};
