import React from 'react';
import {useCurrentFrame, Sequence, Audio, staticFile, OffthreadVideo} from 'remotion';
import {ease, seg} from '../lib/design';
import {DarkSoulsGame} from '../demos/DarkSoulsGame';
import {MarioKartGame} from '../demos/MarioKartGame';
import {GenerativeArt} from '../demos/JsAnimScene';
import {OrangeAsterisk} from '../components/primitives';
import montage from '../montage.json';

// Real recording from public/video-montage/ when present, coded demo otherwise
export const DemoClip: React.FC<{
  src: string | null;
  startFrom?: number;
  fallback: React.ReactNode;
}> = ({src, startFrom = 15, fallback}) => {
  if (!src) return <>{fallback}</>;
  return (
    <OffthreadVideo
      src={staticFile(src)}
      startFrom={startFrom}
      muted
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  );
};

const Flash: React.FC<{frame: number; children: React.ReactNode}> = ({frame, children}) => {
  // white punch at cut boundaries
  const op = Math.max(1 - seg(frame, 0, 5) * 1, ease.in(seg(frame, 31, 36)));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {children}
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: Math.min(1, op)}} />
    </div>
  );
};

export const S01ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{width: 1920, height: 1080, background: '#000', position: 'relative', overflow: 'hidden'}}>
      {frame < 36 && (
        <Flash frame={frame}>
          <DemoClip
            src={montage.souls}
            fallback={<DarkSoulsGame mode="full" startFrame={192} showHud={false} />}
          />
        </Flash>
      )}
      {frame >= 36 && frame < 72 && (
        <Flash frame={frame - 36}>
          <DemoClip
            src={montage.kart}
            fallback={<MarioKartGame mode="fixed" startFrame={150} showHud={false} />}
          />
        </Flash>
      )}
      {frame >= 72 && frame < 108 && (
        <Flash frame={frame - 72}>
          <DemoClip
            src={montage.js}
            fallback={<GenerativeArt frame={frame * 2} variant={3} width={1920} height={1080} />}
          />
        </Flash>
      )}
      {frame >= 108 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{opacity: ease.out(seg(frame, 118, 132))}}>
            <OrangeAsterisk size={90} spin={frame * 0.6} />
          </div>
        </div>
      )}
      {/* SFX */}
      <Sequence from={0} durationInFrames={20}>
        <Audio src={staticFile('audio/whoosh.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={36} durationInFrames={20}>
        <Audio src={staticFile('audio/whoosh.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={72} durationInFrames={20}>
        <Audio src={staticFile('audio/whoosh.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={108} durationInFrames={30}>
        <Audio src={staticFile('audio/impact.mp3')} volume={0.9} />
      </Sequence>
    </div>
  );
};
