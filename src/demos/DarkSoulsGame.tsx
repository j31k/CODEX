import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, seg, clamp, lerp, rand} from '../lib/design';

/*
 * Side-view souls-like combat scene, fully deterministic from frame.
 * Modes:
 *  - 'full'   : complete scripted fight (walk, roll, combo, backstab, kill)
 *  - 'broken' : collision bug — knight falls through the floor
 *  - 'flash'  : beauty slice for cold open (uses mid-fight frames)
 */

const WORLD_W = 2600;
const FLOOR_Y = 900;

type Pose = 'walk' | 'idle' | 'roll' | 'attack' | 'stagger' | 'dead';

const knightAt = (f: number, broken: boolean) => {
  // x position over time
  let x = 200;
  let pose: Pose = 'walk';
  let poseT = 0;
  let y = 0;
  let facing = 1;
  if (f < 90) {
    x = lerp(200, 700, f / 90);
    pose = 'walk';
    poseT = f / 90;
  } else if (f < 150) {
    x = 700;
    pose = 'idle';
    poseT = (f - 90) / 60;
  } else if (f < 190) {
    // roll away from enemy slash
    const t = seg(f, 150, 190);
    x = lerp(700, 830, ease.out(t));
    pose = 'roll';
    poseT = t;
  } else if (f < 240) {
    // two-hit combo, stepping in
    x = lerp(830, 960, seg(f, 190, 240));
    pose = 'attack';
    poseT = seg(f, 190, 240);
  } else if (f < 275) {
    x = lerp(960, 900, seg(f, 240, 275));
    pose = 'idle';
    poseT = seg(f, 240, 275);
  } else if (f < 310) {
    // roll through the charge, ends behind enemy
    const t = seg(f, 275, 310);
    x = lerp(900, 1180, ease.inOut(t));
    pose = 'roll';
    poseT = t;
  } else if (f < 345) {
    x = 1180;
    facing = -1;
    pose = 'attack'; // backstab
    poseT = seg(f, 310, 345);
  } else {
    x = 1180;
    facing = -1;
    pose = 'idle';
    poseT = seg(f, 345, 400);
  }
  if (broken && f > 55) {
    // collision bug: sink through the floor
    const t = seg(f, 55, 110);
    y = ease.in(t) * 700;
  }
  return {x, y, pose, poseT, facing};
};

const enemyAt = (f: number) => {
  const baseX = 1150;
  let x = baseX;
  let pose: Pose = 'idle';
  let poseT = 0;
  let hp = 1;
  if (f < 90) {
    pose = 'idle';
    poseT = f / 90;
  } else if (f < 150) {
    pose = 'idle';
    poseT = seg(f, 90, 150);
  } else if (f < 190) {
    pose = 'attack'; // slash at knight
    poseT = seg(f, 150, 190);
    x = lerp(baseX, baseX - 120, ease.out(seg(f, 160, 185)));
  } else if (f < 240) {
    pose = 'stagger'; // getting combo'd
    poseT = seg(f, 190, 240);
    x = baseX - 120;
    hp = lerp(1, 0.45, seg(f, 195, 230));
  } else if (f < 275) {
    pose = 'idle';
    poseT = seg(f, 240, 275);
    x = lerp(baseX - 120, baseX - 60, seg(f, 240, 275));
    hp = 0.45;
  } else if (f < 310) {
    pose = 'attack'; // charge through
    poseT = seg(f, 275, 310);
    x = lerp(baseX - 60, baseX - 350, ease.inOut(seg(f, 280, 305)));
    hp = 0.45;
  } else if (f < 345) {
    pose = 'stagger'; // backstabbed
    poseT = seg(f, 310, 345);
    x = baseX - 350;
    hp = lerp(0.45, 0, seg(f, 315, 340));
  } else {
    pose = 'dead';
    poseT = seg(f, 345, 420);
    x = baseX - 350;
    hp = 0;
  }
  return {x, pose, poseT, hp};
};

