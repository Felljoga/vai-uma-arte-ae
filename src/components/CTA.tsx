import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Star } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Oferta especial por tempo limitado
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6">
            Pronto para transformar
            <br />
            <span className="gradient-text">suas ideias em arte?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
            Junte-se a mais de 50.000 criadores que já descobriram o poder do design sob demanda. 
            Comece grátis, sem cartão de crédito.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 glow-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Começar Agora — É Grátis
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-10 py-5 bg-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Agendar Demo
            </motion.button>
          </div>

          {/* Trust Elements */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Zap className="w-5 h-5 text-amber-400" />
              Setup em 2 minutos
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Shield className="w-5 h-5 text-green-400" />
              Sem compromisso
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              4.9/5 de 2.000+ avaliações
            </div>
          </div>

          {/* Urgency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-sm text-amber-200">
              <strong>127 pessoas</strong> se cadastraram nas últimas 24 horas
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
