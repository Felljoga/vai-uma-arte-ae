// 🎵 VAI UMA ARTE AÊ?! - Controles de Áudio
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Music2,
  Settings,
  X,
  Waves,
  Sparkles
} from 'lucide-react';
import { audioManager } from '../services/audio';

export function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(audioManager.getSettings());
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([0.3, 0.5, 0.7, 0.4, 0.6]);

  useEffect(() => {
    // Inicializar audio manager
    audioManager.init();
    setSettings(audioManager.getSettings());
    setIsPlaying(audioManager.getSettings().ambientEnabled);
  }, []);

  // Animação do visualizador quando música está tocando
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVisualizerBars(prev => 
        prev.map(() => 0.2 + Math.random() * 0.8)
      );
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggleMusic = () => {
    audioManager.playClick();
    audioManager.toggleAmbient();
    const newSettings = audioManager.getSettings();
    setIsPlaying(newSettings.ambientEnabled);
    setSettings(newSettings);
  };

  const handleToggleSound = () => {
    const enabled = audioManager.toggleSound();
    setSettings({ ...settings, enabled });
    if (enabled) audioManager.playClick();
  };

  const handleMasterVolume = (value: number) => {
    audioManager.setMasterVolume(value);
    setSettings({ ...settings, masterVolume: value });
  };

  const handleSfxVolume = (value: number) => {
    audioManager.setSfxVolume(value);
    setSettings({ ...settings, sfxVolume: value });
  };

  const handleMusicVolume = (value: number) => {
    audioManager.setMusicVolume(value);
    setSettings({ ...settings, ambientVolume: value });
  };

  return (
    <>
      {/* Botão flutuante de música */}
      <motion.button
        onClick={handleToggleMusic}
        className={`fixed bottom-24 left-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isPlaying 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
            : 'bg-white/10 backdrop-blur-lg border border-white/20'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pausar música ambiente' : 'Tocar música ambiente'}
      >
        {isPlaying ? (
          <div className="relative">
            <Music className="w-5 h-5 text-white" />
            {/* Visualizador mini */}
            <div className="absolute -top-1 -right-1 flex gap-[2px]">
              {visualizerBars.slice(0, 3).map((height, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-white rounded-full"
                  animate={{ height: `${height * 8}px` }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <Music2 className="w-5 h-5 text-white/70" />
        )}
      </motion.button>

      {/* Botão de configurações de áudio */}
      <motion.button
        onClick={() => {
          audioManager.playClick();
          setIsOpen(true);
        }}
        className="fixed bottom-24 left-16 z-40 p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Configurações de áudio"
      >
        <Settings className="w-5 h-5 text-white/70" />
      </motion.button>

      {/* Modal de configurações */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-32 left-4 z-50 w-80 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                    <Volume2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Áudio</h3>
                    <p className="text-xs text-gray-400">Configurações de som</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Visualizador */}
              {isPlaying && (
                <div className="px-4 pt-4">
                  <div className="flex items-end justify-center gap-1 h-16 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-3">
                    {visualizerBars.map((height, i) => (
                      <motion.div
                        key={i}
                        className="w-3 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full"
                        animate={{ height: `${height * 40}px` }}
                        transition={{ duration: 0.15 }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-purple-400 mt-2 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Música ambiente tocando
                  </p>
                </div>
              )}

              {/* Controles */}
              <div className="p-4 space-y-4">
                {/* Toggle som geral */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.enabled ? (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm text-white">Sons ativados</span>
                  </div>
                  <button
                    onClick={handleToggleSound}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.enabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                      animate={{ left: settings.enabled ? '26px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Volume Master */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Volume Geral</span>
                    <span className="text-xs text-gray-500">{Math.round(settings.masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.masterVolume}
                    onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                </div>

                {/* Volume Efeitos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Efeitos Sonoros</span>
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(settings.sfxVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.sfxVolume}
                    onChange={(e) => handleSfxVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
                  />
                </div>

                {/* Volume Música */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-gray-300">Música Ambiente</span>
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(settings.ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.ambientVolume}
                    onChange={(e) => handleMusicVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
                  />
                </div>

                {/* Botão play/pause música */}
                <motion.button
                  onClick={handleToggleMusic}
                  className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    isPlaying
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isPlaying ? (
                    <>
                      <Music className="w-5 h-5" />
                      Pausar Música Ambiente
                    </>
                  ) : (
                    <>
                      <Music2 className="w-5 h-5" />
                      Tocar Música Ambiente
                    </>
                  )}
                </motion.button>

                {/* Descrição */}
                <p className="text-xs text-center text-gray-500">
                  🎵 Música gerada proceduralmente com acordes relaxantes, 
                  drones suaves e texturas sonoras imersivas.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Styles para sliders */}
      <style>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider-pink::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
        }
        .slider-purple::-moz-range-thumb,
        .slider-blue::-moz-range-thumb,
        .slider-pink::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        .slider-purple::-moz-range-thumb {
          background: linear-gradient(135deg, #a855f7, #ec4899);
        }
        .slider-blue::-moz-range-thumb {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }
        .slider-pink::-moz-range-thumb {
          background: linear-gradient(135deg, #ec4899, #f43f5e);
        }
      `}</style>
    </>
  );
}