const Knight: React.FC<{
  x: number;
  y: number;
  pose: Pose;
  poseT: number;
  facing: number;
  frame: number;
}> = ({x, y, pose, poseT, facing, frame}) => {
  const walk = pose === 'walk' ? Math.sin(frame * 0.35) : 0;
  const rollA = pose === 'roll' ? poseT * 360 : 0;
  const atkA =
    pose === 'attack'
      ? poseT < 0.5
        ? lerp(-120, 40, ease.out(seg(poseT, 0, 0.5)))
        : lerp(-100, 50, ease.out(seg(poseT, 0.5, 1)))
      : -20;
  const squash = pose === 'roll' ? 0.72 : 1;
  return (
    <g transform={`translate(${x}, ${FLOOR_Y + y}) scale(${facing}, 1)`}>
      <g transform={`rotate(${pose === 'roll' ? rollA : 0}) scale(1, ${squash})`}>
        {/* cape */}
        <path
          d={`M -14 -96 Q ${-44 - Math.sin(frame * 0.12) * 8} ${-70} ${-36 - Math.sin(frame * 0.09) * 10} -8 L -12 -30 Z`}
          fill="#15151c"
          opacity={0.95}
        />
        {/* legs */}
        <g transform={`rotate(${walk * 24} 0 -52)`}>
          <rect x={-9} y={-56} width={13} height={56} rx={6} fill="#1d1d26" />
        </g>
        <g transform={`rotate(${-walk * 24} 0 -52)`}>
          <rect x={2} y={-56} width={13} height={56} rx={6} fill="#232330" />
        </g>
        {/* torso armor */}
        <path d="M -16 -108 L 16 -108 L 20 -52 L -20 -52 Z" fill="#20202b" />
        <path d="M -16 -108 L 16 -108 L 18 -86 L -18 -86 Z" fill="#2a2a38" />
        <line x1={-18} y1={-64} x2={18} y2={-64} stroke={C.orange} strokeWidth={2} opacity={0.5} />
        {/* shoulder */}
        <circle cx={14} cy={-100} r={12} fill="#2a2a38" />
        {/* head: helm + plume + visor glow */}
        <g transform="translate(0, -122)">
          <path d="M -12 6 L -12 -8 Q 0 -20 12 -8 L 12 6 Z" fill="#262633" />
          <rect x={2} y={-6} width={11} height={3.4} rx={1.6} fill={C.orange} opacity={0.95} />
          <path
            d={`M 0 -16 Q ${-16 - Math.sin(frame * 0.15) * 4} -30 ${-26} -22`}
            stroke={C.orange}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.85}
          />
        </g>
        {/* sword arm */}
        <g transform={`translate(14, -96) rotate(${atkA})`}>
          <rect x={-4} y={-6} width={12} height={30} rx={5} fill="#232330" />
          <g transform="translate(4, -4)">
            <rect x={-3} y={-118} width={9} height={118} rx={3} fill="#3c3c4c" />
            <rect x={-3} y={-118} width={3.4} height={118} fill="#55556a" opacity={0.8} />
            <rect x={-14} y={-6} width={30} height={8} rx={3} fill="#1a1a22" />
            <rect x={-3} y={-2} width={9} height={16} rx={3} fill="#14141a" />
          </g>
        </g>
      </g>
    </g>
  );
};

