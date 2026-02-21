import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, User, LogOut, Users, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole, hasPermission, type UserRole } from '@/services/admin';
import { UserAvatarWithFrame } from './UserBadge';

const navItems = [
  { name: 'Recursos', href: '#recursos' },
  { name: 'Planos', href: '#planos' },
  { name: 'Comunidade', href: '#comunidade' },
  { name: 'Educacional', href: '#educacional' },
];

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onOpenForum?: () => void;
  onOpenAdmin?: () => void;
}

export function Header({ onOpenAuth, onOpenDashboard, onOpenForum, onOpenAdmin }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  const userRole: UserRole = getUserRole(userProfile?.email || null, userProfile?.role);
  const canAccessAdmin = hasPermission(userRole, 'moderator');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 glass rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold gradient-text">VAI UMA ARTE</span>
                <span className="text-lg font-bold text-white"> AÊ?!</span>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
              {/* Forum Link */}
              {currentUser && onOpenForum && (
                <motion.button
                  onClick={onOpenForum}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-4 h-4" />
                  Fórum
                </motion.button>
              )}
            </nav>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  {/* Admin Button */}
                  {canAccessAdmin && onOpenAdmin && (
                    <motion.button
                      onClick={onOpenAdmin}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Painel Admin"
                    >
                      <Shield className="w-5 h-5" />
                    </motion.button>
                  )}
                  
                  {/* User Menu */}
                  <motion.button
                    onClick={onOpenDashboard}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserAvatarWithFrame
                      src={userProfile?.photoURL}
                      name={userProfile?.displayName || 'User'}
                      role={userRole}
                      size="sm"
                    />
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-medium text-white">{userProfile?.displayName}</p>
                      <p className="text-xs text-zinc-400">{userProfile?.points || 0} pts</p>
                    </div>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <motion.button
                    onClick={() => onOpenAuth('login')}
                    className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Entrar
                  </motion.button>
                  <motion.button
                    onClick={() => onOpenAuth('register')}
                    className="btn-primary text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Começar Grátis
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  {currentUser && onOpenForum && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenForum();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Fórum da Comunidade
                    </button>
                  )}
                  <div className="pt-4 flex flex-col gap-2">
                    {currentUser ? (
                      <>
                        {canAccessAdmin && onOpenAdmin && (
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onOpenAdmin();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <Shield className="w-4 h-4" />
                            Painel Admin
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onOpenDashboard();
                          }}
                          className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Meu Painel
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                          }}
                          className="btn-secondary w-full"
                        >
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onOpenAuth('login');
                          }}
                          className="btn-secondary w-full"
                        >
                          Entrar
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onOpenAuth('register');
                          }}
                          className="btn-primary w-full"
                        >
                          Começar Grátis
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
