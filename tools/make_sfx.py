# Generates the prototype's sound effects as small mono WAV files in public/audio.
#   python3 tools/make_sfx.py      (needs numpy)
import wave
from pathlib import Path

import numpy as np

SR = 22050
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
rng = np.random.default_rng(4)


def env(n, attack=0.005, release=None):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    r = np.exp(-t / release) if release else 1
    return a * r


def tone(freq, dur, release=0.08, kind="sine"):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = np.broadcast_to(freq, n) if np.ndim(freq) else np.full(n, float(freq))
    phase = 2 * np.pi * np.cumsum(f) / SR
    w = np.sin(phase)
    if kind == "bell":
        w = w + 0.35 * np.sin(phase * 2.01) + 0.15 * np.sin(phase * 3.98)
    return w * env(n, release=release)


def noise(dur, release=0.05, smooth=1):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    if smooth > 1:
        x = np.convolve(x, np.ones(smooth) / smooth, mode="same")
    return x * env(n, release=release)


def save(name, x, gain=0.6):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    pcm = (x * 32767).astype(np.int16)
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def cat(*parts):
    return np.concatenate(parts)


def at(base_len, *items):
    out = np.zeros(int(SR * base_len))
    for start, sig in items:
        s = int(SR * start)
        out[s : s + len(sig)] += sig[: len(out) - s]
    return out


save("ui-tap", tone(880, 0.05, 0.012) + 0.3 * noise(0.05, 0.006, 3), 0.45)
n = int(SR * 0.12)
save("pop", tone(np.linspace(520, 1500, n), 0.12, 0.05) + at(0.12, (0.05, 0.4 * tone(2100, 0.07, 0.03))), 0.55)
save("win", at(0.75, *[(i * 0.09, tone(f, 0.4, 0.18, "bell")) for i, f in enumerate([523, 659, 784, 1047])]), 0.6)
n = int(SR * 0.45)
save("boo", tone(np.linspace(420, 150, n), 0.45, 0.25) * 0.6 + noise(0.45, 0.2, 18) * 0.5, 0.5)
save("scratch", noise(0.07, 0.03, 4) * 0.8, 0.25)
save("turn", tone(np.linspace(220, 140, int(SR * 0.09)), 0.09, 0.04) + 0.3 * noise(0.09, 0.02, 6), 0.45)
save("go", at(0.32, *[(i * 0.1, tone(110, 0.08, 0.03) + 0.4 * noise(0.08, 0.02, 8)) for i in range(3)]), 0.5)
save("land", tone(np.linspace(150, 90, int(SR * 0.08)), 0.08, 0.03) + 0.4 * noise(0.08, 0.02, 12), 0.35)
print("sounds written to", OUT)
