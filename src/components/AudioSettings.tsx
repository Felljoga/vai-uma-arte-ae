import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Music, Sparkles, Zap } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AudioSettings({ isOpen, onClose }: AudioSettingsProps) {
  const {
    settings,
    toggleSound,
    toggleAmbient,
    setMasterVolume,
    setSfxVolume,
    setAmbientVolume,
    playClick,
    playSuccess,
    playAchievement,
    playLevelUp,
    playCoins,
    playMessage,
    playLike,
    playUnlock,
    playModal,
  } = useAudio();

  const handleClose = () => {
    playClick();
    onClose();
  };

  const testSounds = [
    { name: 'Sucesso', icon: '✅', play: playSuccess },
    { name: 'Conquista', icon: '🏆', play: playAchievement },
    { name: 'Level Up', icon: '⬆️', play: playLevelUp },
    { name: 'Moedas', icon: '💰', play: playCoins },
    { name: 'Mensagem', icon: '💬', play: playMessage },
    { name: 'Curtida', icon: '❤️', play: playLike },
    { name: 'Desbloqueio', icon: '🔓', play: playUnlock },
    { name: 'Modal', icon: '📦', play: playModal },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Experiência Sonora</h2>
                    <p className="text-sm text-zinc-400">Personalize seus sons</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Toggle Principal */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  {settings.enabled ? (
                    <Volume2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className="font-medium text-white">Sons do Sistema</p>
                    <p className="text-sm text-zinc-400">Efeitos sonoros e feedbacks</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSound()}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.enabled ? 'bg-green-500' : 'bg-zinc-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.enabled ? 28 : 4 }}
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>

              {/* Volume Master */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Volume Geral
                  </span>
                  <span className="text-sm text-zinc-400">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume * 100}
                  onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
                  className="w-full h-2 rounded-full bg-zinc-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Volume SFX */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    Efeitos Sonoros
                  </span>
                  <span className="text-sm text-zinc-400">{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sfxVolume * 100}
                  onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                  className="w-full h-2 rounded-full bg-zinc-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Música Ambiente */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">Música Ambiente</p>
                      <p className="text-sm text-zinc-400">Sons relaxantes de fundo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAmbient()}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.ambientEnabled ? 'bg-purple-500' : 'bg-zinc-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.ambientEnabled ? 28 : 4 }}
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                    />
                  </button>
                </div>
                
                {settings.ambientEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Volume</span>
                      <span className="text-sm text-zinc-400">{Math.round(settings.ambientVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.ambientVolume * 100}
                      onChange={(e) => setAmbientVolume(Number(e.target.value) / 100)}
                      className="w-full h-2 rounded-full bg-zinc-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </motion.div>
                )}
              </div>

              {/* Testar Sons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Testar Sons
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {testSounds.map((sound) => (
                    <motion.button
                      key={sound.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sound.play}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all flex flex-col items-center gap-1"
                    >
                      <span className="text-xl">{sound.icon}</span>
                      <span className="text-[10px] text-zinc-400">{sound.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <p className="text-xs text-center text-zinc-500">
                🎵 A experiência sonora torna tudo mais imersivo e divertido!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
