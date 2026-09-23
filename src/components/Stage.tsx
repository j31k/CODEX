import React from 'react';
import {Audio, useCurrentFrame, staticFile, Sequence} from 'remotion';
import {C, F, rand} from '../lib/design';
import {Captions} from './Captions';

export type Chapter = {name: string; color?: string};

const Grain: React.FC<{frame: number}> = ({frame}) => {
  // subtle animated grain via deterministic dots (cheap: no blend modes)
  const seedBase = Math.floor(frame / 2);
  const dots = Array.from({length: 34}).map((_, i) => {
    const r1 = rand(seedBase * 100 + i * 2);
    const r2 = rand(seedBase * 100 + i * 2 + 1);
    return {x: r1 * 1920, y: r2 * 1080, o: 0.04 + r1 * 0.05};
  });
  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 55}}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.2} fill="#fff" opacity={d.o} />
      ))}
    </svg>
  );
};

export const Stage: React.FC<{
  children: React.ReactNode;
  audio?: string;
  voiceSec?: number;
  preDelay?: number;
  captions?: string[];
  chapter?: string;
  chapterIndex?: number;
  chapterCount?: number;
  sceneFrames?: number;
  bg?: string;
  sfxAt?: {frame: number; src: string; volume?: number}[];
  dim?: number;
}> = ({
  children,
  audio,
  voiceSec = 0,
  preDelay = 0.25,
  captions,
  chapter,
  chapterIndex = 0,
  chapterCount = 10,
  sceneFrames = 100,
  bg,
  sfxAt = [],
  dim = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: bg || `radial-gradient(1200px 700px at 50% 20%, ${C.bg2} 0%, ${C.bg} 60%)`,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: F.body,
      }}
    >
      {bg ? null : (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.5}}>
          {Array.from({length: 24}).map((_, i) => (
            <line key={'v' + i} x1={i * 80} y1={0} x2={i * 80} y2={1080} stroke={C.line} strokeWidth={0.5} opacity={0.35} />
          ))}
          {Array.from({length: 14}).map((_, i) => (
            <line key={'h' + i} x1={0} y1={i * 80} x2={1920} y2={i * 80} stroke={C.line} strokeWidth={0.5} opacity={0.35} />
          ))}
        </svg>
      )}

      {children}

      {dim > 0 && (
        <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`, zIndex: 40}} />
      )}

      <Grain frame={frame} />
      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(1400px 900px at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 60,
        }}
      />

      {chapter && (
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 60,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            zIndex: 70,
          }}
        >
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 22,
              letterSpacing: 4,
              color: C.orange,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: C.orange,
                boxShadow: `0 0 12px ${C.orange}`,
                display: 'inline-block',
              }}
            />
            {chapter}
          </div>
          <div style={{flex: 1, height: 3, background: C.line, borderRadius: 2, overflow: 'hidden'}}>
            <div
              style={{
                width: `${((chapterIndex + frame / sceneFrames) / chapterCount) * 100}%`,
                height: '100%',
                background: C.orange,
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{fontFamily: F.mono, fontSize: 20, color: C.dim}}>
            {String(chapterIndex + 1).padStart(2, '0')}/{String(chapterCount).padStart(2, '0')}
          </div>
        </div>
      )}

      {captions && voiceSec > 0 && (
        <Captions phrases={captions} voiceSec={voiceSec} preDelay={preDelay} />
      )}

      {audio && <Audio src={staticFile(audio)} />}
      {sfxAt.map((s, i) => (
        <Sequence key={i} from={s.frame} durationInFrames={60}>
          <Audio src={staticFile(s.src)} volume={s.volume ?? 0.7} />
        </Sequence>
      ))}
    </div>
  );
};
