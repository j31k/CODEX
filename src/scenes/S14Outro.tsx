import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, Chip, Typewriter, OrangeAsterisk, Cursor} from '../components/primitives';

const Pillar: React.FC<{
  frame: number;
  start: number;
  title: string;
  verdict: string;
  note: string;
  color: string;
}> = ({frame, start, title, verdict, note, color}) => {
  const t = ease.back(seg(frame, start, start + 22));
  return (
    <div style={{transform: `scale(${t})`, opacity: clamp(t * 1.5)}}>
      <Panel glow={color === C.orange} style={{width: 430, padding: '34px 36px', minHeight: 260}}>
        <div style={{fontFamily: F.mono, fontSize: 20, color: C.gray, letterSpacing: 2}}>{title}</div>
        <div style={{fontFamily: F.display, fontSize: 56, color, marginTop: 12}}>{verdict}</div>
        <div style={{fontFamily: F.body, fontSize: 23, color: C.gray, marginTop: 12, lineHeight: 1.45, fontWeight: 500}}>{note}</div>
      </Panel>
    </div>
  );
};

const CheckItem: React.FC<{frame: number; start: number; text: string}> = ({frame, start, text}) => {
  const t = ease.out(seg(frame, start, start + 16));
  const checked = frame > start + 14;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: t,
        transform: `translateX(${(1 - t) * 50}px)`,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          border: `3px solid ${checked ? C.orange : C.line}`,
          background: checked ? `${C.orange}22` : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: C.orange,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {checked && '✓'}
      </div>
      <div style={{fontFamily: F.body, fontSize: 34, color: C.white, fontWeight: 600}}>{text}</div>
    </div>
  );
};

