import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, Chip, Typewriter} from '../components/primitives';
import {MarioKartGame} from '../demos/MarioKartGame';

export const S12DemoKart: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const hookT = seg(frame, 940, 985);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Демо 2 · Mario Kart"
      chapterIndex={10}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 6, src: 'audio/riser.mp3', volume: 0.45},
        {frame: 300, src: 'audio/impact.mp3', volume: 0.5},
        {frame: 560, src: 'audio/whoosh.mp3', volume: 0.8},
      ]}
    >
      {/* game layer */}
      <div style={{position: 'absolute', inset: 0}}>
        {frame < 260 ? (
          <div style={{opacity: 0.35}}>
            <MarioKartGame mode="fixed" frame={Math.floor(frame * 0.3)} showHud={false} />
          </div>
        ) : frame < 560 ? (
          <MarioKartGame mode="ice" frame={frame - 260} showHud />
        ) : (
          <MarioKartGame mode="fixed" frame={120 + (frame - 560)} showHud />
        )}
      </div>

      {/* prompt overlay */}
      {frame < 290 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 46,
            opacity: 1 - ease.in(seg(frame, 240, 285)),
          }}
        >
          <Panel glow style={{width: 1050, padding: '40px 48px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20}}>
              <Chip color={C.orange} style={{fontSize: 20}}>ДЕМО 2 · ЗАПИСЬ ЭКРАНА</Chip>
              <Chip color={C.gray} style={{fontSize: 20}}>claude opus 5.5</Chip>
            </div>
            <div style={{fontFamily: F.mono, fontSize: 30, color: C.white, lineHeight: 1.5, minHeight: 110}}>
              <Typewriter
                frame={frame}
                start={20}
                cps={36}
                text="Mario Kart: трасса, машинки, дрифт, соперники. Главное — чтобы поворот было приятно проходить."
              />
            </div>
            <FadeSlide frame={frame} start={150}>
              <div style={{display: 'flex', gap: 16, marginTop: 14}}>
                <Chip color={C.white} style={{fontSize: 20}}>сложное — не графика, а управление</Chip>
              </div>
            </FadeSlide>
          </Panel>
        </div>
      )}

      {/* ice label */}
      {frame >= 300 && frame < 560 && (
        <FadeSlide frame={frame} start={310} style={{position: 'absolute', bottom: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 46}}>
          <div
            style={{
              fontFamily: F.body,
              fontSize: 30,
              fontWeight: 700,
              color: C.white,
              background: 'rgba(3,12,22,0.85)',
              border: `1.5px solid ${C.ice}`,
              borderRadius: 14,
              padding: '16px 30px',
            }}
          >
            ПЕРВЫЙ ВАРИАНТ: как на льду. Прямо скажем — неиграбельно
          </div>
        </FadeSlide>
      )}

      {/* fix flash */}
      {frame >= 555 && frame < 630 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 47,
            background: `rgba(255,90,31,${0.85 * (1 - seg(frame, 555, 600))})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontSize: 100,
              color: '#000',
              background: C.orange,
              padding: '10px 46px',
              borderRadius: 20,
              transform: `scale(${ease.back(seg(frame, 558, 580))}) rotate(-2deg)`,
              opacity: 1 - seg(frame, 600, 625),
            }}
          >
            3 УТОЧНЕНИЯ
          </div>
        </div>
      )}

      {/* fixed label */}
      {frame >= 640 && frame < 940 && (
        <FadeSlide frame={frame} start={650} style={{position: 'absolute', bottom: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 46}}>
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
            Дрифт, соперники, круги. Счётчик кругов и ИИ модель написала сама
          </div>
        </FadeSlide>
      )}

      {/* hook */}
      {frame >= 940 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 48,
            background: `rgba(5,5,8,${0.85 * ease.out(seg(frame, 940, 975))})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hookT,
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 76, color: C.white, lineHeight: 1.2}}>
              ТРЕТЬЕ ДЕМО УДИВИЛО<br />
              <span style={{color: C.orange}}>БОЛЬШЕ ДВУХ ИГР</span>
            </div>
            <div style={{fontFamily: F.mono, fontSize: 24, color: C.dim, marginTop: 18}}>и удивило тем, что выглядит проще</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
