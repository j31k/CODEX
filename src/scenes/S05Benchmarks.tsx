import React from 'react';
import {useCurrentFrame, Img, staticFile} from 'remotion';
import {C, F, ease, seg, clamp, lerp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, Bar, CountUp, Stamp, Typewriter} from '../components/primitives';

const TestCard: React.FC<{
  frame: number;
  start: number;
  name: string;
  value: number;
  desc: string;
  width?: number;
}> = ({frame, start, name, value, desc, width = 560}) => {
  const t = ease.back(seg(frame, start, start + 22));
  return (
    <div style={{transform: `scale(${t})`, opacity: clamp(t * 1.5)}}>
      <Panel glow style={{width, padding: '34px 40px'}}>
        <div style={{fontFamily: F.mono, fontSize: 22, color: C.gray, letterSpacing: 2}}>{name}</div>
        <div style={{fontFamily: F.display, fontSize: 110, color: C.orange, lineHeight: 1.05}}>
          <CountUp frame={frame} start={start + 8} dur={30} to={value} decimals={1} suffix="%" />
        </div>
        <div style={{fontFamily: F.body, fontSize: 24, color: C.gray, marginTop: 10, lineHeight: 1.4, fontWeight: 500}}>{desc}</div>
      </Panel>
    </div>
  );
};

