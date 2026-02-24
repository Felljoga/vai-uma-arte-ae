import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Zap, Palette, Instagram } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAudio } from '@/contexts/AudioContext';

const stats = [
  { icon: Users, value: '50K+', label: 'Criativos' },
  { icon: Palette, value: '200K+', label: 'Artes Criadas' },
  { icon: Star, value: '4.9', label: 'Avaliação' },
];

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
];

export function Hero() {
  const { currentUser } = useAuth();
  const { playClick } = useAudio();

  const scrollToSimulator = () => {
    playClick();
    document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-zinc-300">
              Plataforma 100% brasileira — <span className="text-white">Começar agora</span>
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Sua visão,</span>
            <br />
            <span className="gradient-text">nossa arte.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            A plataforma de design sob demanda mais moderna do Brasil.
            Crie artes únicas, personalize seu estilo e transforme suas ideias em realidade.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              onClick={scrollToSimulator}
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentUser ? 'Solicitar Arte' : 'Começar Gratuitamente'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.a
              href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Instagram className="w-5 h-5" />
              Nosso Instagram
            </motion.a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-zinc-900 object-cover"
                  />
                ))}
              </div>
              <span className="ml-4 text-sm text-zinc-400">
                <span className="text-white font-semibold">+5.000</span> novos usuários este mês
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-zinc-400">
                <span className="text-white font-semibold">4.9/5</span> de 2.000+ avaliações
              </span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-3">
                  <stat.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 relative"
          >
            <div className="relative glass rounded-2xl p-2 max-w-5xl mx-auto glow-primary">
              <div className="aspect-video bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-xl overflow-hidden relative">
                {/* Mock Dashboard Preview */}
                <div className="absolute inset-0 p-6">
                  <div className="flex gap-4 h-full">
                    {/* Sidebar */}
                    <div className="w-16 bg-white/5 rounded-xl p-3 flex flex-col items-center gap-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-indigo-500' : 'bg-white/10'}`} />
                      ))}
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      <div className="h-8 w-48 bg-white/10 rounded-lg" />
                      <div className="grid grid-cols-3 gap-4 h-32">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4">
                            <div className="h-4 w-20 bg-white/10 rounded mb-2" />
                            <div className="h-6 w-16 bg-indigo-500/50 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="bg-white/5 rounded-xl" />
                        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -left-4 sm:top-10 sm:-left-10 glass-light rounded-xl p-4 hidden sm:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Pedido Concluído</div>
                  <div className="text-xs text-zinc-400">Agora mesmo</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -right-4 sm:bottom-20 sm:-right-10 glass-light rounded-xl p-4 hidden sm:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Nova arte criada!</div>
                  <div className="text-xs text-zinc-400">+150 curtidas</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
