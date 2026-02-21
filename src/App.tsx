import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Shield, Headphones } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Particles } from './components/Particles';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { BudgetSimulator } from './components/BudgetSimulator';
import { Pricing } from './components/Pricing';
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
import { getUserRole, hasPermission, type UserRole } from './services/admin';
import { updatePresence, setUserOffline } from './services/realtime';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [forumOpen, setForumOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminChatOpen, setAdminChatOpen] = useState(false);
  const [adminChatTarget, setAdminChatTarget] = useState<{ 
    recipientId: string; 
    recipientName: string; 
    orderId?: string; 
  } | null>(null);
  const { currentUser, userProfile } = useAuth();

  // Update user presence when logged in
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const userRole = getUserRole(userProfile.email || null, userProfile.role as UserRole);
    
    // Set user as online
    updatePresence(
      currentUser.uid,
      userProfile.displayName,
      userProfile.photoURL,
      userRole,
      true,
      'home'
    );

    // Set up interval to keep presence alive
    const interval = setInterval(() => {
      updatePresence(
        currentUser.uid,
        userProfile.displayName,
        userProfile.photoURL,
        userRole,
        true,
        'home'
      );
    }, 60000); // Update every minute

    // Handle page unload
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
        onOpenDashboard={() => setDashboardOpen(true)}
        onOpenForum={() => setForumOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* Budget Simulator */}
        <BudgetSimulator />
        
        {/* Pricing Plans */}
        <Pricing />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* Community */}
        <Community />
        
        {/* Education */}
        <Education />
        
        {/* Final CTA */}
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {currentUser && !chatOpen && !dashboardOpen && !forumOpen && !adminOpen && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Admin Button (only for mods+) */}
            {canAccessAdmin && (
              <>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAdminChatOpen(true)}
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
                  onClick={() => setAdminOpen(true)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
                  title="Painel Admin"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.button>
              </>
            )}

            {/* Forum Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setForumOpen(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
              title="Comunidade"
            >
              <Users className="w-5 h-5 text-white" />
            </motion.button>

            {/* Chat Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setChatOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
              title="Chat"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Dashboard */}
      <Dashboard 
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
      />

      {/* Global Chat */}
      <Chat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Forum */}
      <Forum
        isOpen={forumOpen}
        onClose={() => setForumOpen(false)}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onOpenChat={(userId, userName, orderId) => {
          setAdminChatTarget({ recipientId: userId, recipientName: userName, orderId });
          setAdminChatOpen(true);
          setAdminOpen(false);
        }}
      />

      {/* Admin Chat (for staff to chat with clients) */}
      <AdminChat
        isOpen={adminChatOpen}
        onClose={() => {
          setAdminChatOpen(false);
          setAdminChatTarget(null);
        }}
        initialTarget={adminChatTarget || undefined}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
