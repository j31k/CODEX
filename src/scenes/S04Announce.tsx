import React from 'react';
import {useCurrentFrame, Img, staticFile} from 'remotion';
import {C, F, ease, seg, clamp, lerp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, Chip, OrangeAsterisk} from '../components/primitives';

const XPostCard: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const t = ease.back(seg(frame, start, start + 22));
  return (
    <div style={{transform: `scale(${t})`, opacity: clamp(t * 1.5)}}>
      <Panel style={{width: 620, padding: '30px 34px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: '#000',
              border: `1px solid ${C.line}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <OrangeAsterisk size={40} />
          </div>
          <div>
            <div style={{fontFamily: F.body, fontWeight: 800, fontSize: 27, color: C.white, display: 'flex', alignItems: 'center', gap: 8}}>
              Anthropic
              <svg width={22} height={22} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={11} fill={C.orange} />
                <path d="M7 12.5 L10.5 16 L17 8.5" stroke="#000" strokeWidth={2.6} fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.dim}}>@AnthropicAI</div>
          </div>
          <div style={{marginLeft: 'auto', fontFamily: F.display, fontSize: 30, color: C.white}}>𝕏</div>
        </div>
        <div style={{fontFamily: F.body, fontSize: 27, color: C.white, marginTop: 22, lineHeight: 1.45, fontWeight: 500}}>
          Introducing <span style={{color: C.orange, fontWeight: 800}}>Claude Opus 5.5</span> — the first model in our new Claude 5.5 family.
          <br />
          <span style={{color: C.gray}}>Fable-level work. 40% cheaper to run.</span>
        </div>
        <div style={{display: 'flex', gap: 34, marginTop: 22, fontFamily: F.mono, fontSize: 19, color: C.dim}}>
          <span>2:04 PM · 22 сен 2026</span>
          <span>♺ 4,1K</span>
          <span>♥ 18K</span>
          <span>👁 2,3M</span>
        </div>
      </Panel>
      <div style={{textAlign: 'center', marginTop: 12, fontFamily: F.mono, fontSize: 17, color: C.dim}}>
        карточка воссоздана по анонсу · x.com/AnthropicAI
      </div>
    </div>
  );
};

export const S04Announce: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 545, 585); // «на уровне» ≠ «лучше во всём»
  const phase3 = seg(frame, 990, 1030); // availability
  const heroZoom = 1 + frame * 0.0006;

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Анонс"
      chapterIndex={2}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 6, src: 'audio/impact.mp3', volume: 0.45},
        {frame: 545, src: 'audio/whoosh.mp3', volume: 0.55},
        {frame: 990, src: 'audio/whoosh.mp3', volume: 0.55},
      ]}
    >
      {/* date */}
      <div style={{position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <FadeSlide frame={frame} start={2}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 64,
              color: C.white,
              letterSpacing: 4,
              borderBottom: `5px solid ${C.orange}`,
              paddingBottom: 6,
            }}
          >
            22 СЕНТЯБРЯ <span style={{color: C.orange}}>2026</span>
          </div>
        </FadeSlide>
      </div>

      {/* phase 1: X post + hero */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: 210,
          display: 'flex',
          justifyContent: 'center',
          gap: 70,
          opacity: 1 - ease.in(seg(frame, 535, 575)),
          pointerEvents: 'none',
        }}
      >
        <XPostCard frame={frame} start={20} />
        <FadeSlide frame={frame} start={48} dy={60}>
          <div>
            <div
              style={{
                width: 760,
                height: 428,
                borderRadius: 20,
                overflow: 'hidden',
                border: `2px solid ${C.line}`,
                boxShadow: `0 40px 90px -30px #000, 0 0 60px -20px ${C.orange}44`,
              }}
            >
              <Img
                src={staticFile('assets/official/6d4a0d28992ade92d6fa63646fd9c9d318245c6c-2400x1260.jpg')}
                style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${heroZoom})`}}
              />
            </div>
            <div style={{textAlign: 'center', marginTop: 12, fontFamily: F.mono, fontSize: 17, color: C.dim}}>
              официальный арт · anthropic.com/news/claude-opus-5-5
            </div>
            <FadeSlide frame={frame} start={190}>
              <div
                style={{
                  marginTop: 26,
                  textAlign: 'center',
                  fontFamily: F.body,
                  fontSize: 34,
                  color: C.white,
                  fontWeight: 700,
                }}
              >
                «На большинстве задач — на уровне{' '}
                <span style={{color: C.orange}}>Fable 5.1</span>»
              </div>
              <div style={{textAlign: 'center', fontFamily: F.mono, fontSize: 21, color: C.gray, marginTop: 10}}>
                Fable — тяжёлая артиллерия · Opus — дешевле
              </div>
            </FadeSlide>
          </div>
        </FadeSlide>
      </div>

      {/* phase 2: disclaimer + checklist */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 980, 1020))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={555}>
          <Panel glow style={{padding: '44px 64px', textAlign: 'center', maxWidth: 1250}}>
            <div style={{fontFamily: F.display, fontSize: 66, color: C.white, lineHeight: 1.2}}>
              «НА УРОВНЕ» <span style={{color: C.orange}}>≠</span> «ЛУЧШЕ ВО ВСЁМ»
            </div>
            <div style={{fontFamily: F.body, fontSize: 30, color: C.gray, marginTop: 20, fontWeight: 500}}>
              Anthropic сама признаёт: баллы тестов ≠ разница в реальной работе
            </div>
          </Panel>
        </FadeSlide>
        <FadeSlide frame={frame} start={790}>
          <div style={{display: 'flex', gap: 30, marginTop: 64}}>
            {['КОД', 'РАБОЧИЕ ЗАДАЧИ', 'ДЕНЬГИ'].map((t, i) => (
              <div
                key={t}
                style={{
                  transform: `scale(${ease.back(seg(frame, 790 + i * 14, 790 + i * 14 + 18))})`,
                }}
              >
                <Chip color={i === 0 ? C.orange : C.white} style={{fontSize: 30, padding: '16px 34px', fontFamily: F.display, letterSpacing: 3}}>
                  {t}
                </Chip>
              </div>
            ))}
          </div>
          <div style={{textAlign: 'center', marginTop: 30, fontFamily: F.body, fontSize: 28, color: C.gray, fontWeight: 600}}>
            проверяем по отдельности
          </div>
        </FadeSlide>
      </div>

      {/* phase 3: availability + hook */}
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
        <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 5}}>УЖЕ ДОСТУПНА</div>
        <div style={{display: 'flex', gap: 34, marginTop: 36}}>
          {['Claude · платные тарифы', 'Claude Code', 'API'].map((t, i) => (
            <div key={t} style={{transform: `scale(${ease.back(seg(frame, 1000 + i * 12, 1000 + i * 12 + 18))})`}}>
              <Panel glow={i === 1} style={{padding: '26px 44px'}}>
                <div style={{fontFamily: F.display, fontSize: 36, color: i === 1 ? C.orange : C.white, letterSpacing: 1}}>{t}</div>
              </Panel>
            </div>
          ))}
        </div>
        <FadeSlide frame={frame} start={1150}>
          <div
            style={{
              marginTop: 80,
              fontFamily: F.display,
              fontSize: 58,
              color: C.white,
              textAlign: 'center',
              lineHeight: 1.25,
            }}
          >
            И ПЕРВАЯ ЦИФРА ВЫГЛЯДИТ
            <br />
            <span style={{color: C.orange}}>ПОЧТИ НЕРЕАЛЬНО →</span>
          </div>
        </FadeSlide>
      </div>
    </Stage>
  );
};
