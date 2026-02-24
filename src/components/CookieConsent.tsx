import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check, ChevronDown, ChevronUp, Shield, BarChart3, Target, Sparkles } from 'lucide-react';

interface CookiePreferences {
  essential: boolean; // Sempre true
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'vuaa_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'vuaa_cookie_preferences';

export function CookieConsent({ onOpenCookiePolicy }: { onOpenCookiePolicy: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    preferences: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    // Verifica se já tem consentimento
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Mostra o banner após 1 segundo
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Carrega preferências salvas
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const saveConsent = (type: 'all' | 'essential' | 'custom') => {
    let finalPreferences: CookiePreferences;

    switch (type) {
      case 'all':
        finalPreferences = {
          essential: true,
          preferences: true,
          analytics: true,
          marketing: true
        };
        break;
      case 'essential':
        finalPreferences = {
          essential: true,
          preferences: false,
          analytics: false,
          marketing: false
        };
        break;
      case 'custom':
        finalPreferences = { ...preferences, essential: true };
        break;
      default:
        finalPreferences = preferences;
    }

    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPreferences));
    setPreferences(finalPreferences);
    setIsVisible(false);

    // Dispara evento personalizado para outros componentes
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: finalPreferences }));
  };

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essenciais',
      description: 'Necessários para o funcionamento do site. Não podem ser desativados.',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      required: true
    },
    {
      id: 'preferences',
      name: 'Preferências',
      description: 'Lembram suas configurações como tema, idioma e preferências de áudio.',
      icon: Settings,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      required: false
    },
    {
      id: 'analytics',
      name: 'Análise',
      description: 'Nos ajudam a entender como você usa o site para melhorá-lo.',
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Usados para mostrar anúncios relevantes para você.',
      icon: Target,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      required: false
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Header */}
              <div className="p-4 md:p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        Cookies Deliciosos! 🍪
                      </h3>
                      <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white md:hidden"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm md:text-base text-zinc-300 mt-2">
                      Usamos cookies para tornar sua experiência ainda mais incrível! 
                      Eles nos ajudam a lembrar suas preferências, manter você logado e 
                      entender como podemos melhorar a plataforma.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookie Options (Expanded) */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6 border-t border-white/10 bg-white/5">
                      <h4 className="font-semibold text-white mb-4">Personalizar Cookies</h4>
                      <div className="space-y-3">
                        {cookieTypes.map((cookie) => (
                          <div
                            key={cookie.id}
                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-lg ${cookie.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <cookie.icon className={`w-5 h-5 ${cookie.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{cookie.name}</span>
                                {cookie.required && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-300">
                                    Obrigatório
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-400 truncate md:whitespace-normal">
                                {cookie.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={preferences[cookie.id as keyof CookiePreferences]}
                                onChange={(e) => {
                                  if (!cookie.required) {
                                    setPreferences({
                                      ...preferences,
                                      [cookie.id]: e.target.checked
                                    });
                                  }
                                }}
                                disabled={cookie.required}
                                className="sr-only peer"
                              />
                              <div className={`w-11 h-6 rounded-full peer transition-colors ${
                                cookie.required
                                  ? 'bg-green-500 cursor-not-allowed'
                                  : 'bg-zinc-700 peer-checked:bg-indigo-500'
                              } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5`} />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="p-4 md:p-6 border-t border-white/10 bg-black/20">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Toggle Details Button */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    {showDetails ? 'Ocultar Opções' : 'Personalizar'}
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Cookie Policy Link */}
                  <button
                    onClick={onOpenCookiePolicy}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Cookie className="w-4 h-4" />
                    Política de Cookies
                  </button>

                  <div className="flex-1" />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {showDetails ? (
                      <motion.button
                        onClick={() => saveConsent('custom')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className="w-4 h-4" />
                        Salvar Preferências
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => saveConsent('essential')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Apenas Essenciais
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() => saveConsent('all')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm shadow-lg shadow-orange-500/25"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="w-4 h-4" />
                      Aceitar Todos
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook para verificar consentimento de cookies
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const loadConsent = () => {
      const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (hasConsent) {
        const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        if (preferences) {
          setConsent(JSON.parse(preferences));
        }
      }
    };

    loadConsent();

    // Escuta mudanças no consentimento
    const handleConsentUpdate = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail);
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    };
  }, []);

  return consent;
}

// Botão flutuante para reabrir configurações de cookies
export function CookieSettingsButton({ onClick }: { onClick: () => void }) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(!!localStorage.getItem(COOKIE_CONSENT_KEY));
  }, []);

  if (!hasConsent) return null;

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-4 left-4 z-40 w-10 h-10 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-500/30 hover:text-amber-300 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Configurações de Cookies"
    >
      <Cookie className="w-5 h-5" />
    </motion.button>
  );
}

// Componente para resetar consentimento (para testes ou configurações)
export function resetCookieConsent() {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  localStorage.removeItem(COOKIE_PREFERENCES_KEY);
  window.location.reload();
}
