import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp, lerp, rand} from '../lib/design';

/*
 * Generative art "written by the model": orbiting orbs with trails.
 * variant 1: fast/harsh, variant 2: slow/soft trails, variant 3: depth layers
 * mode 'editor': code panel + preview; mode 'beauty': full-frame art (cold open)
 */

const orbPos = (i: number, t: number, variant: number, layer: number) => {
  const speed = variant === 1 ? 1.6 : variant === 2 ? 0.55 : 0.4;
  const baseR = variant === 1 ? 120 : variant === 2 ? 200 : 170 + layer * 90;
  const a = t * speed * (0.4 + rand(i * 3) * 0.9) + rand(i * 7) * Math.PI * 2;
  const r = baseR * (0.45 + rand(i * 11) * 0.8);
  const wob = Math.sin(t * 0.9 + i) * (variant === 1 ? 8 : 26);
  return {
    x: Math.cos(a) * (r + wob),
    y: Math.sin(a * (1 + rand(i * 5) * 0.35)) * (r * 0.62 + wob),
  };
};

export const GenerativeArt: React.FC<{
  frame: number;
  variant: number;
  width?: number;
  height?: number;
}> = ({frame, variant, width = 960, height = 900}) => {
  const t = frame / 30;
  const layers = variant === 3 ? 3 : 1;
  const count = variant === 1 ? 14 : 22;
  const cx = width / 2;
  const cy = height / 2;
  const trailN = variant === 1 ? 0 : variant === 2 ? 8 : 12;
  return (
    <svg width={width} height={height} style={{display: 'block', background: '#07070b'}}>
      <defs>
        <radialGradient id="orbGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={C.amber} stopOpacity="0.9" />
          <stop offset="45%" stopColor={C.orange} stopOpacity="0.45" />
          <stop offset="100%" stopColor={C.orange} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* center glow */}
      <circle cx={cx} cy={cy} r={variant === 1 ? 90 : 190} fill="url(#orbGlow)" opacity={variant === 1 ? 0.35 : 0.6} />
      {Array.from({length: layers}).map((_, L) => {
        const lScale = 1 - L * 0.28;
        const lOp = 1 - L * 0.3;
        return (
          <g key={L} opacity={lOp}>
            {Array.from({length: count}).map((_, i) => {
              const idx = L * 100 + i;
              const pos = orbPos(idx, t, variant, L);
              const size = (variant === 1 ? 5 : 8) * (0.5 + rand(idx) * 1.1) * lScale;
              const col = idx % 5 === 0 ? '#fff' : idx % 3 === 0 ? C.amber : C.orange;
              return (
                <g key={i}>
                  {trailN > 0 &&
                    Array.from({length: trailN}).map((_, k) => {
                      const tp = orbPos(idx, t - (k + 1) * 0.055, variant, L);
                      return (
                        <circle
                          key={k}
                          cx={cx + tp.x * lScale}
                          cy={cy + tp.y * lScale}
                          r={size * (1 - k / trailN) * 0.75}
                          fill={col}
                          opacity={(1 - k / trailN) * 0.16}
                        />
                      );
                    })}
                  <circle cx={cx + pos.x * lScale} cy={cy + pos.y * lScale} r={size} fill={col} opacity={0.95} />
                  <circle cx={cx + pos.x * lScale} cy={cy + pos.y * lScale} r={size * 2.6} fill={col} opacity={0.14} />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* connective sine ribbon */}
      {variant >= 2 && (
        <path
          d={Array.from({length: 90})
            .map((_, i) => {
              const x = (i / 89) * width;
              const y = cy + Math.sin(i * 0.22 + t * 1.2) * 60 + Math.sin(i * 0.07 - t * 0.7) * 90;
              return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ')}
          fill="none"
          stroke={C.orange}
          strokeWidth={1.6}
          opacity={0.35}
        />
      )}
    </svg>
  );
};

const CODE_V1 = `const orbs = Array.from({length: 14});
function draw(t) {
  orbs.forEach((o, i) => {
    const a = t * 1.6 * o.speed;
    circle(cos(a) * o.r, sin(a) * o.r);
  });
}`;
const CODE_V2 = `// медленнее, мягче
const orbs = Array.from({length: 22});
function draw(t) {
  orbs.forEach((o, i) => {
    const a = t * 0.55 * o.speed;
    trail(o, 10, 0.16);   // мягкий след
    glow(o, 0.14);
  });
}`;
const CODE_V3 = `// + глубина: 3 параллакс-слоя
for (let L = 0; L < 3; L++) {
  const s = 1 - L * 0.28;
  layer(L).opacity(1 - L * 0.3);
  orbs.forEach((o) => {
    trail(o, 16, 0.16 * s);
    glow(o, 0.14 * s);
  });
}`;

export const JsAnimScene: React.FC<{
  mode?: 'editor' | 'beauty';
  variant?: number; // for beauty mode
  startFrame?: number;
  frame?: number; // absolute frame override
  width?: number;
  height?: number;
}> = ({mode = 'editor', variant: fixedVariant, startFrame = 0, frame: frameProp, width = 1920, height = 1080}) => {
  const cf = useCurrentFrame();
  const local = frameProp ?? cf;
  const f = local + startFrame;

  // editor timeline: v1 [0..170], prompt2 [170..210], v2 [210..430], prompt3 [430..470], v3 [470+]
  const variant = fixedVariant ?? (f < 200 ? 1 : f < 460 ? 2 : 3);
  const code = variant === 1 ? CODE_V1 : variant === 2 ? CODE_V2 : CODE_V3;
  const codeStart = variant === 1 ? 0 : variant === 2 ? 210 : 470;

  if (mode === 'beauty') {
    return (
      <div style={{width, height, overflow: 'hidden'}}>
        <GenerativeArt frame={f} variant={variant} width={width} height={height} />
      </div>
    );
  }

  const prompts: {at: number; text: string}[] = [
    {at: 6, text: 'Сделай живую анимацию: орбиты, свет, движение'},
    {at: 172, text: 'медленнее, мягче'},
    {at: 432, text: 'добавь глубины'},
  ];

  return (
    <div style={{width, height, display: 'flex', gap: 26, padding: 26, background: '#0a0a0e', boxSizing: 'border-box'}}>
      {/* code panel */}
      <div
        style={{
          flex: '0 0 46%',
          background: C.panel,
          border: `1px solid ${C.line}`,
          borderRadius: 18,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 20px',
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((cc) => (
            <span key={cc} style={{width: 14, height: 14, borderRadius: '50%', background: cc, display: 'inline-block'}} />
          ))}
          <span style={{marginLeft: 14, fontFamily: F.mono, fontSize: 20, color: C.dim}}>scene.js</span>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: F.mono,
              fontSize: 18,
              color: C.orange,
              border: `1px solid ${C.orange}55`,
              borderRadius: 6,
              padding: '2px 10px',
            }}
          >
            v{variant}
          </span>
        </div>
        <pre
          style={{
            margin: 0,
            padding: 24,
            fontFamily: F.mono,
            fontSize: 23,
            lineHeight: 1.55,
            color: '#d8d4c8',
            whiteSpace: 'pre-wrap',
            flex: 1,
          }}
        >
          {code.split('\n').map((ln, i) => {
            const shown = Math.floor(Math.max(0, f - codeStart) * 1.6) > i * 2;
            return (
              <div key={`${variant}-${i}`} style={{opacity: shown ? 1 : 0.12, minHeight: 30}}>
                <span style={{color: C.dim, marginRight: 16, userSelect: 'none'}}>{String(i + 1).padStart(2, ' ')}</span>
                <span
                  style={{
                    color: ln.trim().startsWith('//') ? C.dim : ln.includes('const') || ln.includes('function') || ln.includes('for') ? C.orange : '#d8d4c8',
                  }}
                >
                  {ln}
                </span>
              </div>
            );
          })}
        </pre>
        {/* prompt bubbles */}
        <div style={{padding: 18, display: 'flex', flexDirection: 'column', gap: 10}}>
          {prompts.map((p, i) => {
            const t = ease.out(seg(f, p.at, p.at + 16));
            if (t <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  alignSelf: 'flex-end',
                  maxWidth: '88%',
                  background: i === 0 ? C.panel2 : `${C.orange}22`,
                  border: `1px solid ${i === 0 ? C.line : C.orange}`,
                  borderRadius: 14,
                  padding: '10px 18px',
                  fontFamily: F.body,
                  fontSize: 21,
                  color: C.white,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 14}px)`,
                }}
              >
                {p.text}
              </div>
            );
          })}
        </div>
      </div>
      {/* live preview */}
      <div
        style={{
          flex: 1,
          borderRadius: 18,
          overflow: 'hidden',
          border: `1px solid ${C.line}`,
          position: 'relative',
        }}
      >
        <GenerativeArt frame={f} variant={variant} width={980} height={1028} />
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 18,
            fontFamily: F.mono,
            fontSize: 19,
            color: C.green,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{width: 9, height: 9, borderRadius: '50%', background: C.green, display: 'inline-block'}} />
          LIVE PREVIEW · 60 FPS
        </div>
      </div>
    </div>
  );
};