export const S14Outro: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 760, 800);
  const phase3 = seg(frame, 1300, 1345);
  const phase4 = seg(frame, 1720, 1765);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Итог"
      chapterIndex={12}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 10, src: 'audio/impact.mp3', volume: 0.5},
        {frame: 760, src: 'audio/whoosh.mp3', volume: 0.5},
        {frame: 1300, src: 'audio/whoosh.mp3', volume: 0.5},
        {frame: 1720, src: 'audio/riser.mp3', volume: 0.4},
      ]}
    >
      {/* PHASE 1: verdict */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - ease.in(seg(frame, 750, 790)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={4}>
          <div style={{fontFamily: F.display, fontSize: 72, color: C.white}}>ИТАК, НОВЫЙ ЛИДЕР?</div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 56, marginTop: 56}}>
          <FadeSlide frame={frame} start={130}>
            <Panel style={{padding: '36px 48px', width: 560, textAlign: 'center', border: `1.5px solid ${C.red}55`}}>
              <div style={{fontFamily: F.display, fontSize: 54, color: C.red}}>ВО ВСЁМ — НЕТ</div>
              <div style={{fontFamily: F.body, fontSize: 25, color: C.gray, marginTop: 14, lineHeight: 1.5, fontWeight: 500}}>
                в отдельных тестах выигрывают конкуренты, громкие цифры при проверке скромнее
              </div>
            </Panel>
          </FadeSlide>
          <FadeSlide frame={frame} start={420}>
            <Panel glow style={{padding: '36px 48px', width: 560, textAlign: 'center'}}>
              <div style={{fontFamily: F.display, fontSize: 54, color: C.orange}}>ОБНОВЛЕНИЕ — ДА</div>
              <div style={{fontFamily: F.body, fontSize: 25, color: C.gray, marginTop: 14, lineHeight: 1.5, fontWeight: 500}}>
                особенно для длинной работы из многих шагов: код, документы, данные, отчёты
              </div>
            </Panel>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={600}>
          <div style={{marginTop: 46, fontFamily: F.body, fontSize: 29, color: C.gray, fontWeight: 600, textAlign: 'center'}}>
            цена ниже, но ваша зависит от <span style={{color: C.white}}>режима, кеша и числа попыток</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 2: three pillars */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 1290, 1335))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={770}>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 5}}>ГДЕ ОНА СИЛЬНА</div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 40, marginTop: 40}}>
          <Pillar frame={frame} start={800} title="КОД" verdict="СИЛЬНА" color={C.orange} note="большие проекты, миграции, аудит — держит контекст и проверяет себя" />
          <Pillar frame={frame} start={870} title="МАТЕРИАЛЫ" verdict="СИЛЬНА" color={C.orange} note="отчёты со ссылками на каждую цифру — вы проверяете источники" />
          <Pillar frame={frame} start={940} title="ЦЕНА ЗАДАЧИ" verdict="ЗАВИСИТ" color={C.amber} note="дефолт дешевле на ~40%, максимум — как раньше. Считайте результат" />
        </div>
        <FadeSlide frame={frame} start={1080}>
          <div style={{marginTop: 52, fontFamily: F.body, fontSize: 30, color: C.gray, fontWeight: 600, textAlign: 'center'}}>
            простые вопросы — революции не заметите · большой проект — <span style={{color: C.white}}>попробовать стоит</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 3: three tasks advice */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase3 * (1 - ease.in(seg(frame, 1710, 1755))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={1310}>
          <div style={{fontFamily: F.display, fontSize: 58, color: C.white}}>
            МОЙ СОВЕТ: <span style={{color: C.orange}}>ТРИ СВОИ ЗАДАЧИ</span>
          </div>
        </FadeSlide>
        <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 52}}>
          <CheckItem frame={frame} start={1360} text="Анализ документов" />
          <CheckItem frame={frame} start={1420} text="Код или таблица" />
          <CheckItem frame={frame} start={1480} text="Размытые требования" />
        </div>
        <FadeSlide frame={frame} start={1580}>
          <Panel style={{marginTop: 56, padding: '24px 44px'}}>
            <div style={{fontFamily: F.body, fontSize: 29, color: C.white, fontWeight: 600}}>
              Сравнивайте не красоту ответа, а <span style={{color: C.orange, fontWeight: 800}}>число правок до результата</span>
            </div>
          </Panel>
        </FadeSlide>
      </div>

      {/* PHASE 4: CTA */}
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
        <FadeSlide frame={frame} start={1730}>
          <div style={{fontFamily: F.body, fontSize: 34, color: C.gray, fontWeight: 600, textAlign: 'center'}}>
            Мы собрали Dark Souls, Mario Kart и анимацию. Что дальше?
          </div>
        </FadeSlide>
        <FadeSlide frame={frame} start={1800} style={{marginTop: 34, width: 1150}}>
          <Panel glow style={{padding: '30px 38px', position: 'relative'}}>
            <div style={{display: 'flex', gap: 18, alignItems: 'flex-start'}}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.orange}, ${C.amber})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.display,
                  fontSize: 26,
                  color: '#000',
                  flexShrink: 0,
                }}
              >
                ВЫ
              </div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: F.mono, fontSize: 19, color: C.dim, marginBottom: 8}}>комментарий…</div>
                <div style={{fontFamily: F.body, fontSize: 30, color: C.white, minHeight: 90, fontWeight: 500}}>
                  <Typewriter
                    frame={frame}
                    start={1850}
                    cps={26}
                    text="Собери CRM для моей бабушкиной пекарни. С доставкой. И чтобы сама считала налоги 🥐"
                  />
                </div>
              </div>
            </div>
            {frame > 2050 && (
              <Cursor
                frame={frame}
                points={[
                  {f: 2050, x: 900, y: 300},
                  {f: 2090, x: 1010, y: 232},
                  {f: 2130, x: 1010, y: 232},
                ]}
                clickAt={[2095]}
              />
            )}
          </Panel>
        </FadeSlide>
        <FadeSlide frame={frame} start={1960}>
          <div style={{marginTop: 40, fontFamily: F.display, fontSize: 44, color: C.white, textAlign: 'center', lineHeight: 1.35}}>
            САМУЮ БЕЗУМНУЮ РЕАЛЬНУЮ ЗАДАЧУ —<br />
            <span style={{color: C.orange}}>В СЛЕДУЮЩЕЕ ВИДЕО. СО ВСЕМИ ПРОВАЛАМИ.</span>
          </div>
        </FadeSlide>
        <FadeSlide frame={frame} start={2100} style={{position: 'absolute', bottom: 150}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: 0.9}}>
            <OrangeAsterisk size={44} spin={frame * 0.4} />
            <span style={{fontFamily: F.mono, fontSize: 21, color: C.dim}}>источники: anthropic.com · Artificial Analysis · METR</span>
          </div>
        </FadeSlide>
      </div>
    </Stage>
  );
};
