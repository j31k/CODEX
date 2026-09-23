import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, Chip, Typewriter} from '../components/primitives';
import {DarkSoulsGame} from '../demos/DarkSoulsGame';

const RecBar: React.FC<{label: string}> = ({label}) => (
  <div
    style={{
      position: 'absolute',
      top: 90,
      left: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: F.mono,
      fontSize: 21,
      color: C.white,
      zIndex: 45,
      background: 'rgba(0,0,0,0.55)',
      border: `1px solid ${C.line}`,
      borderRadius: 10,
      padding: '8px 16px',
    }}
  >
    <span style={{width: 12, height: 12, borderRadius: '50%', background: C.red, boxShadow: `0 0 10px ${C.red}`}} />
    REC · {label}
  </div>
);

export const S11DemoSouls: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const promptT = seg(frame, 0, 400);
  const brokenT = seg(frame, 400, 990);
  const fixFlash = seg(frame, 990, 1030);
  const fixedT = seg(frame, 1030, 1500);
  const hookT = seg(frame, 1400, 1450);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Демо 1 · Dark Souls"
      chapterIndex={9}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 6, src: 'audio/riser.mp3', volume: 0.45},
        {frame: 800, src: 'audio/impact.mp3', volume: 0.6},
        {frame: 1000, src: 'audio/whoosh.mp3', volume: 0.8},
        {frame: 1040, src: 'audio/impact.mp3', volume: 0.5},
      ]}
    >
      {/* game layer */}
      <div style={{position: 'absolute', inset: 0}}>
        {frame < 400 ? (
          <div style={{opacity: 0.35}}>
            <DarkSoulsGame mode="full" frame={Math.floor(frame * 0.15)} showHud={false} />
          </div>
        ) : frame < 800 ? (
          <DarkSoulsGame mode="full" frame={Math.floor((frame - 400) * 0.5)} showHud />
        ) : frame < 1030 ? (
          <DarkSoulsGame mode="broken" frame={90 + (frame - 800)} showHud />
        ) : (
          <DarkSoulsGame mode="full" frame={90 + (frame - 1030)} showHud />
        )}
      </div>

      {/* prompt overlay */}
      {frame < 430 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 46,
            opacity: 1 - ease.in(seg(frame, 380, 425)),
          }}
        >
          <Panel glow style={{width: 1050, padding: '40px 48px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20}}>
              <Chip color={C.orange} style={{fontSize: 20}}>ДЕМО 1 · ЗАПИСЬ ЭКРАНА</Chip>
              <Chip color={C.gray} style={{fontSize: 20}}>claude opus 5.5</Chip>
            </div>
            <div style={{fontFamily: F.mono, fontSize: 30, color: C.white, lineHeight: 1.5, minHeight: 150}}>
              <Typewriter
                frame={frame}
                start={20}
                cps={34}
                text="Собери копию Dark Souls: персонаж, движение, камера, противник, удары, перекаты, полоски здоровья и выносливости."
              />
            </div>
            <FadeSlide frame={frame} start={180}>
              <div style={{display: 'flex', gap: 16, marginTop: 18}}>
                <Chip color={C.white} style={{fontSize: 20}}>не картинка — игра</Chip>
                <Chip color={C.orange} style={{fontSize: 20}}>запросов: 4</Chip>
              </div>
            </FadeSlide>
          </Panel>
        </div>
      )}

      {frame >= 400 && <RecBar label={frame < 1030 ? 'prototype_v1.py' : 'prototype_v2.py'} />}

      {/* honest bug label */}
      {frame >= 800 && frame < 1030 && (
        <FadeSlide frame={frame} start={805} style={{position: 'absolute', bottom: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 46}}>
          <div
            style={{
              fontFamily: F.body,
              fontSize: 30,
              fontWeight: 700,
              color: C.white,
              background: 'rgba(20,0,0,0.8)',
              border: `1.5px solid ${C.red}`,
              borderRadius: 14,
              padding: '16px 30px',
            }}
          >
            ЧЕСТНО: в первой версии сломались коллизии — рыцарь проваливается сквозь платформу
          </div>
        </FadeSlide>
      )}

      {/* fix flash */}
      {frame >= 990 && frame < 1070 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 47,
            background: `rgba(255,90,31,${0.85 * (1 - seg(frame, 990, 1030))})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontSize: 110,
              color: '#000',
              background: C.orange,
              padding: '10px 50px',
              borderRadius: 20,
              transform: `scale(${ease.back(seg(frame, 992, 1012))}) rotate(-2deg)`,
              opacity: 1 - seg(frame, 1040, 1065),
            }}
          >
            1 ПРАВКА
          </div>
        </div>
      )}

      {/* fixed label */}
      {frame >= 1080 && frame < 1400 && (
        <FadeSlide frame={frame} start={1090} style={{position: 'absolute', bottom: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 46}}>
          <div
            style={{
              fontFamily: F.body,
              fontSize: 30,
              fontWeight: 700,
              color: C.white,
              background: 'rgba(0,20,8,0.8)',
              border: `1.5px solid ${C.green}`,
              borderRadius: 14,
              padding: '16px 30px',
            }}
          >
            Работает. Не AAA и не FromSoftware — но играбельный прототип за вечер
          </div>
        </FadeSlide>
      )}

      {/* hook */}
      {frame >= 1400 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 48,
            background: `rgba(5,5,8,${0.82 * ease.out(seg(frame, 1400, 1440))})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hookT,
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: F.body, fontSize: 38, color: C.gray, fontWeight: 600}}>Кажется, круче некуда?</div>
            <div style={{fontFamily: F.display, fontSize: 84, color: C.white, marginTop: 18}}>
              ВО ВТОРОМ ДЕМО — <span style={{color: C.orange}}>ФИЗИКА</span>
            </div>
            <div style={{fontFamily: F.mono, fontSize: 24, color: C.dim, marginTop: 16}}>а она сложнее боёвки</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
