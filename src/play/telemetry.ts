// Test log for the prototype (brief 5.4): one row per attempt, kept on this device and saved as a
// CSV from the pause menu. Web test builds only; portal builds keep nothing extra.
export interface Attempt {
  /** ISO time the attempt ended. */
  at: string;
  session: string;
  level: number;
  attempt: number;
  strokes: number;
  ink: number;
  par: number;
  budget: number;
  /** Seconds from the level (or the last failed run) to GO. */
  drawSec: number;
  runSec: number;
  outcome: string;
  candies: number;
  stars: number;
}

const KEY = `${__GAME_ID__}.log`;
const MAX = 3000;
const session = Math.random().toString(36).slice(2, 8);

function read(): Attempt[] {
  if (__TARGET__ !== 'web') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Attempt[];
  } catch {
    return [];
  }
}

export const telemetry = {
  session,
  rows: read(),
  add(row: Omit<Attempt, 'at' | 'session'>) {
    if (__TARGET__ !== 'web') return;
    this.rows.push({ at: new Date().toISOString(), session, ...row });
    if (this.rows.length > MAX) this.rows.splice(0, this.rows.length - MAX);
    try {
      localStorage.setItem(KEY, JSON.stringify(this.rows));
    } catch {
      // storage full or blocked: keep the rows in memory
    }
  },
  csv(): string {
    const cols: (keyof Attempt)[] = ['at', 'session', 'level', 'attempt', 'strokes', 'ink', 'par', 'budget', 'drawSec', 'runSec', 'outcome', 'candies', 'stars'];
    return [cols.join(','), ...this.rows.map((r) => cols.map((c) => String(r[c])).join(','))].join('\n');
  },
  /** Starts a download of the log as a CSV file. */
  download() {
    const blob = new Blob([this.csv()], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `GhostInkRoad_TestLog_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  },
};
