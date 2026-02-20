// VAI UMA ARTE AÊ?! - Site Oficial
// Sistema completo com autenticação Firebase
import { useState, useEffect, useRef, createContext, useContext, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';

// ==================== SOUND CONTEXT ====================
interface SoundContextType {
  soundEnabled: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (v: number) => void;
  playPop: () => void;
  playWhoosh: () => void;
  playClick: () => void;
  playGlitch: () => void;
  playHover: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) return {
    soundEnabled: false, volume: 0.5, toggleSound: () => {}, setVolume: () => {},
    playPop: () => {}, playWhoosh: () => {}, playClick: () => {}, playGlitch: () => {}, playHover: () => {}
  };
  return context;
};

const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', gainValue = 0.3) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;
      gainNode.gain.setValueAtTime(gainValue * volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {}
  }, [soundEnabled, volume, getAudioContext]);

  const playPop = useCallback(() => playTone(800, 0.1, 'sine', 0.2), [playTone]);
  const playWhoosh = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1 * volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [soundEnabled, volume, getAudioContext]);
  const playClick = useCallback(() => playTone(1200, 0.05, 'square', 0.1), [playTone]);
  const playGlitch = useCallback(() => playTone(150, 0.08, 'sawtooth', 0.15), [playTone]);
  const playHover = useCallback(() => playTone(600, 0.05, 'sine', 0.1), [playTone]);

  return (
    <SoundContext.Provider value={{
      soundEnabled, volume, toggleSound: () => setSoundEnabled(!soundEnabled),
      setVolume, playPop, playWhoosh, playClick, playGlitch, playHover
    }}>
      {children}
    </SoundContext.Provider>
  );
};

// ==================== ACCESSIBILITY CONTEXT ====================
interface AccessibilityContextType {
  reduceMotion: boolean;
  highContrast: boolean;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reduceMotion: false, highContrast: false, toggleReduceMotion: () => {}, toggleHighContrast: () => {}
});

const useAccessibility = () => useContext(AccessibilityContext);

