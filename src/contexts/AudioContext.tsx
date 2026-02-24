import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { audioManager, type AudioSettings, type SoundType } from '../services/audio';

interface AudioContextType {
  settings: AudioSettings;
  initialized: boolean;
  play: (sound: SoundType) => void;
  playClick: () => void;
  playHover: () => void;
  playSuccess: () => void;
  playError: () => void;
  playNotification: () => void;
  playAchievement: () => void;
  playLevelUp: () => void;
  playCoins: () => void;
  playModal: () => void;
  playMessage: () => void;
  playLike: () => void;
  playSend: () => void;
  playWhoosh: () => void;
  playPop: () => void;
  playUnlock: () => void;
  playToggle: (on: boolean) => void;
  toggleSound: () => boolean;
  toggleAmbient: () => void;
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  initAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(audioManager.getSettings());
  const [initialized, setInitialized] = useState(false);

  const initAudio = useCallback(async () => {
    if (!initialized) {
      await audioManager.init();
      setInitialized(true);
      setSettings(audioManager.getSettings());
    }
  }, [initialized]);

  // Inicializar áudio na primeira interação do usuário
  useEffect(() => {
    const handleInteraction = async () => {
      await initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [initAudio]);

  const play = useCallback((sound: SoundType) => {
    audioManager.play(sound);
  }, []);

  const playClick = useCallback(() => audioManager.playClick(), []);
  const playHover = useCallback(() => audioManager.playHover(), []);
  const playSuccess = useCallback(() => audioManager.playSuccess(), []);
  const playError = useCallback(() => audioManager.playError(), []);
  const playNotification = useCallback(() => audioManager.playNotification(), []);
  const playAchievement = useCallback(() => audioManager.playAchievement(), []);
  const playLevelUp = useCallback(() => audioManager.playLevelUp(), []);
  const playCoins = useCallback(() => audioManager.playCoins(), []);
  const playModal = useCallback(() => audioManager.playModal(), []);
  const playMessage = useCallback(() => audioManager.playMessage(), []);
  const playLike = useCallback(() => audioManager.playLike(), []);
  const playSend = useCallback(() => audioManager.playSend(), []);
  const playWhoosh = useCallback(() => audioManager.playWhoosh(), []);
  const playPop = useCallback(() => audioManager.playPop(), []);
  const playUnlock = useCallback(() => audioManager.playUnlock(), []);
  const playToggle = useCallback((on: boolean) => audioManager.playToggle(on), []);

  const toggleSound = useCallback(() => {
    const enabled = audioManager.toggleSound();
    setSettings(audioManager.getSettings());
    return enabled;
  }, []);

  const toggleAmbient = useCallback(() => {
    audioManager.toggleAmbient();
    setSettings(audioManager.getSettings());
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    audioManager.setMasterVolume(volume);
    setSettings(audioManager.getSettings());
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    audioManager.setSfxVolume(volume);
    setSettings(audioManager.getSettings());
  }, []);

  const setAmbientVolume = useCallback((volume: number) => {
    audioManager.setAmbientVolume(volume);
    setSettings(audioManager.getSettings());
  }, []);

  return (
    <AudioContext.Provider
      value={{
        settings,
        initialized,
        play,
        playClick,
        playHover,
        playSuccess,
        playError,
        playNotification,
        playAchievement,
        playLevelUp,
        playCoins,
        playModal,
        playMessage,
        playLike,
        playSend,
        playWhoosh,
        playPop,
        playUnlock,
        playToggle,
        toggleSound,
        toggleAmbient,
        setMasterVolume,
        setSfxVolume,
        setAmbientVolume,
        initAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
