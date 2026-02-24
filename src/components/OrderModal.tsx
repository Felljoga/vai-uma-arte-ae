import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder, type CreateOrderData } from '@/services/orders';
import toast from 'react-hot-toast';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    type: string;
    complexity: string;
    deadline: string;
    revisions: number;
    isCommercial: boolean;
    price: number;
  };
}

export function OrderModal({ isOpen, onClose, orderData }: OrderModalProps) {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const newOrderData: CreateOrderData = {
        userId: currentUser.uid,
        title: formData.title,
        description: formData.description,
        type: orderData.type as CreateOrderData['type'],
        complexity: orderData.complexity as CreateOrderData['complexity'],
        deadline: orderData.deadline as CreateOrderData['deadline'],
        revisions: orderData.revisions,
        isCommercial: orderData.isCommercial,
        price: orderData.price,
      };

      await createOrder(newOrderData);
      setSuccess(true);
      toast.success('Pedido criado com sucesso! 🎨');
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ title: '', description: '' });
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const typeLabels: Record<string, string> = {
    logo: 'Logo',
    social: 'Social Media',
    illustration: 'Ilustração',
    ui: 'UI Design',
    branding: 'Branding',
    package: 'Embalagem',
  };

  const complexityLabels: Record<string, string> = {
    simple: 'Simples',
    medium: 'Médio',
    complex: 'Complexo',
    premium: 'Premium',
  };

  const deadlineLabels: Record<string, string> = {
    urgent: '24h (Urgente)',
    fast: '3 dias (Rápido)',
    normal: '7 dias (Normal)',
    relaxed: '15 dias (Econômico)',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass rounded-2xl p-8 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Pedido Criado!</h2>
                <p className="text-zinc-400">
                  Você receberá atualizações por email e poderá acompanhar pelo painel.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-4">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Finalizar Pedido</h2>
                  <p className="text-zinc-400 text-sm">
                    Olá, {userProfile?.displayName}! Complete as informações abaixo.
                  </p>
                </div>

                {/* Order Summary */}
                <div className="glass-light rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tipo</span>
                    <span className="text-white">{typeLabels[orderData.type]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Complexidade</span>
                    <span className="text-white">{complexityLabels[orderData.complexity]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Prazo</span>
                    <span className="text-white">{deadlineLabels[orderData.deadline]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Revisões</span>
                    <span className="text-white">{orderData.revisions === -1 ? 'Ilimitadas' : orderData.revisions}</span>
                  </div>
                  {orderData.isCommercial && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Uso Comercial</span>
                      <span className="text-green-400">Incluso</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="gradient-text">R$ {orderData.price}</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">
                      Título do Pedido <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-modern w-full"
                      placeholder="Ex: Logo para minha startup"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">
                      Descrição / Briefing <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="input-modern w-full resize-none"
                      placeholder="Descreva o que você imagina para sua arte. Cores, estilo, referências..."
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                    <Sparkles className="w-5 h-5 text-green-400 shrink-0" />
                    <p className="text-sm text-green-200">
                      Você receberá atualizações em tempo real pelo chat!
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Confirmar Pedido
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-xs text-zinc-500 text-center mt-4">
                  Ao confirmar, você concorda com nossos termos de serviço.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
