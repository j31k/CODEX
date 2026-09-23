import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: boolean;
}> = ({children, style, glow}) => (
  <div
    style={{
      background: `linear-gradient(160deg, ${C.panel} 0%, ${C.bg2} 100%)`,
      border: `1px solid ${C.line}`,
      borderRadius: 20,
      boxShadow: glow
        ? `0 0 0 1px ${C.orange}33, 0 20px 60px -20px ${C.orange}55, 0 30px 80px -30px #000`
        : '0 30px 80px -30px #000',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, color = C.orange, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 22px',
      borderRadius: 999,
      border: `1.5px solid ${color}`,
      color,
      fontFamily: F.mono,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: 1,
      background: `${color}14`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Stamp: React.FC<{
  children: React.ReactNode;
  color?: string;
  frame: number;
  start: number;
  style?: React.CSSProperties;
}> = ({children, color = C.orange, frame, start, style}) => {
  const t = ease.back(seg(frame, start, start + 14));
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '14px 30px',
        border: `5px solid ${color}`,
        borderRadius: 12,
        color,
        fontFamily: F.display,
        fontSize: 44,
        letterSpacing: 3,
        textTransform: 'uppercase',
        transform: `scale(${2.2 - 1.2 * t}) rotate(-6deg)`,
        opacity: clamp(t * 1.5),
        background: `${color}10`,
        boxShadow: `0 0 40px ${color}44`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const CountUp: React.FC<{
  frame: number;
  start: number;
  dur?: number;
  from?: number;
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({frame, start, dur = 30, from = 0, to, decimals = 0, suffix = '', prefix = '', style}) => {
  const t = ease.out(seg(frame, start, start + dur));
  const v = from + (to - from) * t;
  const txt = v.toFixed(decimals).replace('.', ',');
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {prefix}
      {txt}
      {suffix}
    </span>
  );
};

export const Typewriter: React.FC<{
  frame: number;
  start: number;
  text: string;
  cps?: number;
  style?: React.CSSProperties;
  cursorColor?: string;
}> = ({frame, start, text, cps = 28, style, cursorColor = C.orange}) => {
  const chars = Math.floor(Math.max(0, frame - start) * (cps / 30));
  const shown = text.slice(0, chars);
  const done = chars >= text.length;
  return (
    <span style={{whiteSpace: 'pre-wrap', ...style}}>
      {shown}
      <span
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1em',
          background: cursorColor,
          marginLeft: 2,
          verticalAlign: '-0.12em',
          opacity: done ? (Math.floor(frame / 8) % 2 ? 1 : 0) : 1,
        }}
      />
    </span>
  );
};

// horizontal comparison bar
export const Bar: React.FC<{
  frame: number;
  start: number;
  value: number; // 0..1 of max scale
  color: string;
  label: string;
  right?: string;
  width?: number;
  height?: number;
  dimmed?: boolean;
}> = ({frame, start, value, color, label, right, width = 900, height = 54, dimmed}) => {
  const t = ease.out(seg(frame, start, start + 24));
  return (
    <div style={{width, opacity: dimmed ? 0.55 : 1}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: F.mono,
          fontSize: 24,
          color: dimmed ? C.gray : C.white,
          marginBottom: 8,
        }}
      >
        <span>{label}</span>
        <span style={{color, fontWeight: 700}}>{right}</span>
      </div>
      <div
        style={{
          height,
          background: C.panel2,
          borderRadius: 10,
          border: `1px solid ${C.line}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value * t * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            borderRadius: 10,
            boxShadow: `0 0 24px ${color}66`,
          }}
        />
      </div>
    </div>
  );
};

// animated mouse cursor that moves between points
export const Cursor: React.FC<{
  frame: number;
  points: {f: number; x: number; y: number}[];
  clickAt?: number[];
  size?: number;
}> = ({frame, points, clickAt = [], size = 34}) => {
  if (points.length === 0) return null;
  let x = points[0].x;
  let y = points[0].y;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = ease.inOut(seg(frame, a.f, b.f));
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  const clicking = clickAt.some((c) => Math.abs(frame - c) < 6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 50,
        transform: `scale(${clicking ? 0.8 : 1})`,
        transition: 'transform 0.1s',
        pointerEvents: 'none',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M4 2 L4 19 L8.5 15 L11 21 L13.5 19.5 L11 14 L17 14 Z"
          fill={C.white}
          stroke="#000"
          strokeWidth={1.4}
        />
      </svg>
      {clicking && (
        <div
          style={{
            position: 'absolute',
            left: -14,
            top: -14,
            width: size + 28,
            height: size + 28,
            borderRadius: '50%',
            border: `3px solid ${C.orange}`,
            opacity: 0.8,
          }}
        />
      )}
    </div>
  );
};

export const FadeSlide: React.FC<{
  frame: number;
  start: number;
  dur?: number;
  dy?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({frame, start, dur = 18, dy = 40, children, style}) => {
  const t = ease.out(seg(frame, start, start + dur));
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * dy}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Shake: React.FC<{
  frame: number;
  start: number;
  dur?: number;
  amp?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({frame, start, dur = 20, amp = 10, children, style}) => {
  const t = seg(frame, start, start + dur);
  const active = t > 0 && t < 1;
  const dx = active ? Math.sin(frame * 2.3) * amp * (1 - t) : 0;
  const dy = active ? Math.cos(frame * 3.1) * amp * 0.6 * (1 - t) : 0;
  return (
    <div style={{transform: `translate(${dx}px, ${dy}px)`, ...style}}>{children}</div>
  );
};

export const OrangeAsterisk: React.FC<{size?: number; spin?: number; style?: React.CSSProperties}> = ({
  size = 80,
  spin = 0,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{transform: `rotate(${spin}deg)`, ...style}}
  >
    <g stroke={C.orange} strokeWidth={13} strokeLinecap="round">
      {Array.from({length: 6}).map((_, i) => {
        const a = (i * Math.PI) / 3;
        const x1 = 50 + Math.cos(a) * 16;
        const y1 = 50 + Math.sin(a) * 16;
        const x2 = 50 + Math.cos(a) * 42;
        const y2 = 50 + Math.sin(a) * 42;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  </svg>
);

export const interpolateText = interpolate;
