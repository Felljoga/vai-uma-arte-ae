import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Building2, X, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PLANS, createPaymentSession, getPaymentLink } from '../services/payment';

interface PricingProps {
  onOpenAuth: () => void;
}

export default function Pricing({ onOpenAuth }: PricingProps) {
  const { currentUser, userProfile } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const plans = [
    {
      ...PLANS.free,
      icon: Zap,
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      ...PLANS.pro,
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      ...PLANS.studio,
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      popular: false
    },
    {
      ...PLANS.agency,
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      popular: false
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') return;
    
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (userProfile?.plan === planId) {
      return;
    }

    setLoading(planId);

    try {
      // Criar sessão de pagamento
      const billingCycle = isYearly ? 'yearly' : 'monthly';
      const newSessionId = await createPaymentSession(
        currentUser.uid,
        currentUser.email || '',
        planId,
        billingCycle
      );

      // Gerar link de pagamento
      const link = getPaymentLink(planId, billingCycle, newSessionId);

      setSelectedPlan(planId);
      setPaymentLink(link);
      setSessionId(newSessionId);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      alert('Erro ao processar. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const handleCopyLink = async () => {
    if (paymentLink) {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToPayment = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank');
      setShowInstructions(true);
    }
  };

  const selectedPlanData = selectedPlan ? plans.find(p => p.id === selectedPlan) : null;

  return (
    <section id="planos" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
            Planos Flexíveis
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-6 mb-4">
            Escolha seu{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              plano ideal
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Comece gratuitamente e escale conforme sua necessidade
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Mensal</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isYearly ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-500'}`}>
              Anual <span className="text-green-400 text-xs">-20%</span>
            </span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-500/20 to-pink-500/10 border-purple-500/50 scale-105'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              {userProfile?.plan === plan.id && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-medium">
                    Seu Plano
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                <plan.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-white">
                  R$ {isYearly ? plan.priceYearly.toFixed(0) : plan.price.toFixed(2).replace('.', ',')}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-400 text-sm">/{isYearly ? 'ano' : 'mês'}</span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading === plan.id || userProfile?.plan === plan.id}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  userProfile?.plan === plan.id
                    ? 'bg-green-500/20 text-green-400 cursor-default'
                    : plan.id === 'free'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {loading === plan.id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : userProfile?.plan === plan.id ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Plano Atual
                  </>
                ) : plan.id === 'free' ? (
                  'Começar Grátis'
                ) : (
                  'Assinar Agora'
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Garantia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">7 dias de garantia em todos os planos</span>
          </div>
        </motion.div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedPlanData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !showInstructions && setShowPaymentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full"
          >
            {!showInstructions ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Finalizar Assinatura</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedPlanData.color} bg-opacity-20 mb-6`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedPlanData.color} flex items-center justify-center`}>
                      <selectedPlanData.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Plano {selectedPlanData.name}</h4>
                      <p className="text-sm text-gray-300">
                        R$ {isYearly ? selectedPlanData.priceYearly.toFixed(2).replace('.', ',') : selectedPlanData.price.toFixed(2).replace('.', ',')} / {isYearly ? 'ano' : 'mês'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      Como funciona?
                    </h4>
                    <ol className="text-sm text-gray-400 space-y-2">
                      <li>1. Clique em "Ir para Pagamento"</li>
                      <li>2. Você será redirecionado ao Mercado Pago</li>
                      <li>3. Realize o pagamento (PIX, Cartão ou Boleto)</li>
                      <li>4. Seu plano será ativado automaticamente!</li>
                    </ol>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-xs">ID da sessão:</span>
                    <code className="text-xs bg-white/5 px-2 py-1 rounded">{sessionId?.slice(0, 20)}...</code>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGoToPayment}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ir para Pagamento
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Link Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar Link de Pagamento
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Pagamento seguro processado pelo Mercado Pago
                </p>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Página de pagamento aberta!</h3>
                  <p className="text-gray-400 mb-6">
                    Complete o pagamento na aba que foi aberta. Após a confirmação, seu plano será ativado automaticamente em alguns minutos.
                  </p>

                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
                    <p className="text-sm text-yellow-400">
                      ⚠️ Não feche esta página até concluir o pagamento. Após pagar, aguarde até 5 minutos para a ativação automática.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleGoToPayment}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir Página de Pagamento Novamente
                    </button>

                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setShowInstructions(false);
                      }}
                      className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
                    >
                      Fechar
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Problemas? Entre em contato pelo Instagram: @vaiumaarteaeofc
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
