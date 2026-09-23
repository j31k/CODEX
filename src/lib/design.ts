// Design system: black / orange / white
export const C = {
  bg: '#0B0B0D',
  bg2: '#121215',
  panel: '#16161A',
  panel2: '#1C1C21',
  line: '#2A2A31',
  orange: '#FF5A1F',
  orangeSoft: '#FF8A50',
  amber: '#FFB25A',
  white: '#F5F2EC',
  gray: '#9A9AA3',
  dim: '#5C5C66',
  red: '#FF3B30',
  green: '#34D399',
  ice: '#9AD1FF',
};

export const F = {
  display: "'Russo One', sans-serif",
  body: "'Golos Text', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const FPS = 30;

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// deterministic pseudo-random from seed
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const ease = {
  out: (t: number) => 1 - Math.pow(1 - clamp(t), 3),
  in: (t: number) => Math.pow(clamp(t), 3),
  inOut: (t: number) => {
    const c = clamp(t);
    return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
  },
  back: (t: number) => {
    const c = clamp(t);
    const s = 1.70158;
    return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2);
  },
  spring: (t: number) => {
    const c = clamp(t);
    return 1 - Math.cos(c * Math.PI * 3.5) * Math.exp(-c * 6);
  },
};

// progress of frame within [start, end]
export const seg = (frame: number, start: number, end: number) =>
  clamp((frame - start) / Math.max(1, end - start));
