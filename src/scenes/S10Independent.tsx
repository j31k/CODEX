import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, Stamp} from '../components/primitives';

const MetrChart: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const t = ease.out(seg(frame, start, start + 60));
  const pts = [
    [0, 150], [60, 138], [120, 130], [180, 118], [240, 110], [300, 96], [360, 88],
  ];
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <svg width={420} height={200} style={{display: 'block'}}>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={0} y1={i * 55 + 20} x2={420} y2={i * 55 + 20} stroke={C.line} strokeWidth={1} />
      ))}
      <path d={d} fill="none" stroke={C.ice} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={600} strokeDashoffset={600 * (1 - t)} />
      <circle cx={360} cy={88} r={8} fill={C.ice} opacity={t} />
      <text x={300} y={64} fill={C.ice} fontSize={22} fontFamily="'JetBrains Mono', monospace" opacity={t}>
        постепенно
      </text>
      <text x={0} y={190} fill={C.dim} fontSize={17} fontFamily="'JetBrains Mono', monospace">
        способность ускорять ИИ-исследования →
      </text>
    </svg>
  );
};

export const S10Independent: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 1160, 1205);
  const phase3 = seg(frame, 1650, 1695);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Независимые"
      chapterIndex={8}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 560, src: 'audio/whoosh.mp3', volume: 0.5},
        {frame: 1160, src: 'audio/impact.mp3', volume: 0.55},
        {frame: 1650, src: 'audio/riser.mp3', volume: 0.5},
      ]}
    >
      {/* PHASE 1: two columns */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - ease.in(seg(frame, 1150, 1195)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{display: 'flex', gap: 50}}>
          <FadeSlide frame={frame} start={10}>
            <Panel glow style={{width: 660, padding: '38px 44px', minHeight: 560}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{fontFamily: F.display, fontSize: 34, color: C.white}}>ARTIFICIAL ANALYSIS</div>
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: 30,
                    color: '#000',
                    background: C.orange,
                    borderRadius: 10,
                    padding: '6px 18px',
                  }}
                >
                  №1
                </div>
              </div>
              <div style={{fontFamily: F.body, fontSize: 28, color: C.white, marginTop: 24, lineHeight: 1.5, fontWeight: 500}}>
                Первое место в общем рейтинге. Сильные результаты в профессиональных задачах.
              </div>
              <div
                style={{
                  marginTop: 26,
                  padding: '18px 24px',
                  borderRadius: 12,
                  border: `1.5px solid ${C.amber}66`,
                  background: `${C.amber}0d`,
                }}
              >
                <div style={{fontFamily: F.body, fontSize: 25, color: C.amber, fontWeight: 600}}>
                  Но №1 в общем зачёте ≠ победа в каждом тесте
                </div>
                <div style={{fontFamily: F.mono, fontSize: 20, color: C.gray, marginTop: 8}}>
                  в отдельных испытаниях лидируют другие модели
                </div>
              </div>
            </Panel>
          </FadeSlide>
          <FadeSlide frame={frame} start={570}>
            <Panel style={{width: 660, padding: '38px 44px', minHeight: 560}}>
              <div style={{fontFamily: F.display, fontSize: 34, color: C.white}}>METR</div>
              <div style={{fontFamily: F.body, fontSize: 28, color: C.white, marginTop: 24, lineHeight: 1.5, fontWeight: 500}}>
                Может ли модель ускорить исследования <span style={{color: C.ice, fontWeight: 700}}>самого ИИ?</span>
              </div>
              <div style={{marginTop: 20}}>
                <MetrChart frame={frame} start={820} />
              </div>
              <div style={{fontFamily: F.body, fontSize: 25, color: C.gray, marginTop: 16, lineHeight: 1.45}}>
                Прогресс против Fable 5.1 есть, но <span style={{color: C.white, fontWeight: 700}}>постепенный</span>. Полной автоматизации исследований не нашли.
              </div>
            </Panel>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={1000}>
          <div style={{marginTop: 44, fontFamily: F.mono, fontSize: 20, color: C.dim}}>
            источники: Artificial Analysis · METR — внешние оценщики релиза
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 2: headline stamped */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 1640, 1685))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={1170}>
          <div style={{position: 'relative', textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 84, color: C.dim, textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 8}}>
              «ИИ ТЕПЕРЬ ВСЁ ДЕЛАЕТ САМ»
            </div>
            <div style={{position: 'absolute', right: -140, top: -40}}>
              <Stamp frame={frame} start={1250} color={C.red} style={{fontSize: 40}}>Пока неправда</Stamp>
            </div>
          </div>
        </FadeSlide>
        <FadeSlide frame={frame} start={1380}>
          <div style={{marginTop: 70, fontFamily: F.body, fontSize: 34, color: C.white, textAlign: 'center', lineHeight: 1.55, fontWeight: 500, maxWidth: 1250}}>
            Модель берёт всё более <span style={{color: C.orange, fontWeight: 800}}>длинные куски работы</span>.<br />
            Но направление, проверка и ответственность — <span style={{color: C.orange, fontWeight: 800}}>за человеком</span>.
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 3: hook to demos */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{fontFamily: F.body, fontSize: 40, color: C.gray, fontWeight: 600}}>Звучит скромно?</div>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 82,
            color: C.white,
            textAlign: 'center',
            marginTop: 26,
            lineHeight: 1.2,
            transform: `scale(${ease.back(seg(frame, 1660, 1695))})`,
          }}
        >
          ТОГДА ДАДИМ МОДЕЛИ<br />
          <span style={{color: C.orange, textShadow: `0 0 60px ${C.orange}55`}}>БЕЗУМНУЮ ЗАДАЧУ</span>
        </div>
        <FadeSlide frame={frame} start={1740}>
          <div style={{marginTop: 40, fontFamily: F.mono, fontSize: 26, color: C.orange, letterSpacing: 4}}>
            ▶ ТРИ ДЕМО ИЗ НАЧАЛА ВИДЕО
          </div>
        </FadeSlide>
      </div>
    </Stage>
  );
};
