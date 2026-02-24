import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Palette,
  FileText,
  Settings,
  LogOut,
  Crown,
  Star,
  Trophy,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight,
  Edit3,
  Camera,
  Sparkles,
  MessageSquare,
  Download,
  Eye,
  Menu,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { type Order } from '@/services/orders';
import { subscribeToUserOrders, subscribeToUserAchievements, type Achievement } from '@/services/realtime';
import { Chat } from './Chat';
import toast from 'react-hot-toast';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { id: 'profile', name: 'Meu Perfil', icon: User },
  { id: 'orders', name: 'Meus Pedidos', icon: FileText },
  { id: 'portfolio', name: 'Portfólio', icon: Palette },
  { id: 'settings', name: 'Configurações', icon: Settings },
];

const statusConfig = {
  pending: { label: 'Aguardando', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: AlertCircle },
  in_progress: { label: 'Em Andamento', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
  review: { label: 'Em Revisão', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Eye },
  completed: { label: 'Concluído', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-400/10', icon: X },
};

// Achievements will be loaded from realtime service

export function Dashboard({ isOpen, onClose }: DashboardProps) {
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{ id: string; title: string } | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editForm, setEditForm] = useState({
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
    preferredStyle: userProfile?.preferredStyle || 'moderno',
  });

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        preferredStyle: userProfile.preferredStyle || 'moderno',
      });
    }
  }, [userProfile]);

  // Subscribe to orders in real-time
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    setLoadingOrders(true);
    const unsubscribe = subscribeToUserOrders(currentUser.uid, (updatedOrders) => {
      setOrders(updatedOrders);
      setLoadingOrders(false);
    });

    return () => unsubscribe();
  }, [currentUser, isOpen]);

  // Subscribe to achievements in real-time
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const unsubscribe = subscribeToUserAchievements(currentUser.uid, (updatedAchievements) => {
      setAchievements(updatedAchievements);
    });

    return () => unsubscribe();
  }, [currentUser, isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Até logo! 👋');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao sair');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(editForm);
      setIsEditing(false);
      toast.success('Perfil atualizado! ✨');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar');
    }
  };

  const handleOpenChat = (order: Order) => {
    setSelectedOrder({ id: order.id, title: order.title });
    setChatOpen(true);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const planConfig = {
    free: { name: 'Free', color: 'text-zinc-400', gradient: 'from-zinc-500 to-zinc-600' },
    pro: { name: 'Pro', color: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500' },
    studio: { name: 'Studio', color: 'text-purple-400', gradient: 'from-purple-500 to-pink-500' },
    agency: { name: 'Agency', color: 'text-amber-400', gradient: 'from-amber-500 to-orange-500' },
  };

  const currentPlan = planConfig[userProfile?.plan || 'free'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dashboard Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[90%] lg:w-[80%] xl:w-[70%] max-w-5xl bg-zinc-900 border-l border-white/10 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-semibold text-white">
                {tabs.find((t) => t.id === activeTab)?.name}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sidebar - Desktop always visible, Mobile toggleable */}
            <AnimatePresence>
              {(mobileMenuOpen || window.innerWidth >= 768) && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className={`
                    ${mobileMenuOpen ? 'absolute inset-0 z-20 bg-zinc-900' : 'hidden'}
                    md:relative md:block md:w-64 lg:w-72 
                    border-r border-white/10 p-4 md:p-6 flex flex-col
                  `}
                >
                  {/* Mobile close button */}
                  {mobileMenuOpen && (
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="md:hidden flex items-center gap-2 text-zinc-400 hover:text-white mb-4"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Voltar
                    </button>
                  )}

                  {/* User Info */}
                  <div className="text-center mb-6 md:mb-8">
                    <div className="relative inline-block mb-3 md:mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl md:text-3xl font-bold">
                        {userProfile?.photoURL ? (
                          <img
                            src={userProfile.photoURL}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          userProfile?.displayName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br ${currentPlan.gradient} flex items-center justify-center border-2 border-zinc-900`}>
                        <Crown className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-white text-sm md:text-base truncate px-2">
                      {userProfile?.displayName}
                    </h3>
                    <p className={`text-xs md:text-sm ${currentPlan.color}`}>Plano {currentPlan.name}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
                    <div className="glass-light rounded-xl p-2 md:p-3 text-center">
                      <div className="text-base md:text-lg font-bold text-white">{userProfile?.points || 0}</div>
                      <div className="text-[10px] md:text-xs text-zinc-400">Pontos</div>
                    </div>
                    <div className="glass-light rounded-xl p-2 md:p-3 text-center">
                      <div className="text-base md:text-lg font-bold text-white">Nível {userProfile?.level || 1}</div>
                      <div className="text-[10px] md:text-xs text-zinc-400">Criador</div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-1 md:space-y-2 flex-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                        {tab.name}
                      </button>
                    ))}
                  </nav>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm md:text-base mt-4"
                  >
                    <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                    Sair da conta
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
              {/* Desktop Header */}
              <div className="hidden md:flex sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {tabs.find((t) => t.id === activeTab)?.name}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6 md:space-y-8">
                    {/* Profile Card */}
                    <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <h3 className="text-base md:text-lg font-semibold text-white">Informações do Perfil</h3>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 self-start"
                        >
                          <Edit3 className="w-4 h-4" />
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-zinc-400 block mb-2">Nome</label>
                            <input
                              type="text"
                              value={editForm.displayName}
                              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                              className="input-modern w-full"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-zinc-400 block mb-2">Bio</label>
                            <textarea
                              value={editForm.bio}
                              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                              rows={3}
                              className="input-modern w-full resize-none"
                              placeholder="Conte um pouco sobre você..."
                            />
                          </div>
                          <div>
                            <label className="text-sm text-zinc-400 block mb-2">Estilo Preferido</label>
                            <select
                              value={editForm.preferredStyle}
                              onChange={(e) => setEditForm({ ...editForm, preferredStyle: e.target.value })}
                              className="input-modern w-full"
                            >
                              <option value="moderno">Moderno</option>
                              <option value="minimalista">Minimalista</option>
                              <option value="colorido">Colorido</option>
                              <option value="vintage">Vintage</option>
                              <option value="futurista">Futurista</option>
                            </select>
                          </div>
                          <motion.button
                            onClick={handleSaveProfile}
                            className="btn-primary w-full sm:w-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Salvar Alterações
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className="relative shrink-0">
                              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl md:text-4xl font-bold">
                                {userProfile?.photoURL ? (
                                  <img
                                    src={userProfile.photoURL}
                                    alt=""
                                    className="w-full h-full rounded-2xl object-cover"
                                  />
                                ) : (
                                  userProfile?.displayName?.charAt(0).toUpperCase() || 'U'
                                )}
                              </div>
                              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-400 transition-colors">
                                <Camera className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-center sm:text-left flex-1 min-w-0">
                              <h4 className="text-lg md:text-xl font-semibold text-white truncate">{userProfile?.displayName}</h4>
                              <p className="text-zinc-400 text-sm truncate">{userProfile?.email}</p>
                              <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentPlan.gradient}`}>
                                <Crown className="w-3 h-3" />
                                Plano {currentPlan.name}
                              </span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-white/10">
                            <p className="text-sm text-zinc-400 mb-1">Bio</p>
                            <p className="text-white text-sm md:text-base">{userProfile?.bio || 'Nenhuma bio adicionada ainda.'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-400 mb-1">Estilo Preferido</p>
                            <p className="text-white capitalize text-sm md:text-base">{userProfile?.preferredStyle || 'Moderno'}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Achievements */}
                    <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        Conquistas
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
                        {achievements.slice(0, 6).map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`text-center ${!achievement.unlockedAt && 'opacity-30'}`}
                            title={achievement.description}
                          >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl mx-auto mb-2 ${
                              achievement.unlockedAt
                                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                                : 'bg-white/5'
                            }`}>
                              {achievement.icon}
                            </div>
                            <p className="text-[10px] md:text-xs text-zinc-400 truncate px-1">{achievement.name}</p>
                            {achievement.maxProgress && !achievement.unlockedAt && (
                              <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden mx-1">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                  style={{ width: `${Math.min(100, ((achievement.progress || 0) / achievement.maxProgress) * 100)}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                        <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-400 mx-auto mb-2 md:mb-3" />
                        <div className="text-xl md:text-2xl font-bold text-white">{userProfile?.points || 0}</div>
                        <p className="text-xs md:text-sm text-zinc-400">Pontos XP</p>
                      </div>
                      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-2 md:mb-3" />
                        <div className="text-xl md:text-2xl font-bold text-white">Nível {userProfile?.level || 1}</div>
                        <p className="text-xs md:text-sm text-zinc-400">Criador</p>
                      </div>
                      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                        <FileText className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 mx-auto mb-2 md:mb-3" />
                        <div className="text-xl md:text-2xl font-bold text-white">{userProfile?.ordersCount || 0}</div>
                        <p className="text-xs md:text-sm text-zinc-400">Pedidos</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-4 md:space-y-6">
                    {/* New Order CTA */}
                    <motion.button
                      className="w-full glass rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center justify-center gap-3 border-2 border-dashed border-indigo-500/30 hover:bg-indigo-500/5 transition-colors group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        onClose();
                        document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Plus className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm md:text-base">Novo Pedido</p>
                        <p className="text-xs md:text-sm text-zinc-400 truncate">Solicite uma nova arte personalizada</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
                    </motion.button>

                    {/* Orders List */}
                    {loadingOrders ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Nenhum pedido ainda</h3>
                        <p className="text-sm text-zinc-400">Crie seu primeiro pedido e comece sua jornada criativa!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {orders.map((order) => {
                          const status = statusConfig[order.status];
                          return (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="glass rounded-xl md:rounded-2xl p-3 md:p-4"
                            >
                              <div className="flex items-start gap-3 md:gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                                  <Palette className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-white text-sm md:text-base truncate">{order.title}</h4>
                                  <p className="text-xs md:text-sm text-zinc-400">
                                    {order.type} • {order.createdAt.toLocaleDateString('pt-BR')}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center gap-1 text-xs ${status.color} ${status.bg} px-2 py-1 rounded-full`}>
                                      <status.icon className="w-3 h-3" />
                                      {status.label}
                                    </span>
                                    <span className="text-sm font-semibold text-white">R$ {order.price}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                                <button
                                  onClick={() => handleOpenChat(order)}
                                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors text-sm"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="hidden sm:inline">Chat</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors text-sm">
                                  <Eye className="w-4 h-4" />
                                  <span className="hidden sm:inline">Detalhes</span>
                                </button>
                                {order.status === 'completed' && (
                                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-sm">
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Baixar</span>
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-6">
                    <div className="text-center py-8 md:py-12">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                        <Palette className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Seu Portfólio</h3>
                      <p className="text-zinc-400 max-w-md mx-auto mb-6 text-sm md:text-base px-4">
                        Adicione suas melhores criações para mostrar seu estilo e inspirar outros membros da comunidade.
                      </p>
                      <motion.button
                        className="btn-primary inline-flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Plus className="w-5 h-5" />
                        Adicionar Trabalho
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-4 md:space-y-6">
                    {/* Upgrade Card */}
                    {userProfile?.plan === 'free' && (
                      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-semibold text-white text-sm md:text-base">Faça upgrade para o Pro</h3>
                            <p className="text-xs md:text-sm text-zinc-400">Desbloqueie recursos exclusivos e prioridade</p>
                          </div>
                          <motion.button
                            className="btn-primary w-full sm:w-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Fazer Upgrade
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Settings Options */}
                    <div className="glass rounded-xl md:rounded-2xl divide-y divide-white/10">
                      {[
                        { label: 'Notificações por Email', description: 'Receba atualizações sobre seus pedidos' },
                        { label: 'Newsletter', description: 'Dicas, novidades e promoções exclusivas' },
                        { label: 'Perfil Público', description: 'Mostre seu perfil na comunidade' },
                      ].map((setting, index) => (
                        <div key={index} className="p-4 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-medium text-white text-sm md:text-base">{setting.label}</p>
                            <p className="text-xs md:text-sm text-zinc-400 truncate">{setting.description}</p>
                          </div>
                          <button className="w-12 h-7 rounded-full bg-indigo-500 p-1 shrink-0">
                            <div className="w-5 h-5 bg-white rounded-full ml-auto" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Danger Zone */}
                    <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 border border-red-500/30">
                      <h3 className="font-semibold text-red-400 mb-4 text-sm md:text-base">Zona de Perigo</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white text-sm md:text-base">Excluir Conta</p>
                          <p className="text-xs md:text-sm text-zinc-400">Esta ação é irreversível</p>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm w-full sm:w-auto">
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Chat Modal */}
          <Chat
            isOpen={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setSelectedOrder(null);
            }}
            orderId={selectedOrder?.id}
            orderTitle={selectedOrder?.title}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
