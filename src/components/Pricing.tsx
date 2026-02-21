import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Building2, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    icon: Zap,
    description: 'Perfeito para começar',
    price: { monthly: 0, yearly: 0 },
    features: [
      '1 pedido por mês',
      '1 revisão por pedido',
      'Acesso à comunidade',
      'Suporte por email',
      'Marca d\'água nas entregas',
    ],
    cta: 'Começar Grátis',
    popular: false,
    gradient: 'from-zinc-600 to-zinc-700',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Star,
    description: 'Para criadores sérios',
    price: { monthly: 97, yearly: 970 },
    features: [
      '5 pedidos por mês',
      '3 revisões por pedido',
      'Prioridade na fila',
      'Sem marca d\'água',
      'Downloads em alta resolução',
      'Acesso a tutoriais premium',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
    popular: true,
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'studio',
    name: 'Studio',
    icon: Crown,
    description: 'Para times criativos',
    price: { monthly: 247, yearly: 2470 },
    features: [
      '15 pedidos por mês',
      'Revisões ilimitadas',
      'Entrega em até 48h',
      'Designer dedicado',
      'Arquivos editáveis',
      'Licença comercial inclusa',
      'Workspace para time (até 5)',
      'Analytics avançado',
      'Suporte 24/7 via chat',
    ],
    cta: 'Assinar Studio',
    popular: false,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'agency',
    name: 'Agency',
    icon: Building2,
    description: 'Soluções enterprise',
    price: { monthly: 0, yearly: 0 },
    customPrice: true,
    features: [
      'Pedidos ilimitados',
      'Time de designers exclusivo',
      'Entrega expressa garantida',
      'API de integração',
      'White-label disponível',
      'Contrato personalizado',
      'Gerente de conta dedicado',
      'SLA garantido',
      'Treinamento incluso',
    ],
    cta: 'Falar com Vendas',
    popular: false,
    gradient: 'from-amber-500 to-orange-500',
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="planos" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            Planos & Preços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Escolha o plano <span className="gradient-text">ideal</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            Do hobbyista ao enterprise. Temos o plano perfeito para sua necessidade.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 rounded-xl bg-white/5">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isYearly ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isYearly ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Anual
              <span className="ml-2 text-xs text-green-400">-17%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular ? 'glass glow-primary' : 'glass-light'
              } p-6 flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-semibold">
                  Mais Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>

              <div className="mb-6">
                {plan.customPrice ? (
                  <div className="text-3xl font-bold text-white">Sob consulta</div>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">
                      R$ {isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-zinc-400 text-sm">/mês</span>
                    )}
                    {isYearly && plan.price.yearly > 0 && (
                      <div className="text-sm text-green-400 mt-1">
                        R$ {plan.price.yearly}/ano
                      </div>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-400 mb-6">Garantias que oferecemos:</p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              '7 dias de teste grátis',
              'Cancele quando quiser',
              'Suporte humanizado',
              'Dinheiro de volta',
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-zinc-300">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
