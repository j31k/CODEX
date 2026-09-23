import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Chip} from '../components/primitives';
import {JsAnimScene} from '../demos/JsAnimScene';

export const S13DemoJs: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const endT = seg(frame, 800, 850);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Демо 3 · JS-анимация"
      chapterIndex={11}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 6, src: 'audio/riser.mp3', volume: 0.4},
        {frame: 200, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 460, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 800, src: 'audio/impact.mp3', volume: 0.45},
      ]}
    >
      <div style={{position: 'absolute', inset: 0}}>
        <JsAnimScene mode="editor" startFrame={0} />
      </div>

      {/* top-left context chips */}
      <div style={{position: 'absolute', top: 92, left: 60, display: 'flex', gap: 14, zIndex: 46}}>
        <Chip color={C.orange} style={{fontSize: 19, background: 'rgba(10,10,14,0.8)'}}>ДЕМО 3 · ЧИСТЫЙ JAVASCRIPT</Chip>
        <Chip color={C.gray} style={{fontSize: 19, background: 'rgba(10,10,14,0.8)'}}>без игровых движков</Chip>
      </div>

      {/* iteration markers */}
      <div style={{position: 'absolute', top: 92, right: 60, display: 'flex', gap: 10, zIndex: 46}}>
        {[1, 2, 3].map((v) => {
          const active = frame >= (v === 1 ? 0 : v === 2 ? 200 : 460);
          return (
            <div
              key={v}
              style={{
                fontFamily: F.mono,
                fontSize: 20,
                padding: '6px 16px',
                borderRadius: 8,
                border: `1.5px solid ${active ? C.orange : C.line}`,
                color: active ? C.orange : C.dim,
                background: 'rgba(10,10,14,0.8)',
              }}
            >
              v{v}
            </div>
          );
        })}
      </div>

      {/* ending takeaway */}
      {frame >= 800 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 48,
            background: `rgba(5,5,8,${0.88 * ease.out(seg(frame, 800, 840))})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: endT,
          }}
        >
          <div style={{textAlign: 'center', maxWidth: 1400}}>
            <FadeSlide frame={frame} start={810}>
              <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 4}}>ГЛАВНОЕ ИЗМЕНЕНИЕ</div>
              <div style={{fontFamily: F.display, fontSize: 68, color: C.white, marginTop: 20, lineHeight: 1.25}}>
                МОДЕЛЬ НЕ ОТВЕЧАЕТ НА ВОПРОС —<br />
                ОНА <span style={{color: C.orange}}>ДОВОДИТ ЗАДАЧУ ДО РЕЗУЛЬТАТА</span>
              </div>
              <div style={{fontFamily: F.body, fontSize: 32, color: C.gray, marginTop: 24, fontWeight: 600}}>
                итерация за итерацией · код можно открыть, прочитать и вставить на сайт
              </div>
            </FadeSlide>
          </div>
        </div>
      )}
    </Stage>
  );
};