const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(prefersReducedMotion.matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [reduceMotion, highContrast]);

  return (
    <AccessibilityContext.Provider value={{
      reduceMotion, highContrast,
      toggleReduceMotion: () => setReduceMotion(!reduceMotion),
      toggleHighContrast: () => setHighContrast(!highContrast)
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// ==================== PARTICLES ====================
const Particles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    color: ['#a855f7', '#3b82f6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            opacity: 0.6
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// ==================== HEADER ====================
const Header = ({ onOpenAuth }: { onOpenAuth: () => void }) => {
  const { soundEnabled, toggleSound, volume, setVolume } = useSound();
  const { reduceMotion, highContrast, toggleReduceMotion, toggleHighContrast } = useAccessibility();
  const { user } = useAuth();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <motion.div
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          VAI UMA ARTE AÊ?!
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sound Button */}
          <div className="relative" id="sound-button">
            <motion.button
              onClick={toggleSound}
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
              className={`p-2 sm:p-3 rounded-full transition-all ${soundEnabled ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {soundEnabled ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              )}
            </motion.button>

            <AnimatePresence>
              {showVolume && soundEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 bg-gray-900/95 backdrop-blur-xl rounded-xl p-3 border border-white/10 min-w-[120px]"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <p className="text-xs text-gray-400 text-center mt-1">{Math.round(volume * 100)}%</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accessibility Button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="p-2 sm:p-3 rounded-full bg-white/10 text-gray-400 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </motion.button>

            <AnimatePresence>
              {showAccessibility && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 bg-gray-900/95 backdrop-blur-xl rounded-xl p-4 border border-white/10 min-w-[200px] space-y-3"
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">Reduzir movimento</span>
                    <button
                      onClick={toggleReduceMotion}
                      className={`w-10 h-6 rounded-full transition-all ${reduceMotion ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all mx-1 ${reduceMotion ? 'translate-x-4' : ''}`} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">Alto contraste</span>
                    <button
                      onClick={toggleHighContrast}
                      className={`w-10 h-6 rounded-full transition-all ${highContrast ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all mx-1 ${highContrast ? 'translate-x-4' : ''}`} />
                    </button>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Button */}
          <motion.button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user ? (
              <>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName || user.email || '?')[0].toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline">Perfil</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Entrar</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = ({ onOpenBudget }: { onOpenBudget: () => void }) => {
  const { playWhoosh } = useSound();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      <motion.div className="relative z-10 text-center px-4 max-w-5xl mx-auto" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              VAI UMA
            </span>
            <br />
            <span className="text-white">ARTE AÊ?!</span>
          </h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Design que faz barulho.
            <br />
            <span className="text-purple-400">Sua marca, impossível de ignorar.</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            id="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={() => { onOpenBudget(); playWhoosh(); }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Quero minha arte agora 🎨
            </motion.button>

            <motion.a
              href="#portfolio"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver portfólio
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ==================== PORTFOLIO SECTION ====================
const portfolioItems = [
  { id: 1, title: 'Identidade Neon Club', category: 'identidade', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop', color: '#a855f7' },
  { id: 2, title: 'Feed Instagram Fitness', category: 'social', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=600&fit=crop', color: '#ec4899' },
  { id: 3, title: 'Flyer Festa Eletrônica', category: 'flyers', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop', color: '#3b82f6' },
  { id: 4, title: 'Capa YouTube Gaming', category: 'capas', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=600&fit=crop', color: '#06b6d4' },
  { id: 5, title: 'Logo Cafeteria Artesanal', category: 'identidade', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop', color: '#f59e0b' },
  { id: 6, title: 'Stories Loja de Roupas', category: 'social', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop', color: '#10b981' },
];

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'social', name: 'Social Media' },
  { id: 'identidade', name: 'Identidade Visual' },
  { id: 'flyers', name: 'Flyers' },
  { id: 'capas', name: 'Capas' },
];

const PortfolioSection = ({ onOpenBudget }: { onOpenBudget: () => void }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);
  const { playPop, playClick } = useSound();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredItems = activeCategory === 'all' ? portfolioItems : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 px-4 relative" data-tutorial-id="portfolio" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Galeria <span className="text-purple-400">Criativa</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cada projeto conta uma história. Qual vai ser a sua?
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); playClick(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => { setSelectedItem(item); playPop(); }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-300 text-sm capitalize">{item.category}</p>
                </div>
                <div
                  className="absolute top-4 right-4 w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
              <motion.div
                className="relative bg-gray-900 rounded-3xl overflow-hidden max-w-2xl w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full aspect-video object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h3>
                  <p className="text-gray-400 mb-6">Arte criada com muito carinho e criatividade. Esse projeto mostra todo o potencial do nosso trabalho.</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => { onOpenBudget(); setSelectedItem(null); }}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white"
                    >
                      Quero um igual 🎨
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-3 bg-white/10 rounded-xl text-white"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// ==================== SERVICES SECTION ====================
const services = [
  { icon: '🎨', title: 'Identidade Visual', desc: 'Logo + manual + papelaria', price: 'A partir de R$ 450' },
  { icon: '📱', title: 'Artes p/ Instagram', desc: 'Feed, stories, destaques', price: 'A partir de R$ 35/arte' },
  { icon: '🎬', title: 'Artes p/ TikTok', desc: 'Capas e thumbnails', price: 'A partir de R$ 30/arte' },
  { icon: '🎉', title: 'Flyers & Banners', desc: 'Eventos e promoções', price: 'A partir de R$ 60' },
  { icon: '🖼️', title: 'Capas & Thumbnails', desc: 'YouTube, Spotify, etc', price: 'A partir de R$ 80' },
  { icon: '📦', title: 'Pacotes Mensais', desc: 'Gestão visual completa', price: 'A partir de R$ 280/mês' },
];

const ServicesSection = () => {
  const { playHover } = useSound();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-20 px-4 relative" data-tutorial-id="services" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Nossos <span className="text-cyan-400">Poderes</span>
          </h2>
          <p className="text-gray-400">Menu de arte pra deixar sua marca impossível de ignorar</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onMouseEnter={playHover}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.desc}</p>
              <p className="text-purple-400 font-semibold">{service.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== STYLES SECTION ====================
const stylesOptions = [
  { id: 'minimal', name: 'Minimalista', color: 'from-gray-400 to-gray-600', bg: 'bg-gray-800' },
  { id: 'neon', name: 'Neon Futurista', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-900' },
  { id: 'street', name: 'Street / Urbano', color: 'from-orange-500 to-red-500', bg: 'bg-orange-900' },
  { id: 'luxury', name: 'Luxo / Premium', color: 'from-amber-400 to-yellow-600', bg: 'bg-amber-900' },
  { id: 'cute', name: 'Cute / Pastel', color: 'from-pink-300 to-purple-300', bg: 'bg-pink-900' },
];

const StylesSection = () => {
  const [activeStyle, setActiveStyle] = useState('neon');
  const { playPop } = useSound();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 relative" data-tutorial-id="styles" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Escolha seu <span className="text-pink-400">Estilo</span>
          </h2>
          <p className="text-gray-400 mb-12">Clica e vê a mágica acontecer ✨</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {stylesOptions.map((style) => (
            <motion.button
              key={style.id}
              onClick={() => { setActiveStyle(style.id); playPop(); }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${activeStyle === style.id ? `bg-gradient-to-r ${style.color} text-white` : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {style.name}
            </motion.button>
          ))}
        </div>

        <motion.div
          className={`p-8 rounded-3xl transition-all duration-500 ${stylesOptions.find(s => s.id === activeStyle)?.bg || 'bg-purple-900'}`}
          layout
        >
          <div className={`h-2 w-full rounded-full bg-gradient-to-r ${stylesOptions.find(s => s.id === activeStyle)?.color || ''} mb-6`} />
          <p className="text-white text-xl font-bold mb-2">Preview: {stylesOptions.find(s => s.id === activeStyle)?.name}</p>
          <p className="text-white/70">Essa é a vibe que você escolheu! Agora imagina isso no seu feed... 🔥</p>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== TESTIMONIALS SECTION ====================
const testimonials = [
  { name: 'Mari', handle: '@marifit', msg: 'Meu feed nunca ficou tão lindo! 😍 Já recebi 3 parcerias depois das artes novas', time: '14:32' },
  { name: 'Lucas', handle: '@lucasdj', msg: 'Flyer do meu evento bombou demais! Esgotou em 2 dias 🎉', time: '09:15' },
  { name: 'Café Central', handle: '@cafecentral', msg: 'A identidade visual ficou PERFEITA. Valeu cada centavo!', time: '16:48' },
  { name: 'Ana', handle: '@anashop', msg: 'Finalmente achei alguém que entende o que eu quero! 10/10', time: '11:20' },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 relative" data-tutorial-id="testimonials" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            O que <span className="text-green-400">falam</span> da gente
          </h2>
          <p className="text-gray-400">Direto do zap dos clientes 📱</p>
        </motion.div>

        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="flex justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
            >
              <div className="bg-green-600 rounded-2xl rounded-br-md p-4 max-w-md">
                <p className="text-white mb-2">{t.msg}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-200">{t.name} • {t.handle}</span>
                  <span className="text-green-200">{t.time} ✓✓</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== ABOUT SECTION ====================
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Sobre a <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VAI UMA ARTE AÊ?!</span>
          </h2>

          <div className="text-xl text-gray-300 space-y-4 leading-relaxed">
            <p>A gente não faz só arte.</p>
            <p className="text-purple-400 font-bold text-2xl">A gente cria presença.</p>
            <p>Aquela que faz a pessoa parar o scroll.</p>
            <p>Aquela que transforma seguidor em cliente.</p>
            <p className="text-cyan-400">Aquela que deixa a concorrência no vácuo.</p>
          </div>

          <motion.div
            className="mt-12 inline-flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              🎨
            </div>
            <div className="text-left">
              <p className="text-white font-bold">+500 artes entregues</p>
              <p className="text-gray-400 text-sm">e contando...</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== CTA SECTION ====================
const CTASection = ({ onOpenBudget }: { onOpenBudget: () => void }) => {
  const { playWhoosh } = useSound();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 relative" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          className="p-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl border border-purple-500/20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Bora deixar sua marca<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">impossível de ignorar?</span>
          </h2>

          <p className="text-xl text-gray-300 mb-8">Vai uma arte aê?! 🎨</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => { onOpenBudget(); playWhoosh(); }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Simular orçamento 💰
            </motion.button>

            <motion.a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 rounded-full text-white font-bold text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chamar no WhatsApp
            </motion.a>

            <motion.a
              href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full text-white font-bold text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== BUDGET SIMULATOR ====================
const BudgetSimulator = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [style, setStyle] = useState('neon');
  const [quantity, setQuantity] = useState('1-3');
  const [urgency, setUrgency] = useState('normal');
  const [extras, setExtras] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { playPop, playWhoosh } = useSound();

  const servicesList = [
    { id: 'identidade', name: 'Identidade Visual', price: 450 },
    { id: 'instagram', name: 'Artes p/ Instagram', price: 35 },
    { id: 'tiktok', name: 'Artes p/ TikTok', price: 30 },
    { id: 'flyers', name: 'Flyers & Banners', price: 60 },
    { id: 'capas', name: 'Capas & Thumbnails', price: 80 },
    { id: 'kit', name: 'Kit Redes Sociais', price: 280 },
  ];

  const stylesList = [
    { id: 'minimal', name: 'Minimalista', mult: 1 },
    { id: 'neon', name: 'Neon Futurista', mult: 1.15 },
    { id: 'street', name: 'Street / Urbano', mult: 1.1 },
    { id: 'luxury', name: 'Luxo / Premium', mult: 1.25 },
    { id: 'cute', name: 'Cute / Pastel', mult: 1.05 },
  ];

  const extrasList = [
    { id: 'fonte', name: 'Arquivo fonte', price: 50 },
    { id: 'variacoes', name: 'Variações extras', price: 40 },
    { id: 'mockups', name: 'Mockups profissionais', price: 35 },
    { id: 'manual', name: 'Manual de marca', price: 120 },
  ];

  const calculatePrice = () => {
    let base = services.reduce((acc, s) => {
      const service = servicesList.find(sv => sv.id === s);
      return acc + (service?.price || 0);
    }, 0);

    const styleMult = stylesList.find(s => s.id === style)?.mult || 1;
    base *= styleMult;

    const qtyMultipliers: Record<string, number> = { '1-3': 1, '4-10': 0.9, '11-20': 0.85, '20+': 0.75 };
    base *= qtyMultipliers[quantity] || 1;

    const urgencyMultipliers: Record<string, number> = { normal: 1, rapido: 1.3, urgente: 1.6 };
    base *= urgencyMultipliers[urgency] || 1;

    const extrasTotal = extras.reduce((acc, e) => {
      const extra = extrasList.find(ex => ex.id === e);
      return acc + (extra?.price || 0);
    }, 0);

    return Math.round(base + extrasTotal);
  };

  const handleSubmit = () => {
    playWhoosh();
    setSubmitted(true);
  };

  const resetForm = () => {
    setStep(1);
    setServices([]);
    setStyle('neon');
    setQuantity('1-3');
    setUrgency('normal');
    setExtras([]);
    setName('');
    setWhatsapp('');
    setEmail('');
    setSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/20 overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Simulador de Orçamento</h2>
              <p className="text-gray-400 text-sm">Etapa {step} de 5</p>
            </div>
            <button
              onClick={() => { onClose(); resetForm(); }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scroll">
            {submitted ? (
              <motion.div className="text-center py-12" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Orçamento enviado!</h3>
                <p className="text-gray-400 mb-6">Vamos entrar em contato em breve!</p>
                <p className="text-3xl font-bold text-purple-400 mb-8">
                  Valor estimado: R$ {calculatePrice().toLocaleString('pt-BR')}
                </p>
                <button
                  onClick={() => { onClose(); resetForm(); }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold"
                >
                  Fechar
                </button>
              </motion.div>
            ) : (
              <>
                {/* Step 1: Services */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Quais serviços você precisa?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {servicesList.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => {
                            playPop();
                            setServices(services.includes(service.id)
                              ? services.filter(s => s !== service.id)
                              : [...services, service.id]
                            );
                          }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            services.includes(service.id)
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-purple-400 text-sm">R$ {service.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Style */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Qual estilo você prefere?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stylesList.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setStyle(s.id); playPop(); }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            style === s.id
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <p className="text-white font-medium">{s.name}</p>
                          {s.mult > 1 && <p className="text-amber-400 text-sm">+{Math.round((s.mult - 1) * 100)}%</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Quantidade de artes</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['1-3', '4-10', '11-20', '20+'].map((q) => (
                          <button
                            key={q}
                            onClick={() => { setQuantity(q); playPop(); }}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              quantity === q
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/10 bg-white/5'
                            }`}
                          >
                            <p className="text-white font-medium">{q}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Urgência</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'normal', name: 'Normal', desc: '5-7 dias' },
                          { id: 'rapido', name: 'Rápido', desc: '2-3 dias (+30%)' },
                          { id: 'urgente', name: 'Urgente', desc: '24h (+60%)' },
                        ].map((u) => (
                          <button
                            key={u.id}
                            onClick={() => { setUrgency(u.id); playPop(); }}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              urgency === u.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/10 bg-white/5'
                            }`}
                          >
                            <p className="text-white font-medium text-sm">{u.name}</p>
                            <p className="text-gray-400 text-xs">{u.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Extras */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Extras (opcional)</h3>
                    <div className="space-y-3">
                      {extrasList.map((extra) => (
                        <button
                          key={extra.id}
                          onClick={() => {
                            playPop();
                            setExtras(extras.includes(extra.id)
                              ? extras.filter(e => e !== extra.id)
                              : [...extras, extra.id]
                            );
                          }}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                            extras.includes(extra.id)
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <span className="text-white">{extra.name}</span>
                          <span className="text-green-400">+R$ {extra.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Contact */}
                {step === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Seus dados</h3>

                    <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/30 mb-6">
                      <p className="text-purple-300 text-sm">Valor estimado:</p>
                      <p className="text-3xl font-bold text-white">R$ {calculatePrice().toLocaleString('pt-BR')}</p>
                    </div>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="p-6 border-t border-white/10 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-white/10 rounded-xl text-white"
                >
                  Voltar
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  onClick={() => { setStep(step + 1); playWhoosh(); }}
                  disabled={step === 1 && services.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium disabled:opacity-50"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!name || !whatsapp}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-medium disabled:opacity-50"
                >
                  Enviar orçamento 🚀
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==================== MAGIC BUTTON ====================
const MagicButton = ({ onOpenBudget }: { onOpenBudget: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playPop, playWhoosh } = useSound();

  const menuItems = [
    { icon: '💰', label: 'Pedir orçamento', action: () => { onOpenBudget(); setIsOpen(false); } },
    { icon: '🎨', label: 'Ver portfólio', href: '#portfolio' },
    { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/5500000000000' },
    { icon: '📸', label: 'Instagram', href: 'https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ==' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" id="magic-button">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {menuItems.map((item, i) => (
              item.action ? (
                <motion.button
                  key={i}
                  onClick={() => { item.action(); playPop(); }}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full border border-white/10 hover:border-purple-500/50 transition-all whitespace-nowrap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span>{item.icon}</span>
                  <span className="text-white text-sm">{item.label}</span>
                </motion.button>
              ) : (
                <motion.a
                  key={i}
                  href={item.href}
                  target={item.href?.startsWith('http') ? '_blank' : undefined}
                  rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => { setIsOpen(false); playPop(); }}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full border border-white/10 hover:border-purple-500/50 transition-all whitespace-nowrap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span>{item.icon}</span>
                  <span className="text-white text-sm">{item.label}</span>
                </motion.a>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => { setIsOpen(!isOpen); playWhoosh(); }}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <span className="text-2xl">{isOpen ? '✕' : '🎨'}</span>
      </motion.button>
    </div>
  );
};

// ==================== FOOTER ====================
const Footer = () => (
  <footer className="py-8 px-4 border-t border-white/10">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-gray-400 text-sm">
        © 2024 VAI UMA ARTE AÊ?! — Todos os direitos reservados
      </p>
      <div className="flex items-center gap-4">
        <a
          href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
      </div>
    </div>
  </footer>
);

// ==================== MAIN APP ====================
const MainApp = () => {
  const [showBudget, setShowBudget] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  const handleOpenAuth = () => {
    if (user) {
      setShowProfile(true);
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Particles />
      <Header onOpenAuth={handleOpenAuth} />

      <main>
        <HeroSection onOpenBudget={() => setShowBudget(true)} />
        <PortfolioSection onOpenBudget={() => setShowBudget(true)} />
        <ServicesSection />
        <StylesSection />
        <TestimonialsSection />
        <AboutSection />
        <CTASection onOpenBudget={() => setShowBudget(true)} />
      </main>

      <Footer />
      <MagicButton onOpenBudget={() => setShowBudget(true)} />
      <BudgetSimulator isOpen={showBudget} onClose={() => setShowBudget(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
};

// ==================== APP ====================
export function App() {
  return (
    <AuthProvider>
      <SoundProvider>
        <AccessibilityProvider>
          <MainApp />
        </AccessibilityProvider>
      </SoundProvider>
    </AuthProvider>
  );
}

export default App;
