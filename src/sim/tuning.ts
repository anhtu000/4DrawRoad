// Physics numbers in one place. Field units (720 x 1280 field) and seconds.
// Targets from the brief (section 4.5); the measured values are in tools/tune.ts output and the README.

export const FIELD_W = 720;
export const FIELD_H = 1280;

/** Fixed physics step. The simulation never depends on the frame rate (v0 section 3.4). */
export const STEP_HZ = 60;
export const STEP_MS = 1000 / STEP_HZ;

export const TUNING = {
  /** Gravity in units per second squared. Matter's default is about 1000; a ghost world is floatier. */
  gravity: 420,
  /** Top speed on flat road, units per second. */
  carSpeed: 300,
  /** Steepest slope the motor can climb from a slow start. Sets the motor's push: gravity x sin(climbDeg). */
  climbDeg: 41,
  /** Extra push on flat road (units/s^2), fading to 0 at climbDeg, so the car gets going quickly. */
  flatBoost: 330,
  /** On a slope steeper than climbDeg the wheels slip: the car loses this much speed per second. */
  slipDecel: 350,
  wheelRadius: 17,
  /** Distance between the two wheel centers. */
  wheelBase: 66,
  chassisW: 96,
  chassisH: 26,
  /** Wheel centers sit this far below the chassis center. */
  wheelDrop: 16,
  chassisFriction: 0.4,
  /** Suspension spring: stiffness 0..1 and damping. */
  springStiffness: 0.35,
  springDamping: 0.12,
  /** Road band thickness below its top line. */
  roadThickness: 30,
  /** Ink line thickness (v0: 14). */
  inkThickness: 14,
  /** Pause at a turn-around wall, in steps (0.15 s). */
  turnPauseSteps: 9,
  /** Fail rules (v0 section 3.5): upside down for 1.5 s, not getting anywhere for 2.5 s, run longer than 40 s. */
  flipSteps: 90,
  /** Stuck: the chassis stayed inside a stuckBox square for stuckSteps steps (2.5 s). */
  stuckSteps: 150,
  stuckBox: 90,
  maxSteps: 40 * 60,
} as const;

/** Drawing rules. */
export const INK = {
  /** A new point is added once the finger has moved this far. */
  minSpacing: 6,
  /** Smoothing tolerance after the finger lifts (v0: 3). */
  simplifyEps: 3,
  /** Stroke start and end snap to a road edge or a stroke end within this radius (v0: 18). */
  snapRadius: 18,
  /** Ink may sink this far into the top of a road (so a patch can sit flush with it). */
  roadSink: 10,
  /** Drawing area: above and below it are the HUD and the buttons. */
  top: 160,
  bottom: 1130,
  /** Shortest stroke that is kept, units. */
  minLength: 8,
} as const;
