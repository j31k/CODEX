import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {Stamp, FadeSlide} from '../components/primitives';
import {DarkSoulsGame} from '../demos/DarkSoulsGame';
import {MarioKartGame} from '../demos/MarioKartGame';
import {GenerativeArt} from '../demos/JsAnimScene';

const Thumb: React.FC<{
  frame: number;
  start: number;
  label: string;
  sub: string;
  children: React.ReactNode;
  tilt: number;
}> = ({frame, start, label, sub, children, tilt}) => {
  const t = ease.back(seg(frame, start, start + 20));
  return (
    <div
      style={{
        width: 500,
        transform: `scale(${t}) rotate(${tilt}deg)`,
        opacity: clamp(t * 1.4),
      }}
    >
      <div
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          border: `2px solid ${C.line}`,
          boxShadow: '0 30px 70px -20px #000, 0 0 0 1px #000',
          height: 280,
          position: 'relative',
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.55)',
            borderRadius: 18,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: `${C.orange}ee`,
            color: '#000',
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 17,
            padding: '5px 12px',
            borderRadius: 8,
            letterSpacing: 1,
          }}
        >
          AI-GENERATED
        </div>
      </div>
      <div style={{marginTop: 16, textAlign: 'center'}}>
        <div style={{fontFamily: F.display, fontSize: 30, color: C.white, letterSpacing: 2}}>{label}</div>
        <div style={{fontFamily: F.mono, fontSize: 19, color: C.gray, marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};

export const S02Hook: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const endGlow = seg(frame, frames - 40, frames - 8);
  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Холодный старт"
      chapterIndex={0}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 30, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 52, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 74, src: 'audio/blip.mp3', volume: 0.5},
      ]}
    >
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 130}}>
        <FadeSlide frame={frame} start={6} style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontSize: 26, color: C.orange, letterSpacing: 6, textTransform: 'uppercase'}}>
            Три демо. Ноль строк руками
          </div>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 88,
              color: C.white,
              marginTop: 14,
              lineHeight: 1.05,
              textShadow: '0 10px 50px rgba(0,0,0,0.8)',
            }}
          >
            ВСЁ ЭТО СОБРАЛА
            <br />
            <span style={{color: C.orange}}>НЕЙРОСЕТЬ</span>
          </div>
        </FadeSlide>

        <div style={{display: 'flex', gap: 44, marginTop: 56}}>
          <Thumb frame={frame} start={30} label="DARK SOULS" sub="копия · боёвка · перекаты" tilt={-2.5}>
            <DarkSoulsGame mode="full" frame={150 + (frame % 240)} showHud={false} width={500} height={280} />
          </Thumb>
          <Thumb frame={frame} start={52} label="MARIO KART" sub="трасса · дрифт · соперники" tilt={1.8}>
            <MarioKartGame mode="fixed" startFrame={160} showHud={false} width={500} height={280} />
          </Thumb>
          <Thumb frame={frame} start={74} label="JS-АНИМАЦИЯ" sub="одна фраза → живой код" tilt={-1.4}>
            <GenerativeArt frame={frame * 2} variant={3} width={500} height={280} />
          </Thumb>
        </div>

        <div style={{marginTop: 54, height: 90, display: 'flex', alignItems: 'center'}}>
          {frame > 100 && frame < frames - 90 ? (
            <Stamp frame={frame} start={100}>Покажу в конце</Stamp>
          ) : frame >= frames - 90 ? (
            <div
              style={{
                fontFamily: F.display,
                fontSize: 54,
                color: C.white,
                opacity: ease.out(seg(frame, frames - 90, frames - 70)),
              }}
            >
              НО У ЭТОЙ ИСТОРИИ ЕСТЬ <span style={{color: C.red, textShadow: `0 0 ${30 * endGlow}px ${C.red}`}}>ПОДВОХ</span>
            </div>
          ) : null}
        </div>
      </div>
    </Stage>
  );
};
