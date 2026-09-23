import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp, lerp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, CountUp, Chip} from '../components/primitives';

const TimeBar: React.FC<{
  frame: number;
  start: number;
  label: string;
  hours: string;
  frac: number;
  color: string;
  note?: string;
}> = ({frame, start, label, hours, frac, color, note}) => {
  const t = ease.out(seg(frame, start, start + 30));
  return (
    <div style={{width: 1150}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10}}>
        <span style={{fontFamily: F.display, fontSize: 34, color: C.white, letterSpacing: 1}}>{label}</span>
        <span style={{fontFamily: F.display, fontSize: 44, color}}>{hours}</span>
      </div>
      <div style={{height: 62, background: C.panel2, borderRadius: 12, border: `1px solid ${C.line}`, overflow: 'hidden', position: 'relative'}}>
        <div
          style={{
            width: `${frac * t * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 30px ${color}55`,
            borderRadius: 12,
          }}
        />
        {note && (
          <span
            style={{
              position: 'absolute',
              right: 18,
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: F.mono,
              fontSize: 22,
              color: C.gray,
              opacity: t,
            }}
          >
            {note}
          </span>
        )}
      </div>
    </div>
  );
};

export const S06Coding: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 610, 650);
  const phase3 = seg(frame, 1400, 1445);
  const phase4 = seg(frame, 1760, 1800);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Код"
      chapterIndex={4}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 10, src: 'audio/impact.mp3', volume: 0.45},
        {frame: 610, src: 'audio/whoosh.mp3', volume: 0.6},
        {frame: 1400, src: 'audio/whoosh.mp3', volume: 0.5},
        {frame: 1760, src: 'audio/impact.mp3', volume: 0.5},
      ]}
    >
      {/* PHASE 1: 200k lines + time bars */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - ease.in(seg(frame, 600, 640)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={4} style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 4}}>ЗАДАЧА: АУДИТ И ИСПРАВЛЕНИЯ</div>
          <div style={{fontFamily: F.display, fontSize: 150, color: C.white, lineHeight: 1}}>
            <CountUp frame={frame} start={8} dur={35} to={200000} />
            <span style={{fontSize: 60, color: C.orange}}> СТРОК</span>
          </div>
        </FadeSlide>
        <FadeSlide frame={frame} start={120}>
          <div style={{display: 'flex', gap: 18, alignItems: 'center', marginTop: 26}}>
            {['код', 'аудит', 'исправления', 'проверка'].map((t, i) => (
              <React.Fragment key={t}>
                <Chip color={i === 3 ? C.orange : C.gray} style={{fontSize: 22, padding: '8px 20px'}}>{t}</Chip>
                {i < 3 && <span style={{color: C.dim, fontSize: 26}}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </FadeSlide>
        <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 60}}>
          <TimeBar frame={frame} start={260} label="OPUS 5" hours="> 20 ЧАСОВ" frac={1} color="#8a8a96" note="и в 2,5× больше токенов" />
          <TimeBar frame={frame} start={430} label="OPUS 5.5" hours="< 3 ЧАСОВ" frac={0.14} color={C.orange} note="ранний тестировщик · данные Anthropic" />
        </div>
      </div>

      {/* PHASE 2: HAProxy race */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 1390, 1430))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={620} style={{textAlign: 'center'}}>
          <Chip color={C.orange} style={{fontSize: 22}}>ВНУТРЕННИЙ ЭКСПЕРИМЕНТ ANTHROPIC</Chip>
          <div style={{fontFamily: F.display, fontSize: 84, color: C.white, marginTop: 22}}>
            HAProxy: <span style={{color: C.gray}}>C</span> → <span style={{color: C.orange}}>RUST</span>
          </div>
          <div style={{fontFamily: F.body, fontSize: 27, color: C.gray, marginTop: 10, fontWeight: 600}}>
            обе модели прошли почти все регрессионные тесты проекта
          </div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 60, marginTop: 60}}>
          <FadeSlide frame={frame} start={900}>
            <Panel glow style={{padding: '36px 48px', textAlign: 'center', width: 480}}>
              <div style={{fontFamily: F.display, fontSize: 40, color: C.orange}}>OPUS 5.5</div>
              <div style={{fontFamily: F.display, fontSize: 120, color: C.white, lineHeight: 1.1}}>
                <CountUp frame={frame} start={920} dur={30} to={9.5} decimals={1} />
                <span style={{fontSize: 44}}> ч</span>
              </div>
              <div style={{fontFamily: F.mono, fontSize: 24, color: C.green, marginTop: 8}}>−51% БЮДЖЕТА</div>
            </Panel>
          </FadeSlide>
          <FadeSlide frame={frame} start={1000}>
            <Panel style={{padding: '36px 48px', textAlign: 'center', width: 480, opacity: 0.75}}>
              <div style={{fontFamily: F.display, fontSize: 40, color: C.gray}}>FABLE 5.1</div>
              <div style={{fontFamily: F.display, fontSize: 120, color: C.gray, lineHeight: 1.1}}>
                12<span style={{fontSize: 44}}> ч</span>
              </div>
              <div style={{fontFamily: F.mono, fontSize: 24, color: C.dim, marginTop: 8}}>старшая модель</div>
            </Panel>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={1260}>
          <div style={{marginTop: 54, fontFamily: F.display, fontSize: 48, color: C.white}}>
            МЛАДШАЯ ОБОГНАЛА СТАРШУЮ <span style={{color: C.orange}}>НА ЕЁ ЖЕ ПОЛЕ</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 3: honest disclaimer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3 * (1 - ease.in(seg(frame, 1750, 1790))),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={1410}>
          <Panel style={{padding: '44px 60px', maxWidth: 1300, textAlign: 'center', border: `1.5px solid ${C.amber}66`}}>
            <div style={{fontFamily: F.display, fontSize: 44, color: C.amber, letterSpacing: 2}}>БУДЕМ ЧЕСТНЫМИ</div>
            <div style={{fontFamily: F.body, fontSize: 31, color: C.white, marginTop: 18, lineHeight: 1.5, fontWeight: 500}}>
              Эти кейсы дали сама компания и её ранние тестировщики. Они показывают масштаб работы агента —{' '}
              <span style={{color: C.amber, fontWeight: 700}}>но не обещают</span>, что ваш проект он исправит за вечер.
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
        <div style={{fontFamily: F.display, fontSize: 74, color: C.white, textAlign: 'center', lineHeight: 1.2, transform: `scale(${ease.back(seg(frame, 1765, 1795))})`}}>
          «А ЕСЛИ Я ВООБЩЕ<br />
          <span style={{color: C.orange}}>НЕ ПРОГРАММИСТ?»</span>
        </div>
        <FadeSlide frame={frame} start={1870}>
          <div style={{marginTop: 44, fontFamily: F.body, fontSize: 40, color: C.gray, fontWeight: 600}}>
            Самый <span style={{color: C.white, borderBottom: `4px solid ${C.orange}`}}>практичный тест</span> всего релиза →
          </div>
        </FadeSlide>
      </div>
    </Stage>
  );
};