const Enemy: React.FC<{
  x: number;
  pose: Pose;
  poseT: number;
  frame: number;
}> = ({x, pose, poseT, frame}) => {
  const breathe = Math.sin(frame * 0.06) * 3;
  const atk = pose === 'attack' ? Math.sin(poseT * Math.PI) : 0;
  const stag = pose === 'stagger' ? Math.sin(frame * 0.9) * 6 * (1 - poseT * 0.5) : 0;
  const deadT = pose === 'dead' ? poseT : 0;
  const sink = deadT > 0 ? ease.in(deadT) * 40 : 0;
  const fade = deadT > 0 ? 1 - ease.inOut(seg(deadT, 0.15, 1)) : 1;
  return (
    <g
      transform={`translate(${x + stag}, ${FLOOR_Y + sink}) scale(-1.45, 1.45)`}
      opacity={fade}
    >
      <g transform={`translate(0, ${breathe}) rotate(${atk * 14})`}>
        {/* legs */}
        <rect x={-16} y={-58} width={15} height={58} rx={6} fill="#191920" />
        <rect x={3} y={-58} width={15} height={58} rx={6} fill="#1f1f28" />
        {/* torso */}
        <path d="M -24 -118 L 24 -118 L 30 -52 L -30 -52 Z" fill="#1e1e27" />
        <path d="M -24 -118 L 24 -118 L 26 -92 L -26 -92 Z" fill="#262633" />
        {/* horned helm */}
        <g transform="translate(0, -134)">
          <path d="M -14 8 L -14 -10 Q 0 -24 14 -10 L 14 8 Z" fill="#232330" />
          <path d="M -12 -12 Q -30 -26 -34 -44" stroke="#2e2e3c" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 12 -12 Q 30 -26 34 -44" stroke="#2e2e3c" strokeWidth={7} fill="none" strokeLinecap="round" />
          <circle cx={-5} cy={-2} r={2.6} fill={C.red} opacity={0.6 + 0.4 * Math.sin(frame * 0.25)} />
          <circle cx={5} cy={-2} r={2.6} fill={C.red} opacity={0.9} />
        </g>
        {/* big cleaver */}
        <g transform={`translate(-20, -104) rotate(${pose === 'attack' ? lerp(150, -30, ease.out(poseT)) : 130})`}>
          <rect x={-5} y={-8} width={14} height={34} rx={6} fill="#1f1f28" />
          <path d="M -2 -10 L 14 -96 L 30 -88 L 10 -2 Z" fill="#343444" />
        </g>
      </g>
    </g>
  );
};

const Sparks: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g>
      {Array.from({length: 12}).map((_, i) => {
        const a = rand(i * 7 + 3) * Math.PI * 2;
        const sp = 60 + rand(i * 13) * 160;
        const dx = Math.cos(a) * sp * t;
        const dy = Math.sin(a) * sp * t - 40 * t;
        return (
          <line
            key={i}
            x1={x + dx * 0.6}
            y1={y + dy * 0.6}
            x2={x + dx}
            y2={y + dy}
            stroke={i % 3 === 0 ? '#fff' : C.orange}
            strokeWidth={3.5}
            strokeLinecap="round"
            opacity={1 - t}
          />
        );
      })}
      <circle cx={x} cy={y} r={lerp(10, 46, t)} fill="none" stroke={C.amber} strokeWidth={3} opacity={(1 - t) * 0.8} />
    </g>
  );
};

const Dust: React.FC<{x: number; t: number}> = ({x, t}) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g>
      {Array.from({length: 8}).map((_, i) => {
        const dir = i % 2 ? 1 : -1;
        const dx = dir * (14 + rand(i * 5) * 46) * t;
        const r = lerp(6, 22, t) * (0.6 + rand(i) * 0.7);
        return (
          <circle key={i} cx={x + dx} cy={FLOOR_Y - 8 - t * 26 * rand(i + 9)} r={r} fill="#3a3a44" opacity={(1 - t) * 0.55} />
        );
      })}
    </g>
  );
};

const Souls: React.FC<{x: number; t: number; frame: number}> = ({x, t, frame}) => {
  if (t <= 0) return null;
  return (
    <g>
      {Array.from({length: 34}).map((_, i) => {
        const wob = Math.sin(frame * 0.08 + i) * 18;
        const px = x + (rand(i * 3) - 0.5) * 130 + wob * t;
        const py = FLOOR_Y - 30 - ease.out(t) * (140 + rand(i * 7) * 260);
        const r = 3 + rand(i * 11) * 6;
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={r}
            fill={i % 4 === 0 ? C.amber : C.orange}
            opacity={(1 - t * 0.55) * (0.5 + rand(i) * 0.5)}
            style={{filter: 'blur(0.6px)'}}
          />
        );
      })}
    </g>
  );
};

