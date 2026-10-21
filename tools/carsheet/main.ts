// Design sheet for the car (dev only): npm run dev, then open /tools/carsheet/index.html
// Draws the parts with live Graphics at large scale, composed like CarView does, next to the old car.
import Phaser from 'phaser';
import { COCKPIT_AT, drawBeam, drawCarEyes, drawCockpitLip, drawFender, drawLumi, drawPuff, drawScarfTail, drawShell, drawTyre, drawVine, RIG } from '../../src/render/car.ts';
import { drawGhost, drawPumpkin, drawWheel } from '../../src/render/art.ts';
import { drawSky } from '../../src/render/art.ts';

type G = Phaser.GameObjects.Graphics;

interface PoseOpts {
  scarf: number;
  vine: number;
  lumiLift: number;
  squash: [number, number];
  blink?: boolean;
  puffs?: boolean;
  dir?: 1 | -1;
  tilt?: number;
  wheelDrop?: number;
}

class Sheet extends Phaser.Scene {
  constructor() {
    super('sheet');
  }
  part(c: Phaser.GameObjects.Container, draw: (g: G) => void, x = 0, y = 0, rot = 0, blend = false) {
    const g = this.add.graphics();
    draw(g);
    g.setPosition(x, y).setRotation(rot);
    if (blend) g.setBlendMode(Phaser.BlendModes.ADD);
    c.add(g);
    return g;
  }
  car(x: number, y: number, s: number, o: PoseOpts) {
    const root = this.add.container(x, y).setScale(s);
    const dir = o.dir ?? 1;
    const body = this.add.container(0, 0).setScale(dir * o.squash[0], o.squash[1]).setRotation(o.tilt ?? 0);
    const front = this.add.container(0, 0).setScale(dir * o.squash[0], o.squash[1]).setRotation(o.tilt ?? 0);
    if (o.puffs) {
      for (const [px, py, sc, a] of [[-74, 0, 0.7, 0.75], [-90, -8, 0.95, 0.5], [-108, -16, 1.2, 0.25]] as const) {
        const g = this.part(root, drawPuff, px * dir, py);
        g.setScale(sc).setAlpha(a);
      }
    }
    this.part(body, drawBeam, RIG.lamp.x, RIG.lamp.y, 0, true);
    this.part(body, drawVine, RIG.vine.x, RIG.vine.y, o.vine);
    this.part(body, drawShell);
    this.part(body, drawScarfTail, RIG.scarfKnot.x, RIG.scarfKnot.y, o.scarf);
    this.part(body, (g) => drawLumi(g, o.blink), RIG.lumi.x, RIG.lumi.y - o.lumiLift);
    this.part(body, (g) => drawCarEyes(g, o.blink), RIG.eyes.x, RIG.eyes.y);
    this.part(body, drawCockpitLip, COCKPIT_AT.x, COCKPIT_AT.y);
    for (const f of RIG.fenders) this.part(front, drawFender, f.x, f.y);
    root.add(body);
    const wd = o.wheelDrop ?? 0;
    for (const wx of [-33, 33]) this.part(root, (g) => drawTyre(g, 17), wx, 16 + wd, wx * 0.03);
    root.add(front);
    return root;
  }
  oldCar(x: number, y: number, s: number) {
    const root = this.add.container(x, y).setScale(s);
    for (const wx of [-33, 33]) this.part(root, (g) => drawWheel(g, 17), wx, 16);
    const gh = this.part(root, (g) => { g.translateCanvas(0, 30); drawGhost(g); }, -6, -38);
    gh.setScale(0.8);
    this.part(root, drawPumpkin);
    return root;
  }
  label(x: number, y: number, t: string, size = 22) {
    this.add.text(x, y, t, { fontFamily: 'sans-serif', fontSize: size, color: '#d8d0f5' }).setOrigin(0.5, 0);
  }
  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const g = this.add.graphics();
    drawSky(g, 0, 0, W, H, [W - 160, 140], 3);
    const ground = (y: number, x0: number, x1: number) => {
      const r = this.add.graphics();
      r.fillStyle(0x1c1430, 1);
      r.fillRect(x0, y, x1 - x0, 8);
      r.fillStyle(0xb59bd8, 1);
      r.fillRect(x0, y, x1 - x0, 3);
    };
    // Row 1: big views, at rest and driving.
    const S = 3.2;
    const y1 = 300;
    this.car(330, y1, S, { scarf: -1.05, vine: 0.02, lumiLift: 0, squash: [1, 1] });
    ground(y1 + 33 * S, 60, 600);
    this.label(330, y1 + 33 * S + 16, 'Waiting at the start');
    this.car(960, y1, S, { scarf: -0.12, vine: -0.32, lumiLift: 0, squash: [1, 1], puffs: true, blink: false });
    ground(y1 + 33 * S, 680, 1240);
    this.label(960, y1 + 33 * S + 16, 'Driving: scarf streams, vine leans, puffs');
    // Row 2: in the air, landing squash, U-turn
    const S2 = 2;
    const y2 = 700;
    this.car(240, y2, S2, { scarf: -0.5, vine: 0.25, lumiLift: 4, squash: [1, 1], tilt: -0.25, wheelDrop: 5 });
    this.label(240, y2 + 33 * S2 + 30, 'In the air');
    this.car(560, y2, S2, { scarf: -0.7, vine: 0.35, lumiLift: -2, squash: [1.12, 0.84], wheelDrop: -3 });
    ground(y2 + 33 * S2 - 3 * S2 * 0.2, 420, 700);
    this.label(560, y2 + 33 * S2 + 30, 'Landing');
    this.car(880, y2, S2, { scarf: -0.9, vine: 0.1, lumiLift: 0, squash: [0.86, 1.1], dir: -1, blink: true });
    ground(y2 + 33 * S2, 740, 1020);
    this.label(880, y2 + 33 * S2 + 30, 'U-turn at a wall');
    // Row 3: real sizes. 1x = field units; 0.57x = a 412 px wide phone in portrait.
    const y3 = 1010;
    this.label(150, y3 - 80, 'Old, 1x', 18);
    this.oldCar(150, y3, 1);
    this.label(330, y3 - 80, 'New, 1x', 18);
    this.car(330, y3, 1, { scarf: -0.15, vine: -0.2, lumiLift: 0, squash: [1, 1], puffs: true });
    this.label(520, y3 - 80, 'Old, phone', 18);
    this.oldCar(520, y3, 0.57);
    this.label(660, y3 - 80, 'New, phone', 18);
    this.car(660, y3, 0.57, { scarf: -0.15, vine: -0.2, lumiLift: 0, squash: [1, 1] });
    this.label(980, y3 - 80, 'Parts: tyre, Lumi, vine', 18);
    const parts = this.add.container(0, 0);
    this.part(parts, (g) => drawTyre(g, 17), 880, y3).setScale(2);
    this.part(parts, (g) => drawLumi(g), 980, y3).setScale(2);
    this.part(parts, drawVine, 1080, y3 + 20).setScale(2);
    this.part(parts, (g) => drawCarEyes(g), 1160, y3).setScale(2);
    (window as unknown as { __ready: boolean }).__ready = true;
  }
}

new Phaser.Game({ type: Phaser.WEBGL, width: 1280, height: 1120, backgroundColor: '#1a1440', scene: [Sheet], render: { antialias: true } });
