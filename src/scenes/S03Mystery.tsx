import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp, lerp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, CountUp} from '../components/primitives';

export const S03Mystery: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();

  const titleT = ease.back(seg(frame, 4, 26));
  const splitT = ease.inOut(seg(frame, 96, 130));
  const phase2 = seg(frame, 250, 285);
  const phase3 = seg(frame, 575, 610);
  const phase4 = seg(frame, 920, 955);

  const qMarkX = lerp(0, 0, splitT);
  const cardL = ease.back(seg(frame, 100, 132));
  const cardR = ease.back(seg(frame, 112, 144));

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Загадка 40 vs 20"
      chapterIndex={1}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 8, src: 'audio/impact.mp3', volume: 0.5},
        {frame: 250, src: 'audio/whoosh.mp3', volume: 0.6},
        {frame: 575, src: 'audio/whoosh.mp3', volume: 0.6},
        {frame: 920, src: 'audio/impact.mp3', volume: 0.6},
      ]}
    >
      {/* PHASE 1: title splits into two stats */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - ease.in(seg(frame, 240, 280)),
          pointerEvents: 'none',
        }}
      >
        <div style={{transform: `scale(${titleT})`, opacity: clamp(titleT * 1.5), textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontSize: 26, color: C.gray, letterSpacing: 6}}>CLAUDE OPUS 5.5</div>
          <div style={{fontFamily: F.display, fontSize: 132, color: C.white, lineHeight: 1.04, marginTop: 10}}>
            НОВЫЙ ЛИДЕР
            <br />
            <span style={{color: C.orange}}>AI?</span>
          </div>
        </div>

        <div style={{display: 'flex', gap: 60, marginTop: 70, height: 220}}>
          <div
            style={{
              transform: `translateX(${lerp(240, 0, cardL)}px) scale(${cardL})`,
              opacity: clamp(cardL * 1.5),
            }}
          >
            <Panel glow style={{padding: '34px 54px', textAlign: 'center'}}>
              <div style={{fontFamily: F.display, fontSize: 92, color: C.orange}}>−20%</div>
              <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, marginTop: 8, letterSpacing: 3}}>ЦЕНА ЗА ТОКЕН</div>
            </Panel>
          </div>
          <div
            style={{
              transform: `translateX(${lerp(-240, 0, cardR)}px) scale(${cardR})`,
              opacity: clamp(cardR * 1.5),
            }}
          >
            <Panel glow style={{padding: '34px 54px', textAlign: 'center'}}>
              <div style={{fontFamily: F.display, fontSize: 92, color: C.white}}>№1</div>
              <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, marginTop: 8, letterSpacing: 3}}>НЕЗАВИСИМЫЙ РЕЙТИНГ</div>
            </Panel>
          </div>
        </div>

        <FadeSlide frame={frame} start={170} style={{marginTop: 56, textAlign: 'center'}}>
          <div style={{fontFamily: F.body, fontSize: 40, color: C.gray, fontWeight: 600}}>
            умнее · быстрее · дешевле —{' '}
            <span style={{color: C.white, textDecoration: 'line-through', textDecorationColor: C.orange, textDecorationThickness: 5}}>
              скучно?
            </span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 2: 40 vs 20 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 565, 600))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 26, color: C.gray, letterSpacing: 5, marginBottom: 40}}>А ТЕПЕРЬ СТРАННОСТЬ</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 70}}>
          <FadeSlide frame={frame} start={262} style={{textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 170, color: C.orange, textShadow: `0 0 60px ${C.orange}55`}}>
              <CountUp frame={frame} start={262} dur={26} to={40} prefix="−" suffix="%" />
            </div>
            <div style={{fontFamily: F.body, fontSize: 30, color: C.white, fontWeight: 700, marginTop: 4}}>обещание: задачи дешевле</div>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.dim, marginTop: 6}}>оценка Anthropic</div>
          </FadeSlide>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 120,
              color: C.white,
              opacity: 0.5 + 0.5 * Math.sin(frame * 0.15),
            }}
          >
            ?
          </div>
          <FadeSlide frame={frame} start={300} style={{textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 170, color: C.white}}>
              <CountUp frame={frame} start={300} dur={26} to={20} prefix="−" suffix="%" />
            </div>
            <div style={{fontFamily: F.body, fontSize: 30, color: C.white, fontWeight: 700, marginTop: 4}}>цена токена упала</div>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.dim, marginTop: 6}}>прайс-лист API</div>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={430}>
          <div
            style={{
              marginTop: 60,
              fontFamily: F.display,
              fontSize: 62,
              color: C.white,
              borderBottom: `6px solid ${C.orange}`,
              paddingBottom: 8,
            }}
          >
            ОТКУДА ЕЩЁ <span style={{color: C.orange}}>20%</span>?
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 3: max effort paradox */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3 * (1 - ease.in(seg(frame, 905, 945))),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 80,
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={585}>
          <Panel style={{padding: '40px 50px', width: 560}}>
            <div style={{fontFamily: F.mono, fontSize: 22, color: C.ice, letterSpacing: 3}}>НЕЗАВИСИМЫЕ ЗАМЕРЫ</div>
            <div style={{fontFamily: F.display, fontSize: 44, color: C.white, marginTop: 14, lineHeight: 1.2}}>
              НА МАКСИМУМЕ —<br />
              РАСХОД <span style={{color: C.red}}>БОЛЬШЕ</span>
            </div>
            <div style={{marginTop: 26, fontFamily: F.mono, fontSize: 26, color: C.gray}}>
              токенов на задачу:{' '}
              <span style={{color: C.red, fontWeight: 700}}>
                <CountUp frame={frame} start={640} dur={40} from={73} to={119} suffix="k" />
              </span>
              <span style={{color: C.dim}}> / было 73k</span>
            </div>
            <div style={{marginTop: 16, height: 10, borderRadius: 5, background: C.panel2, overflow: 'hidden'}}>
              <div
                style={{
                  width: `${ease.out(seg(frame, 640, 680)) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${C.orange}, ${C.red})`,
                }}
              />
            </div>
            <div style={{marginTop: 14, fontFamily: F.mono, fontSize: 18, color: C.dim}}>замеры Artificial Analysis</div>
          </Panel>
        </FadeSlide>
        <FadeSlide frame={frame} start={700} style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.display, fontSize: 66, color: C.white, lineHeight: 1.25}}>
            ДЕШЕВЛЕ <span style={{color: C.dim}}>И</span>
            <br />
            <span style={{color: C.red}}>ДОРОЖЕ</span>?
          </div>
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
        <div style={{fontFamily: F.display, fontSize: 96, color: C.white, textAlign: 'center', lineHeight: 1.1, transform: `scale(${ease.back(seg(frame, 925, 950))})`}}>
          КТО-ТО ЗДЕСЬ
          <br />
          <span style={{color: C.orange}}>НЕДОГОВАРИВАЕТ</span>
        </div>
        <FadeSlide frame={frame} start={1010}>
          <div style={{fontFamily: F.body, fontSize: 44, color: C.gray, marginTop: 40, fontWeight: 600}}>
            Давайте разберёмся, <span style={{color: C.white, borderBottom: `4px solid ${C.orange}`}}>кто</span>
          </div>
        </FadeSlide>
      </div>
    </Stage>
  );
};
