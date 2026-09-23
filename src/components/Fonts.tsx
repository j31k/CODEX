import React, {useEffect} from 'react';
import {delayRender, continueRender, staticFile} from 'remotion';

const css = `
@font-face {
  font-family: 'Russo One';
  src: url('${staticFile('fonts/russo-one.ttf')}') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Golos Text';
  src: url('${staticFile('fonts/golos-text.ttf')}') format('truetype');
  font-weight: 100 900;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('${staticFile('fonts/jetbrains-mono.ttf')}') format('truetype');
  font-weight: 100 900;
}
`;

export const Fonts: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [handle] = React.useState(() => delayRender('fonts'));
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.fonts.ready
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
    return () => {
      document.head.removeChild(style);
    };
  }, [handle]);
  return <>{children}</>;
};
