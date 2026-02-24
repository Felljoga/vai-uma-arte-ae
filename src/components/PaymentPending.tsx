import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, Instagram, RefreshCw, Home } from 'lucide-react';

interface PaymentPendingProps {
  onClose: () => void;
  onCheckStatus: () => void;
}

export const PaymentPending: React.FC<PaymentPendingProps> = ({ onClose, onCheckStatus }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-3xl p-8 max-w-md w-full text-center border border-yellow-500/20 shadow-2xl shadow-yellow-500/10"
      >
        {/* Ícone */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Pagamento em Processamento
        </h2>
        
        <p className="text-gray-400 mb-6">
          Seu pagamento está sendo processado. Isso pode levar alguns minutos.
        </p>

        {/* Info Box */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 text-sm font-medium mb-1">
                O que acontece agora?
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Se você pagou com boleto, aguarde a compensação (1-2 dias úteis)</li>
                <li>• Se você pagou com PIX, o pagamento será confirmado em segundos</li>
                <li>• Você receberá um email quando o pagamento for confirmado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={onCheckStatus}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Verificar Status
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-white/10 rounded-xl font-semibold text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar ao Site
          </button>
        </div>

        {/* Suporte */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-3">Precisa de ajuda?</p>
          <a
            href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
          >
            <Instagram className="w-4 h-4" />
            Falar com suporte no Instagram
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPending;
