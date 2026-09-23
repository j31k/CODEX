import React from 'react';
import {Sequence, Audio, staticFile} from 'remotion';
import timing from './timing.json';
import {Fonts} from './components/Fonts';
import {S01ColdOpen} from './scenes/S01ColdOpen';
import {S02Hook} from './scenes/S02Hook';
import {S03Mystery} from './scenes/S03Mystery';
import {S04Announce} from './scenes/S04Announce';
import {S05Benchmarks} from './scenes/S05Benchmarks';
import {S06Coding} from './scenes/S06Coding';
import {S07Office} from './scenes/S07Office';
import {S08Pricing} from './scenes/S08Pricing';
import {S09Safety} from './scenes/S09Safety';
import {S10Independent} from './scenes/S10Independent';
import {S11DemoSouls} from './scenes/S11DemoSouls';
import {S12DemoKart} from './scenes/S12DemoKart';
import {S13DemoJs} from './scenes/S13DemoJs';
import {S14Outro} from './scenes/S14Outro';

export const COLD_OPEN_FRAMES = 150;

type SceneMeta = {
  audio: string;
  voiceSec: number;
  preDelay: number;
  frames: number;
  captions: string[];
};

const sceneMap: Record<string, React.FC<SceneMeta>> = {
  S02: S02Hook,
  S03: S03Mystery,
  S04: S04Announce,
  S05: S05Benchmarks,
  S06: S06Coding,
  S07: S07Office,
  S08: S08Pricing,
  S09: S09Safety,
  S10: S10Independent,
  S11: S11DemoSouls,
  S12: S12DemoKart,
  S13: S13DemoJs,
  S14: S14Outro,
};

const ORDER = ['S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14'];

export const totalFrames = () => {
  const scenes = timing.scenes as unknown as Record<string, SceneMeta>;
  return ORDER.reduce((acc, id) => acc + scenes[id].frames, COLD_OPEN_FRAMES);
};

export const Main: React.FC = () => {
  const scenes = timing.scenes as unknown as Record<string, SceneMeta>;
  let acc = COLD_OPEN_FRAMES;
  const seqs = ORDER.map((id) => {
    const meta = scenes[id];
    const from = acc;
    acc += meta.frames;
    return {id, from, meta};
  });
  return (
    <Fonts>
      {/* global ambient music bed */}
      <Audio src={staticFile('audio/music.mp3')} loop volume={0.12} />
      <Sequence durationInFrames={COLD_OPEN_FRAMES}>
        <S01ColdOpen />
      </Sequence>
      {seqs.map(({id, from, meta}) => {
        const Comp = sceneMap[id];
        return (
          <Sequence key={id} from={from} durationInFrames={meta.frames}>
            <Comp {...meta} />
          </Sequence>
        );
      })}
    </Fonts>
  );
};
