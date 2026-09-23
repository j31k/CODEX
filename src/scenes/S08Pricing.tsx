import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';
import {Stage} from '../components/Stage';
import {FadeSlide, Panel, CountUp, Chip} from '../components/primitives';

const PriceRow: React.FC<{
  frame: number;
  start: number;
  name: string;
  oldP: string;
  newP: string;
  pct: number;
  hot?: boolean;
}> = ({frame, start, name, oldP, newP, pct, hot}) => {
  const t = ease.back(seg(frame, start, start + 20));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '22px 36px',
        borderRadius: 16,
        background: hot ? `${C.orange}12` : C.panel,
        border: `1.5px solid ${hot ? C.orange : C.line}`,
        transform: `translateX(${(1 - t) * -80}px)`,
        opacity: clamp(t * 1.5),
        boxShadow: hot ? `0 0 40px ${C.orange}33` : 'none',
      }}
    >
      <div style={{width: 300, fontFamily: F.body, fontSize: 30, color: C.white, fontWeight: 700}}>{name}</div>
      <div style={{width: 170, fontFamily: F.mono, fontSize: 32, color: C.dim, textDecoration: 'line-through', textDecorationColor: C.red}}>
        {oldP}
      </div>
      <div style={{fontFamily: F.display, fontSize: 30, color: C.orange}}>→</div>
      <div style={{width: 170, fontFamily: F.display, fontSize: 44, color: hot ? C.orange : C.white}}>{newP}</div>
      <div
        style={{
          marginLeft: 'auto',
          fontFamily: F.display,
          fontSize: 34,
          color: hot ? '#000' : C.orange,
          background: hot ? C.orange : 'transparent',
          border: hot ? 'none' : `2px solid ${C.orange}55`,
          borderRadius: 10,
          padding: '4px 16px',
        }}
      >
        −{pct}%
      </div>
    </div>
  );
};