export const DarkSoulsGame: React.FC<{
  mode?: 'full' | 'broken' | 'flash';
  startFrame?: number; // offset into the timeline
  frame?: number; // absolute frame override (wins over useCurrentFrame)
  showHud?: boolean;
  width?: number;
  height?: number;
}> = ({mode = 'full', startFrame = 0, frame: frameProp, showHud = true, width = 1920, height = 1080}) => {
  const cf = useCurrentFrame();
  const local = frameProp ?? cf;
  const f = local + startFrame;
  const broken = mode === 'broken';

  const k = knightAt(f, broken);
  const e = enemyAt(f);
  const camX = clamp(k.x - 760, 0, WORLD_W - 1920);

  const knightHp = f < 150 ? 1 : f < 190 ? lerp(1, 0.62, seg(f, 165, 172)) : 0.62;
  const stamina =
    f < 150 ? 1 : f < 190 ? lerp(1, 0.35, seg(f, 150, 185)) : f < 240 ? lerp(0.35, 0.1, seg(f, 190, 240)) : lerp(0.1, 1, seg(f, 240, 400));

  // spark events: [frame, x, y]
  const sparkEvents: [number, number, number][] = [
    [198, e.x - 60, FLOOR_Y - 110],
    [218, e.x - 60, FLOOR_Y - 120],
    [322, e.x + 40, FLOOR_Y - 110],
  ];

  const scale = Math.min(width / 1920, height / 1080);

  return (
    <div style={{width, height, overflow: 'hidden', position: 'relative', background: '#08080c'}}>
      <svg width={width} height={height} viewBox={`0 0 1920 1080`} style={{display: 'block'}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0d16" />
            <stop offset="55%" stopColor="#12101a" />
            <stop offset="100%" stopColor="#1c1318" />
          </linearGradient>
          <radialGradient id="moon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffdfc0" />
            <stop offset="35%" stopColor="#ffb25a" />
            <stop offset="100%" stopColor="#ffb25a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#262630" />
            <stop offset="8%" stopColor="#1b1b23" />
            <stop offset="100%" stopColor="#0d0d12" />
          </linearGradient>
          <radialGradient id="fogG" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#1a1a24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1a1a24" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fogD" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#101018" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#101018" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={1920} height={1080} fill="url(#sky)" />
        {/* moon */}
        <circle cx={1470} cy={190} r={120} fill="url(#moon)" opacity={0.9} />
        <circle cx={1470} cy={190} r={52} fill="#ffe9d2" opacity={0.95} />

        <g transform={`translate(${-camX * 0.25}, 0)`}>
          {/* far silhouettes */}
          {Array.from({length: 7}).map((_, i) => {
            const bx = i * 420 + 80;
            const bh = 260 + rand(i * 3) * 240;
            return (
              <g key={i} opacity={0.5}>
                <rect x={bx} y={FLOOR_Y - 160 - bh} width={90} height={bh + 160} fill="#0e0e15" />
                <path d={`M ${bx - 12} ${FLOOR_Y - 160 - bh} L ${bx + 45} ${FLOOR_Y - 205 - bh} L ${bx + 102} ${FLOOR_Y - 160 - bh} Z`} fill="#0e0e15" />
                <rect x={bx + 30} y={FLOOR_Y - 140 - bh} width={12} height={26} fill={C.orange} opacity={0.25} />
              </g>
            );
          })}
        </g>

        <g transform={`translate(${-camX * 0.6}, 0)`}>
          {/* mid arches / pillars */}
          {Array.from({length: 6}).map((_, i) => {
            const px = i * 520 + 240;
            return (
              <g key={i} opacity={0.85}>
                <rect x={px} y={FLOOR_Y - 420} width={54} height={420} fill="#12121a" />
                <rect x={px - 14} y={FLOOR_Y - 440} width={82} height={26} fill="#12121a" />
                <circle cx={px + 27} cy={FLOOR_Y - 300} r={7} fill={C.orange} opacity={0.35} />
              </g>
            );
          })}
        </g>

        {/* fog band */}
        <ellipse cx={960} cy={FLOOR_Y - 60} rx={1100} ry={110} fill="url(#fogG)" />

        <g transform={`translate(${-camX}, 0)`}>
          {/* floor */}
          <rect x={-100} y={FLOOR_Y} width={WORLD_W + 200} height={220} fill="url(#floor)" />
          <line x1={-100} y1={FLOOR_Y} x2={WORLD_W + 100} y2={FLOOR_Y} stroke="#34343f" strokeWidth={3} />
          {Array.from({length: 40}).map((_, i) => (
            <line
              key={i}
              x1={i * 70}
              y1={FLOOR_Y + 26 + rand(i) * 8}
              x2={i * 70 + 40}
              y2={FLOOR_Y + 26 + rand(i) * 8}
              stroke="#26262f"
              strokeWidth={2}
            />
          ))}
          {/* candles */}
          {Array.from({length: 8}).map((_, i) => {
            const cx = i * 340 + 160;
            const fl = 0.7 + Math.sin(f * 0.2 + i * 2) * 0.3;
            return (
              <g key={i}>
                <rect x={cx} y={FLOOR_Y - 26} width={8} height={26} fill="#d8cfc0" opacity={0.8} />
                <circle cx={cx + 4} cy={FLOOR_Y - 32} r={7 * fl} fill={C.amber} opacity={0.9} />
                <circle cx={cx + 4} cy={FLOOR_Y - 32} r={18 * fl} fill={C.orange} opacity={0.18} />
              </g>
            );
          })}

          <Dust x={k.x} t={k.pose === 'roll' ? k.poseT : 0} />
          <Enemy x={e.x} pose={e.pose} poseT={e.poseT} frame={f} />
          <Knight x={k.x} y={k.y} pose={k.pose} poseT={k.poseT} facing={k.facing} frame={f} />
          {sparkEvents.map(([sf, sx, sy], i) => (
            <Sparks key={i} x={sx} y={sy} t={seg(f, sf, sf + 16)} />
          ))}
          <Souls x={e.x} t={e.pose === 'dead' ? e.poseT : 0} frame={f} />
        </g>

        {/* near fog */}
        <ellipse cx={500} cy={FLOOR_Y + 40} rx={700} ry={90} fill="url(#fogD)" />
        <ellipse cx={1500} cy={FLOOR_Y + 60} rx={800} ry={100} fill="url(#fogD)" />

        {showHud && (
          <g>
            {/* player HP / stamina */}
            <g transform="translate(70, 60)">
              <rect x={-8} y={-8} width={392} height={66} rx={6} fill="#000" opacity={0.45} />
              <rect width={376} height={24} rx={3} fill="#1a0d0d" stroke="#000" strokeWidth={2} />
              <rect width={376 * clamp(knightHp)} height={24} rx={3} fill="#8e1f1f" />
              <rect width={376 * clamp(knightHp)} height={8} rx={3} fill="#c23a3a" opacity={0.8} />
              <rect y={34} width={300} height={16} rx={3} fill="#0d1a0d" stroke="#000" strokeWidth={2} />
              <rect y={34} width={300 * clamp(stamina)} height={16} rx={3} fill="#2f7a3a" />
            </g>
            {/* boss bar */}
            <g transform="translate(960, 990)" opacity={f > 80 ? 1 : seg(f, 60, 80)}>
              <rect x={-450} y={0} width={900} height={20} rx={4} fill="#14090a" stroke="#000" strokeWidth={2} />
              <rect x={-450} y={0} width={900 * clamp(e.hp)} height={20} rx={4} fill="#a8241f" />
              <rect x={-450} y={0} width={900 * clamp(e.hp)} height={7} rx={3} fill="#e0483e" opacity={0.85} />
              <text
                x={-450}
                y={-14}
                fill={C.white}
                fontSize={30}
                fontFamily="'Golos Text', sans-serif"
                fontWeight={600}
                letterSpacing={4}
              >
                РЫЦАРЬ ПЕПЛА
              </text>
            </g>
            {e.pose === 'dead' && (
              <text
                x={960}
                y={430}
                textAnchor="middle"
                fill={C.amber}
                fontSize={72}
                fontFamily="'Russo One', sans-serif"
                letterSpacing={10}
                opacity={ease.out(seg(e.poseT, 0, 0.25))}
                style={{textShadow: '0 0 40px #ff5a1f'}}
              >
                ВРАГ ПОВЕРЖЕН
              </text>
            )}
          </g>
        )}
      </svg>

      {broken && f > 60 && (
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
              color: '#ff5147',
              background: 'rgba(20,0,0,0.75)',
              border: '1px solid #ff5147',
              padding: '12px 26px',
              borderRadius: 10,
              fontSize: 28,
              opacity: ease.out(seg(f, 62, 74)),
            }}
          >
            ⚠ COLLISION_ERROR: player.clip == true
          </div>
        </div>
      )}
    </div>
  );
};
