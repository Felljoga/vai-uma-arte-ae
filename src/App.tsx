import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Shield, Headphones, Volume2 } from 'lucide-react';
import PaymentSuccess from './components/PaymentSuccess';
import { PaymentCancelled } from './components/PaymentCancelled';
import { PaymentPending } from './components/PaymentPending';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import { Particles } from './components/Particles';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { BudgetSimulator } from './components/BudgetSimulator';
import Pricing from './components/Pricing';
import { Community } from './components/Community';
import { Education } from './components/Education';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import { Forum } from './components/Forum';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminChat } from './components/AdminChat';
import { Partners, PartnersSection } from './components/Partners';
import { AudioSettings } from './components/AudioSettings';
import { AudioControls } from './components/AudioControls';
import { CommunityHub } from './components/CommunityHub';
import { LegalPages } from './components/LegalPages';
import { CookieConsent } from './components/CookieConsent';
import { ResourcesPages } from './components/ResourcesPages';
import { CompanyPages } from './components/CompanyPages';
import { ProductPages } from './components/ProductPages';
import { getUserRole, hasPermission, type UserRole } from './services/admin';
import { updatePresence, setUserOffline } from './services/realtime';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [forumOpen, setForumOpen] = useState(false);
  const [communityHubOpen, setCommunityHubOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminChatOpen, setAdminChatOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  
  // Legal pages states
  const [legalPageOpen, setLegalPageOpen] = useState(false);
  const [currentLegalPage, setCurrentLegalPage] = useState<'privacy' | 'terms' | 'cookies' | 'licenses'>('privacy');
  
  // Resources pages states
  const [resourcesPageOpen, setResourcesPageOpen] = useState(false);
  const [currentResourcePage, setCurrentResourcePage] = useState<'help' | 'docs' | 'guides' | 'status'>('help');
  
  // Company pages states
  const [companyPageOpen, setCompanyPageOpen] = useState(false);
  const [currentCompanyPage, setCurrentCompanyPage] = useState<'about' | 'blog' | 'careers'>('about');
  
  // Product pages states
  const [productPageOpen, setProductPageOpen] = useState(false);
  const [currentProductPage, setCurrentProductPage] = useState<'features' | 'pricing' | 'community' | 'educational'>('features');
  const [adminChatTarget, setAdminChatTarget] = useState<{ 
    recipientId: string; 
    recipientName: string; 
    orderId?: string; 
  } | null>(null);
  
  // Payment states
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [paymentCancelledOpen, setPaymentCancelledOpen] = useState(false);
  const [paymentPendingOpen, setPaymentPendingOpen] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  
  const { currentUser, userProfile } = useAuth();
  const { playModal, playClick, playSuccess, playError, settings } = useAudio();

  // Check for payment callback in URL hash
  useEffect(() => {
    const checkUrlCallback = () => {
      const hash = window.location.hash;
      
      if (hash.includes('/pagamento/sucesso')) {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const sessionId = params.get('session') || params.get('external_reference');
        const pId = params.get('payment_id') || params.get('collection_id');
        
        if (sessionId) {
          setPaymentSessionId(sessionId);
          setPaymentId(pId || undefined);
          setPaymentSuccessOpen(true);
          playSuccess();
        }
        
        window.history.replaceState(null, '', window.location.pathname);
      } else if (hash.includes('/pagamento/cancelado') || hash.includes('/pagamento/erro')) {
        setPaymentCancelledOpen(true);
        playError();
        window.history.replaceState(null, '', window.location.pathname);
      } else if (hash.includes('/pagamento/pendente')) {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const sessionId = params.get('session') || params.get('external_reference');
        
        if (sessionId) {
          setPaymentSessionId(sessionId);
          setPaymentPendingOpen(true);
        }
        
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    checkUrlCallback();
    
    window.addEventListener('hashchange', checkUrlCallback);
    return () => window.removeEventListener('hashchange', checkUrlCallback);
  }, [playSuccess, playError]);

  // Update user presence when logged in
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const userRole = getUserRole(userProfile.email || null, userProfile.role as UserRole);
    
    updatePresence(
      currentUser.uid,
      userProfile.displayName,
      userProfile.photoURL,
      userRole,
      true,
      'home'
    );

    const interval = setInterval(() => {
      updatePresence(
        currentUser.uid,
        userProfile.displayName,
        userProfile.photoURL,
        userRole,
        true,
        'home'
      );
    }, 60000);

    const handleUnload = () => {
      setUserOffline(currentUser.uid);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      setUserOffline(currentUser.uid);
    };
  }, [currentUser, userProfile]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    playModal();
  };

  const handleOpenModal = (setter: (open: boolean) => void) => {
    playModal();
    setter(true);
  };

  const handleCloseModal = (setter: (open: boolean) => void) => {
    playClick();
    setter(false);
  };

  const userRole: UserRole = getUserRole(userProfile?.email || null, userProfile?.role);
  const canAccessAdmin = hasPermission(userRole, 'moderator');

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(24, 24, 27, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Animated Particles Background */}
      <Particles />
      
      {/* Navigation */}
      <Header 
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={() => handleOpenModal(setDashboardOpen)}
        onOpenForum={() => handleOpenModal(setForumOpen)}
        onOpenCommunity={() => handleOpenModal(setCommunityHubOpen)}
        onOpenAdmin={() => handleOpenModal(setAdminOpen)}
        onOpenPartners={() => handleOpenModal(setPartnersOpen)}
      />
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Features />
        <BudgetSimulator />
        <Pricing onOpenAuth={() => handleOpenAuth('register')} />
        <Testimonials />
        <PartnersSection onOpenPartners={() => handleOpenModal(setPartnersOpen)} />
        <Community />
        <Education />
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer 
        onOpenPrivacy={() => {
          setCurrentLegalPage('privacy');
          setLegalPageOpen(true);
        }}
        onOpenTerms={() => {
          setCurrentLegalPage('terms');
          setLegalPageOpen(true);
        }}
        onOpenCookies={() => {
          setCurrentLegalPage('cookies');
          setLegalPageOpen(true);
        }}
        onOpenLicenses={() => {
          setCurrentLegalPage('licenses');
          setLegalPageOpen(true);
        }}
        onOpenHelp={() => {
          setCurrentResourcePage('help');
          setResourcesPageOpen(true);
        }}
        onOpenDocs={() => {
          setCurrentResourcePage('docs');
          setResourcesPageOpen(true);
        }}
        onOpenGuides={() => {
          setCurrentResourcePage('guides');
          setResourcesPageOpen(true);
        }}
        onOpenStatus={() => {
          setCurrentResourcePage('status');
          setResourcesPageOpen(true);
        }}
        onOpenAbout={() => {
          setCurrentCompanyPage('about');
          setCompanyPageOpen(true);
        }}
        onOpenBlog={() => {
          setCurrentCompanyPage('blog');
          setCompanyPageOpen(true);
        }}
        onOpenCareers={() => {
          setCurrentCompanyPage('careers');
          setCompanyPageOpen(true);
        }}
        onOpenPartners={() => handleOpenModal(setPartnersOpen)}
        onOpenFeatures={() => {
          setCurrentProductPage('features');
          setProductPageOpen(true);
        }}
        onOpenPricing={() => {
          setCurrentProductPage('pricing');
          setProductPageOpen(true);
        }}
        onOpenCommunity={() => {
          setCurrentProductPage('community');
          setProductPageOpen(true);
        }}
        onOpenEducational={() => {
          setCurrentProductPage('educational');
          setProductPageOpen(true);
        }}
      />

      {/* Audio Controls - Flutuante */}
      <AudioControls />

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {currentUser && !chatOpen && !dashboardOpen && !forumOpen && !adminOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Audio Settings Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playClick();
                setAudioSettingsOpen(true);
              }}
              className={`w-10 h-10 rounded-full ${
                settings.enabled 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-zinc-700'
              } flex items-center justify-center shadow-lg transition-all`}
              title="Configurações de Som"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </motion.button>

            {canAccessAdmin && (
              <>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenModal(setAdminChatOpen)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow"
                  title="Chat com Clientes"
                >
                  <Headphones className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenModal(setAdminOpen)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
                  title="Painel Admin"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.button>
              </>
            )}

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOpenModal(setForumOpen)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
              title="Comunidade"
            >
              <Users className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOpenModal(setChatOpen)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
              title="Chat"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Audio Settings */}
      <AudioSettings 
        isOpen={audioSettingsOpen}
        onClose={() => setAudioSettingsOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => handleCloseModal(setAuthModalOpen)}
        initialMode={authMode}
      />

      {/* Dashboard */}
      <Dashboard 
        isOpen={dashboardOpen}
        onClose={() => handleCloseModal(setDashboardOpen)}
      />

      {/* Global Chat */}
      <Chat
        isOpen={chatOpen}
        onClose={() => handleCloseModal(setChatOpen)}
      />

      {/* Forum */}
      <Forum
        isOpen={forumOpen}
        onClose={() => handleCloseModal(setForumOpen)}
      />

      {/* Partners */}
      <Partners
        isOpen={partnersOpen}
        onClose={() => handleCloseModal(setPartnersOpen)}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => handleCloseModal(setAdminOpen)}
        onOpenChat={(userId: string, userName: string, orderId?: string) => {
          setAdminChatTarget({ recipientId: userId, recipientName: userName, orderId });
          handleOpenModal(setAdminChatOpen);
          setAdminOpen(false);
        }}
      />

      {/* Admin Chat */}
      <AdminChat
        isOpen={adminChatOpen}
        onClose={() => {
          handleCloseModal(setAdminChatOpen);
          setAdminChatTarget(null);
        }}
        initialTarget={adminChatTarget || undefined}
      />

      {/* Payment Success Modal */}
      <AnimatePresence>
        {paymentSuccessOpen && paymentSessionId && (
          <PaymentSuccess
            sessionId={paymentSessionId}
            paymentId={paymentId}
            onClose={() => {
              setPaymentSuccessOpen(false);
              setPaymentSessionId(null);
              setPaymentId(undefined);
            }}
          />
        )}
      </AnimatePresence>

      {/* Payment Cancelled Modal */}
      <AnimatePresence>
        {paymentCancelledOpen && (
          <PaymentCancelled
            onClose={() => setPaymentCancelledOpen(false)}
            onRetry={() => {
              setPaymentCancelledOpen(false);
              document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {/* Payment Pending Modal */}
      <AnimatePresence>
        {paymentPendingOpen && paymentSessionId && (
          <PaymentPending
            onClose={() => {
              setPaymentPendingOpen(false);
              setPaymentSessionId(null);
            }}
            onCheckStatus={() => {
              // Refresh the page to check status
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>

      {/* Legal Pages */}
      <LegalPages 
        isOpen={legalPageOpen}
        onClose={() => setLegalPageOpen(false)}
        page={currentLegalPage}
      />

      {/* Resources Pages */}
      <ResourcesPages 
        isOpen={resourcesPageOpen}
        onClose={() => setResourcesPageOpen(false)}
        initialPage={currentResourcePage}
      />

      {/* Company Pages */}
      <CompanyPages 
        isOpen={companyPageOpen}
        onClose={() => setCompanyPageOpen(false)}
        initialPage={currentCompanyPage}
        onOpenPartners={() => {
          setCompanyPageOpen(false);
          handleOpenModal(setPartnersOpen);
        }}
      />

      {/* Product Pages */}
      <ProductPages 
        isOpen={productPageOpen}
        onClose={() => setProductPageOpen(false)}
        initialPage={currentProductPage}
        onOpenAuth={() => handleOpenAuth('register')}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent 
        onOpenCookiePolicy={() => {
          setCurrentLegalPage('cookies');
          setLegalPageOpen(true);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </AuthProvider>
  );
}