export const S08Pricing: React.FC<{
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
}> = ({audio, voiceSec, preDelay, frames, captions}) => {
  const frame = useCurrentFrame();
  const phase2 = seg(frame, 340, 380);
  const phase3 = seg(frame, 960, 1000);
  const phase4 = seg(frame, 1110, 1150);
  const phase5 = seg(frame, 2000, 2045);

  return (
    <Stage
      audio={audio}
      voiceSec={voiceSec}
      preDelay={preDelay}
      captions={captions}
      chapter="Деньги"
      chapterIndex={6}
      chapterCount={13}
      sceneFrames={frames}
      sfxAt={[
        {frame: 30, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 90, src: 'audio/blip.mp3', volume: 0.5},
        {frame: 150, src: 'audio/impact.mp3', volume: 0.6},
        {frame: 1110, src: 'audio/whoosh.mp3', volume: 0.6},
        {frame: 2000, src: 'audio/impact.mp3', volume: 0.5},
      ]}
    >
      {/* PHASE 1: price table */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1 - ease.in(seg(frame, 330, 370)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={2}>
          <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 4, textAlign: 'center'}}>
            API · ЦЕНА ЗА 1 МЛН ТОКЕНОВ
          </div>
        </FadeSlide>
        <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginTop: 36}}>
          <PriceRow frame={frame} start={30} name="Вход" oldP="$5" newP="$4" pct={20} />
          <PriceRow frame={frame} start={90} name="Выход" oldP="$25" newP="$20" pct={20} />
          <PriceRow frame={frame} start={150} name="Чтение кеша" oldP="$0,50" newP="$0,20" pct={60} hot />
        </div>
        <FadeSlide frame={frame} start={240}>
          <div style={{marginTop: 40, fontFamily: F.body, fontSize: 30, color: C.gray, fontWeight: 600}}>
            смотрите на <span style={{color: C.orange, fontWeight: 800}}>последнюю строку</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 2: cache loop explanation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase2 * (1 - ease.in(seg(frame, 950, 990))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={350}>
          <div style={{fontFamily: F.display, fontSize: 62, color: C.white}}>
            ВОТ И <span style={{color: C.orange}}>РАЗГАДКА</span>
          </div>
        </FadeSlide>
        <div style={{display: 'flex', gap: 70, marginTop: 50, alignItems: 'center'}}>
          <FadeSlide frame={frame} start={430}>
            <Panel style={{padding: 34, width: 620, height: 330, position: 'relative', overflow: 'hidden'}}>
              <div style={{fontFamily: F.mono, fontSize: 21, color: C.gray, marginBottom: 16}}>АГЕНТ ПЕРЕЧИТЫВАЕТ ФАЙЛЫ</div>
              {['app.ts', 'db.ts', 'api.ts', 'test.ts'].map((fName, i) => {
                const cycle = ((frame * 1.4 + i * 70) % 280) / 280;
                const y = 60 + i * 62;
                return (
                  <div key={fName} style={{position: 'absolute', left: 34, top: y, display: 'flex', alignItems: 'center', gap: 14, width: 540}}>
                    <span style={{fontFamily: F.mono, fontSize: 23, color: C.white, width: 110}}>{fName}</span>
                    <div style={{flex: 1, height: 8, background: C.panel2, borderRadius: 4, position: 'relative'}}>
                      <div
                        style={{
                          position: 'absolute',
                          left: `${cycle * 100}%`,
                          top: -5,
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          background: C.orange,
                          boxShadow: `0 0 14px ${C.orange}`,
                          transform: 'translateX(-50%)',
                        }}
                      />
                    </div>
                    <span style={{fontFamily: F.mono, fontSize: 19, color: C.orange}}>кеш</span>
                  </div>
                );
              })}
              <div style={{position: 'absolute', bottom: 18, left: 34, fontFamily: F.mono, fontSize: 18, color: C.dim}}>
                чтение кеша: $0,20 / 1M — в 3 раза дешевле, чем было
              </div>
            </Panel>
          </FadeSlide>
          <FadeSlide frame={frame} start={560} style={{maxWidth: 560}}>
            <div style={{fontFamily: F.body, fontSize: 31, color: C.white, lineHeight: 1.5, fontWeight: 500}}>
              Большая часть контекста агента — это <span style={{color: C.orange, fontWeight: 800}}>кеш</span>.
              <br />
              Плюс на дефолте модель тратит <span style={{color: C.orange, fontWeight: 800}}>меньше токенов</span>.
            </div>
            <div style={{marginTop: 30, fontFamily: F.display, fontSize: 76, color: C.orange, textShadow: `0 0 50px ${C.orange}44`}}>
              ≈ −40% <span style={{fontSize: 34, color: C.white}}>НА ТИПИЧНОЙ ЗАДАЧЕ</span>
            </div>
            <div style={{fontFamily: F.mono, fontSize: 19, color: C.dim, marginTop: 8}}>оценка Anthropic · настройки по умолчанию</div>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={880}>
          <div style={{marginTop: 44, fontFamily: F.display, fontSize: 40, color: C.white}}>
            ЗАГАДКА РЕШЕНА? <span style={{color: C.amber}}>ПОЧТИ.</span>
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 3: max effort reality */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase4 * (1 - ease.in(seg(frame, 1990, 2030))),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <FadeSlide frame={frame} start={1120}>
          <Chip color={C.ice} style={{fontSize: 22}}>ARTIFICIAL ANALYSIS · MAX EFFORT</Chip>
        </FadeSlide>
        <div style={{display: 'flex', gap: 70, marginTop: 44, alignItems: 'flex-end'}}>
          <FadeSlide frame={frame} start={1180} style={{textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 38, color: C.white}}>OPUS 5.5</div>
            <div style={{width: 180, height: ease.out(seg(frame, 1200, 1240)) * 300, background: `linear-gradient(180deg, ${C.red}, ${C.orange})`, borderRadius: 14, margin: '16px auto 0', boxShadow: `0 0 40px ${C.orange}44`}} />
            <div style={{fontFamily: F.display, fontSize: 54, color: C.red, marginTop: 14}}>
              <CountUp frame={frame} start={1200} dur={30} to={119} suffix="k" />
            </div>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.gray}}>выходных токенов</div>
          </FadeSlide>
          <FadeSlide frame={frame} start={1300} style={{textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontSize: 38, color: C.gray}}>OPUS 5</div>
            <div style={{width: 180, height: ease.out(seg(frame, 1320, 1360)) * 184, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 14, margin: '16px auto 0'}} />
            <div style={{fontFamily: F.display, fontSize: 54, color: C.gray, marginTop: 14}}>73k</div>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.dim}}>выходных токенов</div>
          </FadeSlide>
          <FadeSlide frame={frame} start={1450} style={{maxWidth: 620}}>
            <Panel style={{padding: '30px 38px'}}>
              <div style={{fontFamily: F.body, fontSize: 29, color: C.white, lineHeight: 1.5, fontWeight: 500}}>
                Модель <span style={{color: C.orange, fontWeight: 800}}>думала дольше</span> — и цена задачи оказалась ≈ на уровне старой.
              </div>
              <div style={{fontFamily: F.body, fontSize: 25, color: C.gray, marginTop: 14, lineHeight: 1.45}}>
                «Дефолт» и «максимум» — два разных режима. Никто не соврал.
              </div>
            </Panel>
          </FadeSlide>
        </div>
        <FadeSlide frame={frame} start={1800}>
          <div
            style={{
              marginTop: 56,
              fontFamily: F.display,
              fontSize: 46,
              color: C.white,
              border: `2px solid ${C.orange}`,
              borderRadius: 16,
              padding: '20px 44px',
              background: `${C.orange}10`,
            }}
          >
            СМОТРИТЕ НА ЦЕНУ <span style={{color: C.orange}}>РЕЗУЛЬТАТА</span>, А НЕ МИЛЛИОНА ТОКЕНОВ
          </div>
        </FadeSlide>
      </div>

      {/* PHASE 4: hook */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 24, color: C.gray, letterSpacing: 4}}>ЧАСТЬ, КОТОРУЮ В РЕКЛАМУ НЕ СТАВЯТ</div>
        <div style={{fontFamily: F.display, fontSize: 80, color: C.white, textAlign: 'center', marginTop: 26, lineHeight: 1.2, transform: `scale(${ease.back(seg(frame, 2010, 2040))})`}}>
          ANTHROPIC САМА<br />
          <span style={{color: C.red}}>ОГРАНИЧИЛА</span> СВОЮ МОДЕЛЬ
        </div>
      </div>
    </Stage>
  );
};
