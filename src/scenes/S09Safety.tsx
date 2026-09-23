import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, CountUp, Chip} from '../components/primitives';

const FlowNode: React.FC<{
  frame: number;
  start: number;
  title: string;
  sub?: string;
  color?: string;
  width?: number;
}> = ({frame, start, title, sub, color = C.white, width = 380}) => {
  const t = ease.back(seg(frame, start, start + 18));
  return (
    <div style={{transform: `scale(${t})`, opacity: clamp(t * 1.5)}}>
      <Panel glow={color === C.orange} style={{padding: '24px 30px', width, textAlign: 'center'}}>
        <div style={{fontFamily: F.display, fontSize: 32, color, letterSpacing: 1}}>{title}</div>
        {sub && <div style={{fontFamily: F.mono, fontSize: 19, color: C.gray, marginTop: 8}}>{sub}</div>}
      </Panel>
    </div>
  );
};

const Arrow: React.FC<{frame: number; start: number; label?: string; color?: string}> = ({frame, start, label, color = C.dim}) => {
  const t = ease.out(seg(frame, start, start + 14));
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: t, width: 120}}>
      {label && <div style={{fontFamily: F.mono, fontSize: 17, color, marginBottom: 6, textAlign: 'center'}}>{label}</div>}
      <div style={{width: 110 * t, height: 4, background: color, position: 'relative', borderRadius: 2}}>
        <div
          style={{
            position: 'absolute',
            right: -2,
            top: -6,
            borderLeft: `14px solid ${color}`,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
          }}
        />
      </div>
    </div>
  );
};

export const S09Safety: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 960, 1000);
  const phase3 = seg(frame, 1160, 1200);
  const phase4 = seg(frame, 1600, 1640);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Лимиты"
      chapterIndex={7}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 460, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 960, src: 'audio/impact.mp3', volume: 0.5},
        {frame: 1160, src: 'audio/whoosh.mp3', volume: 0.5},
        {frame: 1600, src: 'audio/whoosh.mp3', volume: 0.55},
      ]}
    >
      {/* PHASE 1: routing diagram */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - ease.in(seg(frame, 950, 990)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={4}>
          <div style={{fontFamily: F.display, fontSize: 56, color: C.white, textAlign: 'center'}}>
            ЗАЧЕМ ОГРАНИЧИВАТЬ <span style={{color: C.orange}}>СОБСТВЕННЫЙ ФЛАГМАН?</span>
          </div>
          <div style={{fontFamily: F.body, fontSize: 28, color: C.gray, textAlign: 'center', marginTop: 14, fontWeight: 500}}>
            по оценке Anthropic — уровень мощных моделей в <span style={{color: C.white}}>биологии</span> и <span style={{color: C.white}}>кибербезопасности</span>
          </div>
        </FadeSlide>
        <div style={{display: 'flex', alignItems: 'center', marginTop: 70}}>
          <FlowNode frame={frame} start={200} title="ЗАПРОС" sub="кибер-задача" width={300} />
          <Arrow frame={frame} start={300} />
          <FlowNode frame={frame} start={360} title="ФИЛЬТР" sub="классификатор риска" color={C.amber} width={320} />
          <Arrow frame={frame} start={460} label="перенаправлено" color={C.red} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
            <FlowNode frame={frame} start={520} title="OPUS 4.8" sub="большинство кибер-задач" color={C.red} width={380} />
            <FlowNode frame={frame} start={580} title="OPUS 5.5" sub="проверенные специалисты" color={C.orange} width={380} />
          </div>
        </div>
        <FadeSlide frame={frame} start={760}>
          <div style={{marginTop: 54, fontFamily: F.body, fontSize: 28, color: C.gray, fontWeight: 600}}>
            для проверенных специалистов — <span style={{color: C.white}}>отдельный доступ</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 2: locked */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 1150, 1190))),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 70,
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={970}>
          <svg width={220} height={220} viewBox="0 0 100 100">
            <rect x={18} y={44} width={64} height={48} rx={10} fill={C.panel2} stroke={C.orange} strokeWidth={3} />
            <path d="M 32 44 V 32 a 18 18 0 0 1 36 0 V 44" fill="none" stroke={C.orange} strokeWidth={6} />
            <circle cx={50} cy={64} r={7} fill={C.orange} />
            <rect x={47} y={64} width={6} height={16} rx={3} fill={C.orange} />
          </svg>
        </FadeSlide>
        <FadeSlide frame={frame} start={1010} style={{maxWidth: 900}}>
          <div style={{fontFamily: F.display, fontSize: 58, color: C.white, lineHeight: 1.25}}>
            МОДЕЛЬ СТАЛА НАСТОЛЬКО СИЛЬНОЙ,<br />
            ЧТО ЧАСТЬ ВОЗМОЖНОСТЕЙ <span style={{color: C.orange}}>ЗАКРЫЛИ</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 3: 85% stat */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3 * (1 - ease.in(seg(frame, 1590, 1630))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={1170} style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 4}}>ОБНАДЁЖИВАЮЩАЯ ЦИФРА</div>
          <div style={{fontFamily: F.display, fontSize: 200, color: C.green, lineHeight: 1.1, textShadow: `0 0 70px ${C.green}33`}}>
            −<CountUp frame={frame} start={1180} dur={40} to={85} suffix="%" />
          </div>
          <div style={{fontFamily: F.body, fontSize: 32, color: C.white, fontWeight: 600, maxWidth: 1000}}>
            реже пытался выйти за заданные границы, чем сравниваемые модели
          </div>
          <div style={{fontFamily: F.mono, fontSize: 20, color: C.dim, marginTop: 14}}>испытание Anthropic · behavioral audit</div>
        </FadeSlide>
        <FadeSlide frame={frame} start={1420}>
          <Panel style={{marginTop: 50, padding: '22px 40px', border: `1.5px solid ${C.amber}55`}}>
            <div style={{fontFamily: F.body, fontSize: 26, color: C.amber, fontWeight: 600, textAlign: 'center'}}>
              Но это одна проверка — не доказательство, что агент никогда не ошибётся
            </div>
          </Panel>
        </FadeSlide>
      </div>

      {/* PHASE 4: hook */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{fontFamily: F.body, fontSize: 36, color: C.gray, fontWeight: 600}}>До сих пор мы слушали в основном саму Anthropic.</div>
        <div style={{fontFamily: F.display, fontSize: 70, color: C.white, textAlign: 'center', marginTop: 24, lineHeight: 1.25}}>
          ЧТО СКАЖУТ ТЕ, КОМУ<br />
          КОМПАНИЯ <span style={{color: C.orange}}>НЕ ПЛАТИТ?</span>
        </div>
      </div>
    </Stage>
  );
};
