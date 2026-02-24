import { useCallback, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';

// Hook para adicionar sons a eventos de mouse
export function useSound() {
  const audio = useAudio();
  const lastHover = useRef<number>(0);

  const withClickSound = useCallback(
    <T extends (...args: any[]) => any>(fn: T) => {
      return ((...args: Parameters<T>) => {
        audio.playClick();
        return fn(...args);
      }) as T;
    },
    [audio]
  );

  const onHover = useCallback(() => {
    // Throttle hover sounds to avoid spam
    const now = Date.now();
    if (now - lastHover.current > 50) {
      audio.playHover();
      lastHover.current = now;
    }
  }, [audio]);

  const onClick = useCallback(() => {
    audio.playClick();
  }, [audio]);

  const soundProps = useCallback(
    (includeHover = true) => ({
      onClick,
      ...(includeHover && { onMouseEnter: onHover }),
    }),
    [onClick, onHover]
  );

  return {
    ...audio,
    withClickSound,
    onHover,
    onClick,
    soundProps,
  };
}

// Hook para botões com som
export function useSoundButton() {
  const { playClick, playHover } = useAudio();
  const lastHover = useRef<number>(0);

  return {
    onMouseEnter: () => {
      const now = Date.now();
      if (now - lastHover.current > 50) {
        playHover();
        lastHover.current = now;
      }
    },
    onMouseDown: () => playClick(),
  };
}
