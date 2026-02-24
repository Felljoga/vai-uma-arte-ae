import { motion } from 'framer-motion';
import { XCircle, ArrowRight, ArrowLeft, HelpCircle, MessageCircle } from 'lucide-react';

interface PaymentCancelledProps {
  onClose: () => void;
  onRetry: () => void;
}

export function PaymentCancelled({ onClose, onRetry }: PaymentCancelledProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md glass rounded-2xl p-8 text-center overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30"
          >
            <XCircle className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white mb-3"
          >
            Pagamento Cancelado
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 mb-6"
          >
            Você cancelou o processo de pagamento. Não se preocupe, nenhuma cobrança foi realizada.
          </motion.p>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-light rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Mudou de ideia?</p>
                <p className="text-xs text-zinc-400">
                  Você pode voltar e escolher outro plano ou tentar novamente a qualquer momento.
                  Se tiver dúvidas, entre em contato conosco.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <motion.button
              onClick={onRetry}
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Tentar novamente
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao início
            </motion.button>
          </motion.div>

          {/* Support Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <a
              href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Precisa de ajuda? Fale conosco no Instagram
            </a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
