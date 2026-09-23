import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, CountUp, Chip, Cursor, Stamp} from '../components/primitives';

const ReportDoc: React.FC<{frame: number; start: number; ok: boolean; delay: number; x: number}> = ({
  frame,
  start,
  ok,
  delay,
  x,
}) => {
  const t = ease.back(seg(frame, start + delay, start + delay + 16));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: 120,
        height: 156,
        background: C.panel,
        border: `2px solid ${ok ? C.green : C.red}`,
        borderRadius: 10,
        transform: `scale(${t}) rotate(${(delay % 5) - 2}deg)`,
        opacity: clamp(t * 1.5),
        padding: 12,
        boxSizing: 'border-box',
      }}
    >
      {[0.9, 0.7, 0.8, 0.6, 0.75].map((w, i) => (
        <div key={i} style={{width: `${w * 100}%`, height: 7, background: C.line, borderRadius: 3, marginBottom: 9}} />
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: ok ? C.green : C.red,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 19,
          color: '#000',
          fontWeight: 900,
          fontFamily: F.mono,
        }}
      >
        {ok ? '✓' : '✗'}
      </div>
    </div>
  );
};

export const S07Office: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 570, 610);
  const phase3 = seg(frame, 1610, 1650);
  const phase4 = seg(frame, 2200, 2245);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Офисная работа"
      chapterIndex={5}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 8, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 570, src: 'audio/whoosh.mp3', volume: 0.55},
        {frame: 1345, src: 'audio/impact.mp3', volume: 0.6},
        {frame: 2200, src: 'audio/whoosh.mp3', volume: 0.55},
      ]}
    >
      {/* PHASE 1: dry facts */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - ease.in(seg(frame, 560, 600)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={4}>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 5}}>СУХИЕ ФАКТЫ</div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 56, marginTop: 40}}>
          <FadeSlide frame={frame} start={60}>
            <Panel glow style={{padding: '40px 52px', textAlign: 'center', width: 560}}>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.gray}}>GDPval-AA · 44 ПРОФЕССИИ</div>
              <div style={{fontFamily: F.display, fontSize: 150, color: C.orange, lineHeight: 1.1}}>
                <CountUp frame={frame} start={70} dur={40} to={1846} />
              </div>
              <div style={{fontFamily: F.body, fontSize: 26, color: C.white, fontWeight: 600}}>Elo — реальные профзадачи</div>
            </Panel>
          </FadeSlide>
          <FadeSlide frame={frame} start={340}>
            <Panel style={{padding: '40px 52px', textAlign: 'center', width: 560}}>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.gray}}>INTELLIGENCE INDEX · MAX EFFORT</div>
              <div style={{fontFamily: F.display, fontSize: 150, color: C.white, lineHeight: 1.1}}>
                <CountUp frame={frame} start={350} dur={40} to={58} />
              </div>
              <div style={{fontFamily: F.body, fontSize: 26, color: C.white, fontWeight: 600}}>
                <span style={{color: C.orange}}>№1</span> у Artificial Analysis
              </div>
            </Panel>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={480}>
          <div style={{marginTop: 44, fontFamily: F.body, fontSize: 32, color: C.gray, fontWeight: 600}}>
            Но зацепило <span style={{color: C.white}}>другое</span> ↓
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 2: report test + poll */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 1600, 1640))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={580} style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.display, fontSize: 58, color: C.white, lineHeight: 1.25}}>
            ТЕСТ: ОТЧЁТ ПО КВАРТАЛУ
          </div>
          <div style={{fontFamily: F.body, fontSize: 29, color: C.gray, marginTop: 12, fontWeight: 500}}>
            исходный пресс-релиз <span style={{color: C.orange, fontWeight: 700}}>специально спрятан</span> · правило: одна выдуманная цифра = провал
          </div>
        </FadeSlide>

        {/* poll */}
        <FadeSlide frame={frame} start={1150} style={{marginTop: 44}}>
          <Panel style={{padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{fontFamily: F.body, fontSize: 28, color: C.white, fontWeight: 700}}>Сколько отчётов пройдут проверку?</div>
            {['18/18', '16/18', '9/18', '3/18'].map((o, i) => {
              const picked = o === '16/18' && frame > 1290;
              return (
                <div
                  key={o}
                  style={{
                    fontFamily: F.mono,
                    fontSize: 26,
                    padding: '10px 24px',
                    borderRadius: 12,
                    border: `2px solid ${picked ? C.green : C.line}`,
                    color: picked ? C.green : C.gray,
                    background: picked ? `${C.green}18` : C.panel2,
                    transform: `scale(${picked ? 1.12 : 1})`,
                  }}
                >
                  {o}
                </div>
              );
            })}
          </Panel>
        </FadeSlide>
        {frame > 1180 && frame < 1345 && (
          <Cursor
            frame={frame}
            points={[
              {f: 1180, x: 300, y: 900},
              {f: 1240, x: 1010, y: 745},
              {f: 1300, x: 1010, y: 745},
            ]}
            clickAt={[1292]}
          />
        )}

        {/* reveal */}
        <div style={{marginTop: 50, height: 190, position: 'relative', width: 1400, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {frame >= 1345 && (
            <>
              <Stamp frame={frame} start={1348} color={C.green} style={{fontSize: 80, padding: '18px 44px'}}>
                16 из 18
              </Stamp>
              <div style={{position: 'absolute', left: 60, top: 10, width: 700, height: 170, opacity: ease.out(seg(frame, 1400, 1430))}}>
                {Array.from({length: 9}).map((_, i) => (
                  <ReportDoc key={i} frame={frame} start={1400} ok={i < 8} delay={i * 4} x={i * 72} />
                ))}
              </div>
            </>
          )}
        </div>
        <FadeSlide frame={frame} start={1480}>
          <div style={{fontFamily: F.mono, fontSize: 21, color: C.dim}}>засчитаны только отчёты выше порога качества · данные Anthropic</div>
        </FadeSlide>
      </div>

      {/* PHASE 3: workflow change */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3 * (1 - ease.in(seg(frame, 2190, 2230))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={1620}>
          <div style={{fontFamily: F.display, fontSize: 52, color: C.white}}>
            ФАКТЫ ПРОВЕРЯТЬ <span style={{color: C.red}}>НУЖНО</span>. НО РАБОТА МЕНЯЕТСЯ
          </div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 22, alignItems: 'center', marginTop: 56}}>
          {['материалы → модели', 'отчёт со ссылкой на каждую цифру', 'вы проходите по источникам'].map((t, i) => (
            <React.Fragment key={t}>
              <div style={{transform: `scale(${ease.back(seg(frame, 1700 + i * 16, 1700 + i * 16 + 20))})`}}>
                <Panel glow={i === 2} style={{padding: '26px 34px'}}>
                  <div style={{fontFamily: F.body, fontSize: 27, color: C.white, fontWeight: 600, textAlign: 'center'}}>{t}</div>
                </Panel>
              </div>
              {i < 2 && <span style={{color: C.orange, fontSize: 40}}>→</span>}
            </React.Fragment>
          ))}
        </div>
        <FadeSlide frame={frame} start={1980}>
          <div style={{display: 'flex', gap: 60, marginTop: 70, alignItems: 'center'}}>
            <div style={{textAlign: 'center', opacity: 0.5}}>
              <div style={{fontFamily: F.display, fontSize: 90, color: C.gray, textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 6}}>ДЕНЬ</div>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.dim}}>раньше</div>
            </div>
            <span style={{fontFamily: F.display, fontSize: 60, color: C.orange}}>→</span>
            <div style={{textAlign: 'center'}}>
              <div style={{fontFamily: F.display, fontSize: 110, color: C.orange, textShadow: `0 0 50px ${C.orange}44`}}>ЧАС</div>
              <div style={{fontFamily: F.mono, fontSize: 22, color: C.gray}}>теперь — на проверку</div>
            </div>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 4: hook to pricing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.body, fontSize: 38, color: C.gray, fontWeight: 600}}>Помните загадку из начала?</div>
          <div style={{fontFamily: F.display, fontSize: 110, color: C.white, marginTop: 16}}>
            <span style={{color: C.white}}>20%</span> <span style={{color: C.dim}}>ПРОТИВ</span> <span style={{color: C.orange}}>40%</span>
          </div>
          <FadeSlide frame={frame} start={2290}>
            <div style={{fontFamily: F.display, fontSize: 52, color: C.orange, marginTop: 26}}>СЕЙЧАС СЛОЖИТСЯ →</div>
          </FadeSlide>
        </div>
      </div>
    </Stage>
  );
};
