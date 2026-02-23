import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Crown, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PLANS, confirmPayment } from '../services/payment';

interface PaymentSuccessProps {
  sessionId: string;
  paymentId?: string;
  onClose: () => void;
}

type PlanKey = keyof typeof PLANS;

export default function PaymentSuccess({ sessionId, paymentId, onClose }: PaymentSuccessProps) {
  const { refreshUserProfile, userProfile } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (sessionId && paymentId) {
          await confirmPayment(sessionId, paymentId);
        }
        await refreshUserProfile();
      } catch (err) {
        console.error('Erro ao processar pagamento:', err);
        setError('Seu pagamento está sendo processado. Aguarde alguns minutos.');
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [sessionId, paymentId, refreshUserProfile]);

  const planKey = (userProfile?.plan || 'free') as PlanKey;
  const currentPlan = PLANS[planKey];

  const planIcons = {
    free: Sparkles,
    pro: Sparkles,
    studio: Crown,
    agency: Building2
  };

  const PlanIcon = planIcons[planKey] || Sparkles;

  if (processing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Processando pagamento...</h3>
          <p className="text-gray-400">Aguarde um momento</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Pagamento Confirmado! 🎉
        </h2>
        <p className="text-gray-400 mb-6">
          {error || 'Seu plano foi ativado com sucesso. Aproveite todos os benefícios!'}
        </p>

        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <PlanIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-400">Seu plano atual</p>
              <p className="font-semibold text-white">{currentPlan?.name || 'Pro'}</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-left">
            {currentPlan?.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
        >
          Começar a usar
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
