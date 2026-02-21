import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, RefreshCw, Briefcase, Image, Palette, PenTool, MonitorPlay, Package, Calculator, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderModal } from './OrderModal';
import { AuthModal } from './AuthModal';

const artTypes = [
  { id: 'logo', name: 'Logo', icon: Sparkles, basePrice: 150 },
  { id: 'social', name: 'Social Media', icon: Image, basePrice: 80 },
  { id: 'illustration', name: 'Ilustração', icon: PenTool, basePrice: 200 },
  { id: 'ui', name: 'UI Design', icon: MonitorPlay, basePrice: 300 },
  { id: 'branding', name: 'Branding', icon: Palette, basePrice: 500 },
  { id: 'package', name: 'Embalagem', icon: Package, basePrice: 350 },
];

const complexityLevels = [
  { id: 'simple', name: 'Simples', multiplier: 1, description: 'Design limpo e direto' },
  { id: 'medium', name: 'Médio', multiplier: 1.5, description: 'Detalhes moderados' },
  { id: 'complex', name: 'Complexo', multiplier: 2.2, description: 'Alta complexidade visual' },
  { id: 'premium', name: 'Premium', multiplier: 3, description: 'Nível artístico máximo' },
];

const deadlines = [
  { id: 'urgent', name: '24h', multiplier: 2, label: 'Urgente' },
  { id: 'fast', name: '3 dias', multiplier: 1.5, label: 'Rápido' },
  { id: 'normal', name: '7 dias', multiplier: 1, label: 'Normal' },
  { id: 'relaxed', name: '15 dias', multiplier: 0.9, label: 'Econômico' },
];

const revisionOptions = [
  { id: 1, name: '1 revisão', price: 0 },
  { id: 3, name: '3 revisões', price: 50 },
  { id: 5, name: '5 revisões', price: 100 },
  { id: -1, name: 'Ilimitadas', price: 200 },
];

export function BudgetSimulator() {
  const { currentUser } = useAuth();
  const [selectedType, setSelectedType] = useState(artTypes[0]);
  const [complexity, setComplexity] = useState(complexityLevels[1]);
  const [deadline, setDeadline] = useState(deadlines[2]);
  const [revisions, setRevisions] = useState(revisionOptions[1]);
  const [isCommercial, setIsCommercial] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const totalPrice = useMemo(() => {
    let price = selectedType.basePrice;
    price *= complexity.multiplier;
    price *= deadline.multiplier;
    price += revisions.price;
    if (isCommercial) price *= 1.3;
    return Math.round(price);
  }, [selectedType, complexity, deadline, revisions, isCommercial]);

  const savings = useMemo(() => {
    const originalPrice = selectedType.basePrice * 3 * 2; // max complexity, urgent
    return Math.round(((originalPrice - totalPrice) / originalPrice) * 100);
  }, [totalPrice, selectedType]);

  const handleRequestOrder = () => {
    if (currentUser) {
      setOrderModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const orderData = {
    type: selectedType.id,
    complexity: complexity.id,
    deadline: deadline.id,
    revisions: revisions.id,
    isCommercial,
    price: totalPrice,
  };

  return (
    <section id="recursos" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" />
            Simulador Inteligente
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simule seu <span className="gradient-text">orçamento</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Configure sua arte ideal e veja o valor em tempo real. Transparência total, sem surpresas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Art Type */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-400" />
                Tipo de Arte
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedType.id === type.id
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <type.icon className="w-5 h-5 mb-2" />
                    <span className="font-medium">{type.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Nível de Complexidade
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {complexityLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    onClick={() => setComplexity(level)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      complexity.id === level.id
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium block">{level.name}</span>
                    <span className="text-xs opacity-75">{level.description}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Deadline & Revisions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Prazo de Entrega
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {deadlines.map((d) => (
                    <motion.button
                      key={d.id}
                      onClick={() => setDeadline(d)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        deadline.id === d.id
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-bold block">{d.name}</span>
                      <span className="text-xs opacity-75">{d.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-green-400" />
                  Revisões
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {revisionOptions.map((r) => (
                    <motion.button
                      key={r.id}
                      onClick={() => setRevisions(r)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        revisions.id === r.id
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium">{r.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Commercial Use */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Uso Comercial</h3>
                    <p className="text-sm text-zinc-400">Direitos de uso para fins comerciais</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsCommercial(!isCommercial)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    isCommercial ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-zinc-700'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                    animate={{ x: isCommercial ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Price Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <div className="glass rounded-2xl p-6 glow-primary">
              <div className="text-center mb-6">
                <span className="text-sm text-zinc-400 font-medium">Valor Estimado</span>
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold gradient-text mt-2"
                >
                  R$ {totalPrice}
                </motion.div>
                {savings > 0 && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                    Economize até {savings}%
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{selectedType.name}</span>
                  <span className="text-white">R$ {selectedType.basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Complexidade ({complexity.name})</span>
                  <span className="text-white">x{complexity.multiplier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Prazo ({deadline.name})</span>
                  <span className="text-white">x{deadline.multiplier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">{revisions.name}</span>
                  <span className="text-white">+R$ {revisions.price}</span>
                </div>
                {isCommercial && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Uso Comercial</span>
                    <span className="text-white">+30%</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">R$ {totalPrice}</span>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={handleRequestOrder}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentUser ? 'Solicitar Arte' : 'Criar Conta para Solicitar'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <button className="btn-secondary w-full">
                  Falar com Especialista
                </button>
              </div>

              <div className="mt-6 space-y-2">
                {['Garantia de satisfação', 'Pagamento seguro', 'Suporte 24/7'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        orderData={orderData}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="register"
      />
    </section>
  );
}
