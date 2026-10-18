// Phaser's own copy of Matter.js, loaded from the package source so the Node tools run exactly the
// physics the game runs (the game uses Phaser.Physics.Matter.Matter, built from the same files).
// The package's "exports" field hides src/, so the file is loaded by its path.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const path = fileURLToPath(new URL('../node_modules/phaser/src/physics/matter-js/CustomMain.js', import.meta.url));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Matter: any = require(path);
