import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Juliana Ferreira',
    role: 'Empreendedora Digital',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    content: 'Finalmente encontrei uma plataforma que entende minhas necessidades! A comunicação pelo chat é super rápida e as artes ficam exatamente como eu imagino.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ricardo Almeida',
    role: 'Dono de E-commerce',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    content: 'O simulador de orçamento é genial! Consigo ver exatamente quanto vou pagar antes de fechar. Sem surpresas, sem pegadinhas. Adorei!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Camila Santos',
    role: 'Criadora de Conteúdo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    content: 'Meu feed do Instagram nunca esteve tão bonito! Os designers são incríveis e sempre captam exatamente o que eu preciso. Recomendo demais!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Bruno Costa',
    role: 'Pequeno Empresário',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    content: 'Precisava de uma logo urgente e conseguiram entregar em 24h com qualidade absurda. O chat em tempo real fez toda diferença no processo.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Fernanda Lima',
    role: 'Artesã',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    content: 'Nunca imaginei que seria tão fácil ter uma identidade visual profissional para meu negócio. O preço é justo e o resultado é incrível!',
    rating: 5,
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-amber-400" />
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            O que nossos <span className="gradient-text">clientes</span> dizem
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Mais de 50.000 criativos confiam em nossa plataforma todos os dias.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            {/* Navigation */}
            <motion.button
              onClick={prev}
              className="hidden md:flex w-12 h-12 rounded-full glass-light items-center justify-center text-zinc-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Main Card */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl w-full"
            >
              <div className="glass rounded-2xl p-8 text-center relative">
                <Quote className="absolute top-6 left-6 w-10 h-10 text-indigo-500/20" />
                
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-indigo-500/30"
                />

                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-zinc-200 mb-6 leading-relaxed">
                  "{testimonials[activeIndex].content}"
                </blockquote>

                <div>
                  <div className="font-semibold text-white">{testimonials[activeIndex].name}</div>
                  <div className="text-sm text-zinc-400">{testimonials[activeIndex].role}</div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.button
              onClick={next}
              className="hidden md:flex w-12 h-12 rounded-full glass-light items-center justify-center text-zinc-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
            <motion.button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-zinc-400"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={next}
              className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-zinc-400"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? 'w-8 bg-indigo-500' : 'bg-zinc-600 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: '2.000+', label: 'Avaliações' },
            { value: '4.9/5', label: 'Nota média' },
            { value: '98%', label: 'Satisfação' },
            { value: '24h', label: 'Resposta média' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
