import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useSound } from '@/hooks/useSound';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Accessibility
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  
  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (v: number) => void;
  playPop: () => void;
  playWhoosh: () => void;
  playClick: () => void;
  playGlitch: () => void;
  playHover: () => void;
  
  // Style theme
  styleTheme: string;
  setStyleTheme: (theme: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [styleTheme, setStyleTheme] = useState('neon');
  
  const {
    isEnabled: soundEnabled,
    toggleSound,
    volume,
    setVolume,
    playPop,
    playWhoosh,
    playClick,
    playGlitch,
    playHover,
  } = useSound();

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion(prev => !prev);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleTheme,
      reducedMotion,
      toggleReducedMotion,
      highContrast,
      toggleHighContrast,
      soundEnabled,
      toggleSound,
      volume,
      setVolume,
      playPop,
      playWhoosh,
      playClick,
      playGlitch,
      playHover,
      styleTheme,
      setStyleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