const TerminalMock: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const lines = [
    '$ claude "почини flaky-тесты в ci"',
    '⠿ читаю репозиторий… 214 файлов',
    '⠿ pytest tests/ --reruns 3',
    '✓ нашёл гонку в checkout.spec.ts',
    '✓ патч применён · 14/14 зелёных',
  ];
  return (
    <Panel style={{width: 640, padding: 0, overflow: 'hidden'}}>
      <div style={{display: 'flex', gap: 8, padding: '14px 20px', borderBottom: `1px solid ${C.line}`}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((cc) => (
          <span key={cc} style={{width: 13, height: 13, borderRadius: '50%', background: cc, display: 'inline-block'}} />
        ))}
        <span style={{marginLeft: 12, fontFamily: F.mono, fontSize: 18, color: C.dim}}>terminal — agent</span>
      </div>
      <div style={{padding: '20px 26px', fontFamily: F.mono, fontSize: 22, lineHeight: 1.7, minHeight: 220}}>
        {lines.map((l, i) => {
          const show = frame > start + i * 26;
          if (!show) return <div key={i} style={{minHeight: 36}} />;
          const isCmd = l.startsWith('$');
          return (
            <div key={i} style={{color: l.startsWith('✓') ? C.green : isCmd ? C.white : C.gray}}>
              {isCmd ? (
                <Typewriter frame={frame} start={start + i * 26} text={l} cps={40} />
              ) : (
                l
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export const S05Benchmarks: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const cold = seg(frame, 1330, 1380); // cold shower tint
  const phase3 = seg(frame, 780, 820); // frontier + cursor cards
  const phase4 = seg(frame, 1900, 1950); // resolution
  const phase5 = seg(frame, 2520, 2570); // hook

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Тесты"
      chapterIndex={3}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 20, src: 'audio/impact.mp3', volume: 0.5},
        {frame: 780, src: 'audio/whoosh.mp3', volume: 0.5},
        {frame: 1330, src: 'audio/whoosh.mp3', volume: 0.8},
        {frame: 1900, src: 'audio/impact.mp3', volume: 0.5},
      ]}
    >
      {/* cold tint overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(60,120,180,0.14), rgba(20,40,70,0.22))',
          opacity: cold * (1 - ease.in(seg(frame, 1890, 1940))),
          zIndex: 30,
          pointerEvents: 'none',
        }}
      />

      {/* PHASE 1: Terminal-Bench hero */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 90,
          opacity: 1 - ease.in(seg(frame, 770, 810)),
          pointerEvents: 'none',
        }}
      >
        <div style={{textAlign: 'center'}}>
          <FadeSlide frame={frame} start={4}>
            <div style={{fontFamily: F.mono, fontSize: 26, color: C.gray, letterSpacing: 4}}>TERMINAL-BENCH 4.0</div>
            <div
              style={{
                fontFamily: F.display,
                fontSize: 240,
                color: C.orange,
                lineHeight: 1,
                textShadow: `0 0 80px ${C.orange}44`,
              }}
            >
              <CountUp frame={frame} start={10} dur={40} to={66.4} decimals={1} suffix="%" />
            </div>
            <div style={{fontFamily: F.body, fontSize: 30, color: C.white, fontWeight: 600, maxWidth: 560, marginTop: 10}}>
              агент сам выполняет многошаговые задачи в терминале, без подсказок
            </div>
          </FadeSlide>
          <FadeSlide frame={frame} start={340} style={{marginTop: 44}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
              <Bar frame={frame} start={350} value={66.4 / 70} color={C.orange} label="Opus 5.5" right="66,4%" width={620} />
              <Bar frame={frame} start={400} value={57.9 / 70} color="#e8e4da" label="GPT-6 Astra" right="57,9%" width={620} dimmed />
              <Bar frame={frame} start={450} value={52.3 / 70} color="#8a8a96" label="Opus 5" right="52,3%" width={620} dimmed />
            </div>
          </FadeSlide>
          <FadeSlide frame={frame} start={610}>
            <div style={{marginTop: 36, fontFamily: F.display, fontSize: 52, color: C.white}}>
              +14 ПУНКТОВ ЗА ПОКОЛЕНИЕ. <span style={{color: C.orange}}>НОКАУТ?</span>
            </div>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={130} dy={60}>
          <TerminalMock frame={frame} start={150} />
        </FadeSlide>
      </div>

      {/* PHASE 2: FrontierCode + CursorBench */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3 * (1 - ease.in(seg(frame, 1320, 1360))),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60,
          pointerEvents: 'none',
        }}
      >
        <TestCard frame={frame} start={790} name="FRONTIERCODE v1.1" value={54.4} desc="проверяют не «работает ли код», а примут ли такие изменения в реальный проект" />
        <TestCard frame={frame} start={1050} name="CURSORBENCH 4.0" value={57.8} desc="много файлов, неполные инструкции — обычный рабочий день программиста" />
      </div>

      {/* PHASE 3: cold shower */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: cold * (1 - ease.in(seg(frame, 1890, 1940))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 35,
        }}
      >
        <FadeSlide frame={frame} start={1340}>
          <div style={{fontFamily: F.display, fontSize: 84, color: C.ice, letterSpacing: 4, textShadow: '0 0 40px rgba(154,209,255,0.4)'}}>
            ХОЛОДНЫЙ ДУШ
          </div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 60, marginTop: 50, alignItems: 'center'}}>
          <FadeSlide frame={frame} start={1420}>
            <Panel style={{padding: '30px 40px', width: 600}}>
              <div style={{fontFamily: F.body, fontSize: 26, color: C.gray, fontWeight: 600}}>модели тестировали с</div>
              <div style={{fontFamily: F.display, fontSize: 40, color: C.white, marginTop: 6}}>РАЗНЫМ УРОВНЕМ УСИЛИЯ</div>
              <div style={{display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap'}}>
                {['low', 'med', 'high', 'xhigh', 'max'].map((e, i) => (
                  <span
                    key={e}
                    style={{
                      fontFamily: F.mono,
                      fontSize: 20,
                      padding: '6px 16px',
                      borderRadius: 8,
                      border: `1.5px solid ${i >= 3 ? C.orange : C.line}`,
                      color: i >= 3 ? C.orange : C.gray,
                      background: i >= 3 ? `${C.orange}14` : 'transparent',
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <div style={{fontFamily: F.body, fontSize: 23, color: C.gray, marginTop: 18, lineHeight: 1.45}}>
                часть цифр конкурентов — из их собственных публикаций
              </div>
            </Panel>
          </FadeSlide>
          <FadeSlide frame={frame} start={1560}>
            <Panel glow style={{padding: '30px 40px', textAlign: 'center'}}>
              <div style={{fontFamily: F.mono, fontSize: 20, color: C.gray, letterSpacing: 2}}>ARTIFICIAL ANALYSIS · САМИ ПРОГНАЛИ</div>
              <div style={{marginTop: 10}}>
                <span style={{fontFamily: F.display, fontSize: 64, color: C.dim, textDecoration: 'line-through', textDecorationColor: C.red, textDecorationThickness: 6}}>
                  66,4%
                </span>
                <span style={{fontFamily: F.display, fontSize: 110, color: C.ice, marginLeft: 26}}>
                  <CountUp frame={frame} start={1580} dur={30} to={59.6} decimals={1} suffix="%" />
                </span>
              </div>
              <div style={{fontFamily: F.body, fontSize: 25, color: C.white, fontWeight: 600, marginTop: 8}}>
                ≈ столько же, сколько у GPT-6 Astra в их сравнении
              </div>
            </Panel>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={1700}>
          <div style={{marginTop: 44, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.line}`, width: 900, boxShadow: '0 30px 70px -20px #000'}}>
            <Img
              src={staticFile('assets/official/bf2c60bcfec144a197fd2a427764952e0c12de49-1920x1080.png')}
              style={{width: '100%', display: 'block'}}
            />
          </div>
          <div style={{textAlign: 'center', fontFamily: F.mono, fontSize: 17, color: C.dim, marginTop: 10}}>
            официальный график: точность vs цена попытки · anthropic.com
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 4: resolution */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase4 * (1 - ease.in(seg(frame, 2510, 2560))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{display: 'flex', gap: 70, alignItems: 'center'}}>
          <Stamp frame={frame} start={1910} color={C.red}>Нокаута нет</Stamp>
          <Stamp frame={frame} start={2010} color={C.green} style={{transform: 'rotate(3deg)'}}>Конкуренция — есть</Stamp>
        </div>
        <FadeSlide frame={frame} start={2120}>
          <div style={{marginTop: 70, maxWidth: 1300, textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 54, color: C.white, lineHeight: 1.3}}>
              ТЕПЕРЬ ВСЕРЬЁЗ КОНКУРИРУЕТ<br />В <span style={{color: C.orange}}>СЛОЖНОЙ РАЗРАБОТКЕ</span>
            </div>
            <div style={{display: 'flex', gap: 26, justifyContent: 'center', marginTop: 44}}>
              {['держит в голове большой проект', 'правит в нескольких местах сразу', 'проверяет результат'].map((t, i) => (
                <Panel key={t} style={{padding: '22px 30px', transform: `scale(${ease.back(seg(frame, 2200 + i * 14, 2200 + i * 14 + 18))})`}}>
                  <div style={{fontFamily: F.body, fontSize: 25, color: C.white, fontWeight: 600}}>{t}</div>
                </Panel>
              ))}
            </div>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 5: hook */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.body, fontSize: 40, color: C.gray, fontWeight: 600}}>Проценты — это абстракция.</div>
          <div style={{fontFamily: F.display, fontSize: 76, color: C.white, marginTop: 20, lineHeight: 1.2}}>
            ЕСТЬ ИСТОРИЯ, ПОСЛЕ КОТОРОЙ<br />АБСТРАКЦИЯ <span style={{color: C.orange}}>ЗАКАНЧИВАЕТСЯ</span>
          </div>
        </div>
      </div>
    </Stage>
  );
};
