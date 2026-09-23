import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, seg, clamp, lerp, rand} from '../lib/design';

/*
 * Top-down neon arcade racer. Stadium-shaped track, deterministic.
 * mode 'ice'   : broken physics — kart slides and spins
 * mode 'fixed' : clean drifts, laps, positions
 * mode 'flash' : beauty slice (cold open)
 */

const CX = 960;
const CY = 560;
const R = 300; // arc radius of centerline
const STRAIGHT = 760; // straight length of centerline
const TRACK_W = 190;

// stadium centerline param: t in [0,1)
const trackPoint = (t: number) => {
  const arcLen = Math.PI * R;
  const total = 2 * STRAIGHT + 2 * arcLen;
  let d = ((t % 1) + 1) % 1 * total;
  // segment 1: top straight, left->right
  if (d < STRAIGHT) {
    return {x: CX - STRAIGHT / 2 + d, y: CY - R, a: 0};
  }
  d -= STRAIGHT;
  // right arc (top->bottom), angle -90..90
  if (d < arcLen) {
    const th = -Math.PI / 2 + (d / arcLen) * Math.PI;
    return {x: CX + STRAIGHT / 2 + Math.cos(th) * R, y: CY + Math.sin(th) * R, a: th + Math.PI / 2};
  }
  d -= arcLen;
  // bottom straight right->left
  if (d < STRAIGHT) {
    return {x: CX + STRAIGHT / 2 - d, y: CY + R, a: Math.PI};
  }
  d -= STRAIGHT;
  const th = Math.PI / 2 + (d / arcLen) * Math.PI;
  return {x: CX - STRAIGHT / 2 + Math.cos(th) * R, y: CY + Math.sin(th) * R, a: th + Math.PI / 2};
};

