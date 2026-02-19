import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { AppProvider, useApp } from '@/contexts/AppContext';

// ============ ICONS ============
const Icons = {
  Sound: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  SoundOff: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Instagram: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Play: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  Accessibility: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

// ============ PARTICLES BACKGROUND ============
const ParticlesBackground = () => {
  const { reducedMotion } = useApp();
  
  if (reducedMotion) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#3b82f6' : '#22d3ee',
            boxShadow: `0 0 ${10 + Math.random() * 10}px currentColor`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 1, 1, 0],
            rotate: 720,
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// ============ LOADER ============
const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-display gradient-text mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          VAI UMA ARTE AÊ?!
        </motion.h1>
        
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <motion.p
          className="mt-4 text-white/50 font-body text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Preparando o universo criativo...
        </motion.p>
        
        <motion.div
          className="mt-8 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-purple-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============ HEADER ============
const Header = () => {
  const { soundEnabled, toggleSound, isDarkMode, toggleTheme, playClick } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Portfólio', 'Serviços', 'Estilos', 'Depoimentos', 'Sobre'];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-dark py-3' : 'py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            className="font-display text-2xl gradient-text"
            whileHover={{ scale: 1.05 }}
            onClick={() => playClick()}
          >
            VAI UMA ARTE AÊ?!
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/70 hover:text-white font-body text-sm transition-colors"
                whileHover={{ y: -2 }}
                onClick={() => playClick()}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => { toggleSound(); playClick(); }}
              className="p-2 rounded-full glass hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
            >
              {soundEnabled ? <Icons.Sound /> : <Icons.SoundOff />}
            </motion.button>
            
            <motion.button
              onClick={() => { toggleTheme(); playClick(); }}
              className="p-2 rounded-full glass hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isDarkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
            </motion.button>

            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-3 text-white/70 hover:text-white font-body border-b border-white/10"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { setMobileMenuOpen(false); playClick(); }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// ============ HERO SECTION ============
const HeroSection = () => {
  const { playWhoosh, playPop, reducedMotion } = useApp();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={reducedMotion ? {} : { y }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        
        {/* Animated gradient orbs */}
        {!reducedMotion && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -30, 0],
                y: [0, 50, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </>
        )}
      </motion.div>

      <motion.div 
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={reducedMotion ? {} : { opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-2 mb-6 text-sm font-body text-purple-300 glass rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            ✨ Estúdio criativo de design
          </motion.span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display mb-6 leading-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="gradient-text glow-text">VAI UMA</span>
          <br />
          <span className="text-white">ARTE AÊ?!</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/70 font-body mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Design que faz <span className="text-purple-400">barulho</span>. 
          Sua marca, <span className="text-blue-400">impossível de ignorar</span>.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="#portfolio"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-heading font-semibold text-white overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => playWhoosh()}
            onClick={() => playPop()}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Quero minha arte agora
              <Icons.ArrowRight />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>

          <motion.a
            href="#portfolio"
            className="px-8 py-4 glass rounded-full font-heading font-semibold text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playPop()}
          >
            Ver portfólio
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ============ PORTFOLIO SECTION ============
const portfolioItems = [
  { id: 1, title: 'Identidade Neon Club', category: 'identidade', color: 'from-purple-500 to-pink-500' },
  { id: 2, title: 'Feed @streetwear.br', category: 'social', color: 'from-orange-500 to-red-500' },
  { id: 3, title: 'Flyer Festival 2024', category: 'flyers', color: 'from-cyan-500 to-blue-500' },
  { id: 4, title: 'Capa EP "Noite"', category: 'capas', color: 'from-indigo-500 to-purple-500' },
  { id: 5, title: 'Motion Logo Reveal', category: 'motion', color: 'from-green-500 to-teal-500' },
  { id: 6, title: 'Stories Fitness Pro', category: 'social', color: 'from-rose-500 to-orange-500' },
];

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);
  const { playClick, playWhoosh, playGlitch } = useApp();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filters = ['todos', 'social', 'identidade', 'flyers', 'capas', 'motion'];
  
  const filteredItems = activeFilter === 'todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfólio" ref={ref} className="py-20 md:py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 font-body text-sm uppercase tracking-wider">Portfólio</span>
          <h2 className="text-4xl md:text-6xl font-display mt-2 text-white">
            Galeria de <span className="gradient-text">impacto</span>
          </h2>
          <p className="text-white/60 font-body mt-4 max-w-xl mx-auto">
            Cada projeto é uma história visual. Clica sem medo pra ver mais.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {filters.map(filter => (
            <motion.button
              key={filter}
              onClick={() => { setActiveFilter(filter); playClick(); }}
              className={`px-5 py-2 rounded-full font-body text-sm capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'glass text-white/70 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => { setSelectedItem(item); playGlitch(); }}
                onMouseEnter={() => playWhoosh()}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <motion.span 
                    className="text-white/70 text-sm font-body capitalize mb-1"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                  >
                    {item.category}
                  </motion.span>
                  <h3 className="text-xl font-heading font-semibold text-white">
                    {item.title}
                  </h3>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="px-6 py-3 glass rounded-full text-white font-body">
                    Ver projeto
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="glass rounded-3xl p-8 max-w-lg w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={`aspect-video rounded-xl bg-gradient-to-br ${selectedItem.color} mb-6`} />
              <span className="text-purple-400 text-sm capitalize">{selectedItem.category}</span>
              <h3 className="text-2xl font-heading font-semibold text-white mt-1">{selectedItem.title}</h3>
              <p className="text-white/60 font-body mt-3">
                Uma criação que combina estética moderna com impacto visual. 
                Feita pra chamar atenção e gerar engajamento.
              </p>
              <div className="flex gap-3 mt-6">
                <motion.a
                  href="#"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-center font-heading text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playClick()}
                >
                  Quero um igual
                </motion.a>
                <motion.button
                  onClick={() => { setSelectedItem(null); playClick(); }}
                  className="px-6 py-3 glass rounded-full text-white/70 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                >
                  Fechar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ============ SERVICES SECTION ============
const services = [
  { icon: '🎨', title: 'Identidade Visual', desc: 'Logo, cores, tipografia. Tudo pra sua marca ter cara própria.', power: 'Presença' },
  { icon: '📱', title: 'Artes p/ Instagram', desc: 'Feed, Stories, Reels covers. Seu perfil vai ficar criminoso.', power: 'Engajamento' },
  { icon: '🎬', title: 'Artes p/ TikTok', desc: 'Capas, thumbnails, identidade visual pra bombar.', power: 'Viralização' },
  { icon: '📄', title: 'Flyers & Banners', desc: 'Eventos, promoções, lançamentos. Visual que converte.', power: 'Conversão' },
  { icon: '💿', title: 'Capas & Thumbnails', desc: 'YouTube, Spotify, podcasts. Sua arte na capa.', power: 'Cliques' },
  { icon: '✨', title: 'Motion Design', desc: 'Animações que dão vida às suas artes.', power: 'Impacto' },
  { icon: '📦', title: 'Pacotes Mensais', desc: 'Artes ilimitadas* com atendimento VIP.', power: 'Economia' },
];

const ServicesSection = () => {
  const { playHover, playClick } = useApp();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="serviços" ref={ref} className="py-20 md:py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="text-blue-400 font-body text-sm uppercase tracking-wider">Serviços</span>
          <h2 className="text-4xl md:text-6xl font-display mt-2 text-white">
            Menu de <span className="gradient-text">poderes</span>
          </h2>
          <p className="text-white/60 font-body mt-4">
            Escolhe teu poder. A gente faz a mágica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <motion.span 
                className="text-4xl block mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {service.icon}
              </motion.span>
              
              <h3 className="text-xl font-heading font-semibold text-white mb-2">
                {service.title}
              </h3>
              
              <p className="text-white/60 font-body text-sm mb-4">
                {service.desc}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-body text-purple-400 glass px-3 py-1 rounded-full">
                  +{service.power}
                </span>
                <motion.span
                  className="text-white/50 group-hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ STYLE PICKER SECTION ============
const styles = [
  { id: 'minimal', name: 'Minimalista', colors: ['#ffffff', '#000000', '#888888'], preview: 'bg-gradient-to-br from-white to-gray-200' },
  { id: 'neon', name: 'Neon Futurista', colors: ['#a855f7', '#3b82f6', '#22d3ee'], preview: 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500' },
  { id: 'street', name: 'Street / Urbano', colors: ['#f97316', '#fbbf24', '#1a1a1a'], preview: 'bg-gradient-to-br from-orange-500 via-yellow-500 to-black' },
  { id: 'luxury', name: 'Luxo / Premium', colors: ['#d4af37', '#1a1a1a', '#f5f5f5'], preview: 'bg-gradient-to-br from-yellow-600 via-black to-gray-100' },
  { id: 'cute', name: 'Cute / Pastel', colors: ['#f9a8d4', '#a78bfa', '#67e8f9'], preview: 'bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300' },
];

const StylePickerSection = () => {
  const { styleTheme, setStyleTheme, playPop, playGlitch } = useApp();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="estilos" ref={ref} className="py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="text-cyan-400 font-body text-sm uppercase tracking-wider">Experiência</span>
          <h2 className="text-4xl md:text-6xl font-display mt-2 text-white">
            Qual é o seu <span className="gradient-text">estilo</span>?
          </h2>
          <p className="text-white/60 font-body mt-4">
            Clica e vê a vibe mudar em tempo real ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {styles.map((style, i) => (
            <motion.button
              key={style.id}
              className={`relative aspect-square rounded-2xl overflow-hidden ${
                styleTheme === style.id ? 'ring-4 ring-white' : ''
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStyleTheme(style.id); playPop(); playGlitch(); }}
            >
              <div className={`absolute inset-0 ${style.preview}`} />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white font-heading font-semibold text-sm">
                  {style.name}
                </span>
              </div>
              
              {styleTheme === style.id && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-purple-600">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/50 font-body text-sm">
            Estilo selecionado: <span className="text-white">{styles.find(s => s.id === styleTheme)?.name}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ============ TESTIMONIALS SECTION ============
const testimonials = [
  { name: 'Marina @marinafit', msg: 'GENTE eu tô passada com o feed novo!! Triplicou meu engajamento 😭🔥', stars: 5, emoji: '💪' },
  { name: 'Lucas Beats', msg: 'Nunca vi uma capa de EP tão insana. O povo só elogia', stars: 5, emoji: '🎵' },
  { name: 'Café Artístico', msg: 'Nossa identidade visual ficou PERFEITA. Clientes novos todo dia', stars: 5, emoji: '☕' },
  { name: 'DJ Neon', msg: 'Os flyers dos meus eventos viraram referência. Valeu demais!', stars: 5, emoji: '🎧' },
];

const TestimonialsSection = () => {
  const { playHover } = useApp();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="depoimentos" ref={ref} className="py-20 md:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="text-pink-400 font-body text-sm uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-4xl md:text-6xl font-display mt-2 text-white">
            O que tão <span className="gradient-text">falando</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => playHover()}
            >
              {/* Chat bubble style */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                  {t.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-heading font-semibold text-white">{t.name}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(t.stars)].map((_, j) => (
                        <Icons.Star key={j} />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/80 font-body bg-white/5 rounded-2xl rounded-tl-none p-4">
                    {t.msg}
                  </p>
                </div>
              </div>
              
              {/* Audio visual fake */}
              <div className="flex items-center gap-2 mt-4 ml-16 text-white/30">
                <Icons.Play />
                <div className="flex gap-0.5">
                  {[...Array(20)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="w-1 bg-purple-500/50 rounded-full"
                      style={{ height: `${8 + Math.random() * 16}px` }}
                      animate={{ height: [`${8 + Math.random() * 16}px`, `${8 + Math.random() * 16}px`] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-xs">0:12</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ ABOUT SECTION ============
const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre" ref={ref} className="py-20 md:py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <Icons.Sparkles />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-display text-white mb-8">
            A gente não faz <span className="gradient-text">só arte</span>.
          </h2>

          <div className="space-y-4 text-xl md:text-2xl font-body text-white/70">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              A gente cria <span className="text-white">presença</span>.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Aquela que faz a pessoa <span className="text-purple-400">parar o scroll</span>.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              Aquela que faz sua marca ser <span className="text-blue-400">impossível de ignorar</span>.
            </motion.p>
          </div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-body text-white/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            {['100+ projetos', '50+ clientes felizes', '3 anos de mercado', '∞ criatividade'].map((stat, i) => (
              <span key={i} className="glass px-4 py-2 rounded-full">{stat}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============ CTA SECTION ============
const CTASection = () => {
  const { playPop, playWhoosh } = useApp();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-display text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          Bora deixar sua marca{' '}
          <span className="gradient-text glow-text">impossível de ignorar</span>?
        </motion.h2>

        <motion.p
          className="text-xl text-white/60 font-body mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          Vai uma arte aê?! 🎨
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full font-heading font-semibold text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => playWhoosh()}
            onClick={() => playPop()}
          >
            <Icons.WhatsApp />
            Chamar no WhatsApp
          </motion.a>

          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-heading font-semibold text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => playWhoosh()}
            onClick={() => playPop()}
          >
            <Icons.Instagram />
            Seguir no Instagram
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

// ============ FOOTER ============
const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-xl gradient-text">VAI UMA ARTE AÊ?!</span>
        <p className="text-white/40 font-body text-sm">
          © 2024 - Feito com 💜 e muito café
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Icons.Instagram />
          </a>
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Icons.WhatsApp />
          </a>
        </div>
      </div>
    </footer>
  );
};

// ============ MAGIC BUTTON ============
const MagicButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { playPop, playGlitch, playClick } = useApp();

  const menuItems = [
    { icon: '💰', label: 'Pedir orçamento', href: '#' },
    { icon: '🎨', label: 'Ver portfólio', href: '#portfólio' },
    { icon: <Icons.WhatsApp />, label: 'WhatsApp', href: 'https://wa.me/5500000000000' },
    { icon: <Icons.Instagram />, label: 'Instagram', href: 'https://instagram.com' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-48"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
          >
            {menuItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 mb-2 glass rounded-xl text-white hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: -5 }}
                onClick={() => playClick()}
              >
                <span className="text-lg">{typeof item.icon === 'string' ? item.icon : item.icon}</span>
                <span className="font-body text-sm">{item.label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg glow-purple"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          playPop();
          if (!isOpen) playGlitch();
        }}
        animate={isOpen ? {} : {
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-2xl"
          animate={{ rotate: isOpen ? 45 : 0 }}
        >
          {isOpen ? '✕' : '🎨'}
        </motion.span>
        
        {/* Pulse ring */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Label */}
      {!isOpen && (
        <motion.span
          className="absolute -left-32 top-1/2 -translate-y-1/2 px-3 py-1 glass rounded-full text-sm font-body text-white whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          Vai uma arte aê?!
        </motion.span>
      )}
    </div>
  );
};

// ============ ACCESSIBILITY PANEL ============
const AccessibilityPanel = () => {
  const { reducedMotion, toggleReducedMotion, highContrast, toggleHighContrast, playClick } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-14 left-0 w-56 glass rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-white font-heading font-semibold mb-4">Acessibilidade</h3>
            
            <label className="flex items-center justify-between mb-3 cursor-pointer">
              <span className="text-white/70 font-body text-sm">Reduzir movimento</span>
              <button
                onClick={() => { toggleReducedMotion(); playClick(); }}
                className={`w-10 h-6 rounded-full transition-colors ${
                  reducedMotion ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  className="w-4 h-4 bg-white rounded-full m-1"
                  animate={{ x: reducedMotion ? 16 : 0 }}
                />
              </button>
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-white/70 font-body text-sm">Alto contraste</span>
              <button
                onClick={() => { toggleHighContrast(); playClick(); }}
                className={`w-10 h-6 rounded-full transition-colors ${
                  highContrast ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <motion.div
                  className="w-4 h-4 bg-white rounded-full m-1"
                  animate={{ x: highContrast ? 16 : 0 }}
                />
              </button>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-12 h-12 rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); playClick(); }}
        aria-label="Acessibilidade"
      >
        <Icons.Accessibility />
      </motion.button>
    </div>
  );
};

// ============ SOUND PROMPT ============
const SoundPrompt = () => {
  const { soundEnabled, toggleSound, playPop } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (soundEnabled || dismissed) return null;

  return (
    <motion.div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 2 }}
    >
      <motion.button
        className="flex items-center gap-2 px-6 py-3 glass rounded-full text-white font-body hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          toggleSound();
          playPop();
          setDismissed(true);
        }}
      >
        <span>🎧</span>
        Ativar experiência sonora
      </motion.button>
      
      <button
        className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full text-white text-xs hover:bg-white/30"
        onClick={() => setDismissed(true)}
        aria-label="Fechar"
      >
        ✕
      </button>
    </motion.div>
  );
};

// ============ MAIN APP ============
const MainApp = () => {
  const [loading, setLoading] = useState(true);
  const { isDarkMode, reducedMotion, highContrast } = useApp();

  return (
    <div 
      className={`min-h-screen ${
        isDarkMode ? 'bg-[#0a0a0f] text-white' : 'bg-slate-50 text-slate-900 light-mode'
      } ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''}`}
    >
      {/* Grain overlay */}
      <div className="grain" />
      
      {/* Particles */}
      <ParticlesBackground />

      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Header />
            <main>
              <HeroSection />
              <PortfolioSection />
              <ServicesSection />
              <StylePickerSection />
              <TestimonialsSection />
              <AboutSection />
              <CTASection />
            </main>
            <Footer />
            <MagicButton />
            <AccessibilityPanel />
            <SoundPrompt />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
