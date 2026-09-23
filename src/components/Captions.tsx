import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, ease, seg, clamp} from '../lib/design';

// highlight key fragments inside caption text
const KEY = /(−?\d+[\d\s]*([.,]\d+)?\s?(%|час[аов]*|Elo|балл[аов]*|токен[аов]*|запрос[аов]*|уточнени[яй]*|правк[аиу]|строк)?|Opus 5\.5|Opus 5|Opus 4\.8|Fable 5\.1|GPT-6 Astra|GPT-5\.6 Sol|Dark Souls|Mario Kart|JavaScript|Terminal-Bench|FrontierCode|CursorBench|GDPval-AA|Intelligence Index|Artificial Analysis|METR|HAProxy|Claude Code|API|кеш[а]?|16 из 18|59,6|66,4|52,3|57,9|54,4|57,8|1846|119|73)/g;

const renderText = (text: string) => {
  const parts = text.split(KEY);
  return parts.map((p, i) =>
    KEY.test(p) && p.trim() ? (
      <span key={i} style={{color: C.orange, fontWeight: 800}}>
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
};

export const Captions: React.FC<{
  phrases: string[];
  voiceSec: number;
  preDelay: number;
}> = ({phrases, voiceSec, preDelay}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const tSec = frame / fps - preDelay;
  if (tSec < 0) return null;

  // distribute phrases across voice duration proportional to char length
  const weights = phrases.map((p) => Math.max(8, p.length));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  let idx = phrases.length - 1;
  let startSec = 0;
  let endSec = voiceSec;
  for (let i = 0; i < phrases.length; i++) {
    const s = (acc / total) * voiceSec;
    acc += weights[i];
    const e = (acc / total) * voiceSec;
    if (tSec >= s && tSec < e) {
      idx = i;
      startSec = s;
      endSec = e;
      break;
    }
  }
  const local = clamp((tSec - startSec) / Math.max(0.01, endSec - startSec));
  const op = ease.out(seg(local, 0, 0.12)) * (1 - ease.in(seg(local, 0.92, 1)));
  const dy = (1 - ease.out(seg(local, 0, 0.15))) * 26;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 140px',
        pointerEvents: 'none',
        zIndex: 80,
      }}
    >
      <div
        style={{
          opacity: op,
          transform: `translateY(${dy}px)`,
          background: 'rgba(8,8,10,0.88)',
          border: `1px solid ${C.line}`,
          borderLeft: `5px solid ${C.orange}`,
          borderRadius: 14,
          padding: '18px 34px',
          maxWidth: 1500,
          textAlign: 'center',
          color: C.white,
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.32,
          textShadow: '0 2px 12px #000',
        }}
      >
        {renderText(phrases[idx])}
      </div>
    </div>
  );
};