const Kart: React.FC<{
  x: number;
  y: number;
  angle: number; // radians, heading of body
  color: string;
  accent?: string;
  drift?: number; // 0..1 smoke/spark intensity
  scale?: number;
  spin?: number;
}> = ({x, y, angle, color, accent = '#fff', drift = 0, scale = 1, spin = 0}) => {
  const deg = (angle * 180) / Math.PI + spin;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${deg}) scale(${scale})`}>
      {drift > 0.05 && (
        <g opacity={drift}>
          {Array.from({length: 5}).map((_, i) => (
            <circle
              key={i}
              cx={-34 - i * 12 - rand(i) * 8}
              cy={(rand(i * 3) - 0.5) * 26}
              r={7 + rand(i * 7) * 10}
              fill="#8a8a96"
              opacity={0.4 * drift}
            />
          ))}
          <line x1={-26} y1={12} x2={-44 - drift * 20} y2={20} stroke={C.amber} strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          <line x1={-26} y1={-12} x2={-48 - drift * 24} y2={-16} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        </g>
      )}
      {/* wheels */}
      <rect x={-26} y={-24} width={16} height={10} rx={4} fill="#0a0a0e" />
      <rect x={-26} y={14} width={16} height={10} rx={4} fill="#0a0a0e" />
      <rect x={12} y={-24} width={16} height={10} rx={4} fill="#0a0a0e" />
      <rect x={12} y={14} width={16} height={10} rx={4} fill="#0a0a0e" />
      {/* body */}
      <rect x={-32} y={-17} width={64} height={34} rx={12} fill={color} />
      <rect x={-32} y={-17} width={64} height={12} rx={6} fill="#ffffff" opacity={0.22} />
      <rect x={20} y={-13} width={14} height={26} rx={6} fill={accent} opacity={0.9} />
      {/* driver */}
      <circle cx={-4} cy={0} r={9} fill="#14141c" />
      <circle cx={-4} cy={0} r={5} fill={accent} opacity={0.85} />
    </g>
  );
};

const Track: React.FC = () => {
  // build stadium path
  const pts: string[] = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const p = trackPoint(i / N);
    pts.push(`${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`);
  }
  const d = pts.join(' ') + ' Z';
  return (
    <g>
      {/* outer glow */}
      <path d={d} fill="none" stroke={C.orange} strokeWidth={TRACK_W + 46} opacity={0.10} strokeLinejoin="round" />
      {/* asphalt */}
      <path d={d} fill="none" stroke="#17171d" strokeWidth={TRACK_W} strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#1e1e26" strokeWidth={TRACK_W - 26} strokeLinejoin="round" />
      {/* curbs: dashed orange/white edges */}
      <path d={d} fill="none" stroke={C.orange} strokeWidth={7} strokeDasharray="26 26" opacity={0.9}
        transform={`translate(0,0)`} pathLength={400} stroke-dashoffset={0} />
      <path d={d} fill="none" stroke="#f5f2ec" strokeWidth={7} strokeDasharray="26 26" strokeDashoffset={26} opacity={0.85} pathLength={400} />
      {/* center dashed line */}
      <path d={d} fill="none" stroke="#3a3a46" strokeWidth={4} strokeDasharray="18 30" opacity={0.8} />
      {/* start line */}
      <g transform={`translate(${CX - STRAIGHT / 2 + 40}, ${CY - R})`}>
        {Array.from({length: 2}).map((_, r) =>
          Array.from({length: 10}).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={r * 16}
              y={-TRACK_W / 2 + c * (TRACK_W / 10)}
              width={16}
              height={TRACK_W / 10}
              fill={(r + c) % 2 ? '#0d0d12' : '#f5f2ec'}
              opacity={0.9}
            />
          ))
        )}
      </g>
    </g>
  );
};

export const MarioKartGame: React.FC<{
  mode?: 'ice' | 'fixed' | 'flash';
  startFrame?: number;
  frame?: number; // absolute frame override
  showHud?: boolean;
  width?: number;
  height?: number;
}> = ({mode = 'fixed', startFrame = 0, frame: frameProp, showHud = true, width = 1920, height = 1080}) => {
  const cf = useCurrentFrame();
  const local = frameProp ?? cf;
  const f = local + startFrame;
  const ice = mode === 'ice';

  // player progress along track (laps)
  const speed = ice ? 0.0011 : 0.0028;
  const baseT = 0.02 + f * speed;

  // opponents
  const opp = [
    {t: 0.06 + f * 0.00255, color: '#e8e4da', accent: C.orange},
    {t: 0.11 + f * 0.0023, color: '#8a8a96', accent: '#fff'},
    {t: 0.16 + f * 0.0021, color: '#9ad1ff', accent: '#fff'},
  ];

  // player kinematics
  const p = trackPoint(baseT);
  const ahead = trackPoint(baseT + 0.004);
  const velA = Math.atan2(ahead.y - p.y, ahead.x - p.x);

  // drift through right arc (t in ~[0.28..0.5]) and left arc (~[0.78..1])
  const lapT = ((baseT % 1) + 1) % 1;
  const inCorner = (lapT > 0.26 && lapT < 0.52) || (lapT > 0.76 && lapT < 1);
  const driftAmt = ice ? 0 : inCorner ? clamp(Math.sin(((lapT % 0.5) / 0.26) * Math.PI)) * 0.9 : 0;

  // body angle: velocity angle + drift offset
  const driftSign = lapT < 0.52 ? 1 : 1; // both arcs turn right relative to travel? arcs turn right on right side, left on left side
  const bodyA = velA + driftAmt * 0.55 * (lapT > 0.26 && lapT < 0.52 ? 1 : 1);

  // ice mode: slide outward + spin
  let px = p.x;
  let py = p.y;
  let spin = 0;
  if (ice) {
    const slide = seg(f, 30, 90);
    const outA = velA - Math.PI / 2;
    px += Math.cos(outA) * slide * 120;
    py += Math.sin(outA) * slide * 120;
    spin = seg(f, 55, 120) * 360 * 1.5;
  }

  // tire marks during drift (recent path)
  const marks: {x: number; y: number; a: number; o: number}[] = [];
  if (!ice) {
    for (let i = 1; i <= 22; i++) {
      const tt = baseT - i * 0.0018;
      const mp = trackPoint(tt);
      const lt = ((tt % 1) + 1) % 1;
      const wasCorner = (lt > 0.26 && lt < 0.52) || (lt > 0.76 && lt < 1);
      if (wasCorner) marks.push({x: mp.x, y: mp.y, a: 0, o: (1 - i / 22) * 0.5});
    }
  }

  const lap = Math.floor(baseT) + 1;
  const position = ice ? 4 : clamp(4 - Math.floor(Math.max(0, f - 60) / 110), 1, 4);

  return (
    <div style={{width, height, overflow: 'hidden', position: 'relative', background: '#0a0a10'}}>
      <svg width={width} height={height} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="grassGlow" cx="0.5" cy="0.5" r="0.8">
            <stop offset="0%" stopColor="#101018" />
            <stop offset="100%" stopColor="#07070b" />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#grassGlow)" />
        {/* decorative grid floor */}
        {Array.from({length: 24}).map((_, i) => (
          <line key={i} x1={i * 84} y1={0} x2={i * 84} y2={1080} stroke="#14141c" strokeWidth={1} />
        ))}
        {Array.from({length: 14}).map((_, i) => (
          <line key={'h' + i} x1={0} y1={i * 84} x2={1920} y2={i * 84} stroke="#14141c" strokeWidth={1} />
        ))}

        <Track />

        {/* tire marks */}
        {marks.map((m, i) => (
          <g key={i} opacity={m.o}>
            <circle cx={m.x - 8} cy={m.y + 12} r={4.5} fill="#050507" />
            <circle cx={m.x + 8} cy={m.y - 12} r={4.5} fill="#050507" />
          </g>
        ))}

        {/* opponents */}
        {opp.map((o, i) => {
          const op = trackPoint(o.t);
          const oa = trackPoint(o.t + 0.004);
          const ang = Math.atan2(oa.y - op.y, oa.x - op.x);
          return <Kart key={i} x={op.x} y={op.y} angle={ang} color={o.color} accent={o.accent} scale={0.92} />;
        })}

        {/* player */}
        <Kart x={px} y={py} angle={bodyA} color={C.orange} accent="#fff" drift={ice ? seg(f, 30, 90) * 0.7 : driftAmt} spin={spin} scale={1.06} />

        {/* speed lines when drifting */}
        {!ice && driftAmt > 0.25 && (
          <g opacity={driftAmt * 0.7}>
            {Array.from({length: 10}).map((_, i) => {
              const yy = rand(i * 3 + Math.floor(f / 4)) * 1080;
              const xx = (rand(i * 7 + Math.floor(f / 4)) * 1920 + f * 30) % 2100 - 100;
              return <line key={i} x1={xx} y1={yy} x2={xx + 90} y2={yy} stroke="#fff" strokeWidth={2.5} opacity={0.35} />;
            })}
          </g>
        )}
      </svg>

      {showHud && (
        <>
          {/* lap + position */}
          <div style={{position: 'absolute', top: 44, right: 56, textAlign: 'right'}}>
            <div
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: 74,
                color: C.white,
                textShadow: '0 4px 0 #000, 0 0 30px rgba(255,90,31,0.35)',
                lineHeight: 1,
              }}
            >
              {position}
              <span style={{fontSize: 34, color: C.orange}}>
                {position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'}
              </span>
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 30,
                color: C.amber,
                marginTop: 8,
                letterSpacing: 2,
              }}
            >
              КРУГ {clamp(lap, 1, 3)}/3
            </div>
          </div>
          {/* minimap */}
          <div
            style={{
              position: 'absolute',
              bottom: 46,
              right: 56,
              background: 'rgba(10,10,16,0.7)',
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: 10,
            }}
          >
            <svg width={220} height={130} viewBox="620 140 680 840" style={{display: 'block'}}>
              <path
                d={(() => {
                  const pts: string[] = [];
                  for (let i = 0; i <= 100; i++) {
                    const q = trackPoint(i / 100);
                    pts.push(`${i === 0 ? 'M' : 'L'} ${q.x} ${q.y}`);
                  }
                  return pts.join(' ') + ' Z';
                })()}
                fill="none"
                stroke="#4a4a56"
                strokeWidth={26}
                strokeLinejoin="round"
              />
              {opp.map((o, i) => {
                const q = trackPoint(o.t);
                return <circle key={i} cx={q.x} cy={q.y} r={22} fill="#8a8a96" />;
              })}
              <circle cx={p.x} cy={p.y} r={26} fill={C.orange} stroke="#fff" strokeWidth={6} />
            </svg>
          </div>
          {ice && (
            <div
              style={{
                position: 'absolute',
                top: 120,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: C.ice,
                  background: 'rgba(5,15,25,0.8)',
                  border: `1px solid ${C.ice}`,
                  padding: '12px 26px',
                  borderRadius: 10,
                  fontSize: 28,
                  opacity: ease.out(seg(f, 34, 48)),
                }}
              >
                ⚠ physics.grip = 0.05 — МАШИНКУ ЗАНОСИТ
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
