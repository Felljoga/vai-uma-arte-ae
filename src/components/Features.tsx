import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Palette, Clock, MessageSquare, Layers, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Entrega Expressa',
    description: 'Receba suas artes em até 24 horas com nosso serviço de entrega urgente disponível 24/7.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Garantia Total',
    description: 'Satisfação garantida ou seu dinheiro de volta. Revisões ilimitadas em planos premium.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'Preview Automático',
    description: 'Visualize como sua arte ficará em mockups reais antes mesmo de aprovar o design.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: MessageSquare,
    title: 'Chat em Tempo Real',
    description: 'Comunique-se diretamente com seu designer através do nosso chat integrado.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Clock,
    title: 'Timeline Visual',
    description: 'Acompanhe cada etapa do seu pedido com nossa linha do tempo interativa.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Layers,
    title: 'Arquivos Editáveis',
    description: 'Receba arquivos fonte em PSD, AI, Figma e outros formatos editáveis.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description: 'Acesse a plataforma de qualquer dispositivo com experiência otimizada.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Sparkles,
    title: 'Designers Qualificados',
    description: 'Nossa equipe é formada por profissionais experientes e apaixonados por design.',
    gradient: 'from-purple-500 to-pink-500',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Diferenciais
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Por que somos <span className="gradient-text">únicos</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tecnologia de ponta combinada com talento humano para criar experiências extraordinárias.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group glass-light rounded-2xl p-6 card-hover"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
