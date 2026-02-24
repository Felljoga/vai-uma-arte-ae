import { forwardRef, ButtonHTMLAttributes, useRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useAudio } from '../contexts/AudioContext';

interface SoundButtonProps extends Omit<HTMLMotionProps<"button">, 'onMouseEnter' | 'onMouseDown'> {
  enableHoverSound?: boolean;
  enableClickSound?: boolean;
  hoverScale?: number;
  tapScale?: number;
}

export const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  (
    {
      children,
      onClick,
      enableHoverSound = true,
      enableClickSound = true,
      hoverScale = 1.02,
      tapScale = 0.98,
      ...props
    },
    ref
  ) => {
    const { playClick, playHover } = useAudio();
    const lastHover = useRef<number>(0);

    const handleMouseEnter = () => {
      if (enableHoverSound) {
        const now = Date.now();
        if (now - lastHover.current > 50) {
          playHover();
          lastHover.current = now;
        }
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableClickSound) {
        playClick();
      }
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: tapScale }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

SoundButton.displayName = 'SoundButton';

// Versão simples sem motion
interface SimpleSoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  enableHoverSound?: boolean;
  enableClickSound?: boolean;
}

export const SimpleSoundButton = forwardRef<HTMLButtonElement, SimpleSoundButtonProps>(
  (
    {
      children,
      onClick,
      enableHoverSound = true,
      enableClickSound = true,
      ...props
    },
    ref
  ) => {
    const { playClick, playHover } = useAudio();
    const lastHover = useRef<number>(0);

    const handleMouseEnter = () => {
      if (enableHoverSound) {
        const now = Date.now();
        if (now - lastHover.current > 50) {
          playHover();
          lastHover.current = now;
        }
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableClickSound) {
        playClick();
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SimpleSoundButton.displayName = 'SimpleSoundButton';
