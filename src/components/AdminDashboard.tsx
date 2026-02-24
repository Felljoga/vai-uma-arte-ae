import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Shield,
  Check,
  Ban,
  Eye,
  Search,
  Loader2,
  Settings,
  BarChart3,
  AlertTriangle,
  MessageCircle,
  Circle,
  Plus,
  Trash2,
  Star,
  ExternalLink,
  Handshake,
  Clock,
  XCircle,
  CheckCircle,
  Instagram,
  Youtube,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatarWithFrame, UserBadge } from './UserBadge';
import {
  updateUserRole,
  updateUserPlan,
  banUser,
  unbanUser,
  adminUpdateOrderStatus,
  hasPermission,
  getUserRole,
  type AdminUser,
  type AdminOrder,
  type PlatformStats,
  type UserRole,
} from '@/services/admin';
import { activatePlanManually, PLANS } from '@/services/payment';
import {
  subscribeToAllPresence,
  type UserPresence,
} from '@/services/realtime';
// Partners imports
import {
  subscribeToDiscordServers,
  addDiscordServer,
  updateDiscordServer,
  deleteDiscordServer,
  toggleDiscordServerFeatured,
  subscribeToPartnerApplications,
  subscribeToAllPartners,
  approvePartnerApplication,
  rejectPartnerApplication,
  removePartner,
  suspendPartner,
  reactivatePartner,
  togglePartnerFeatured,
  PARTNER_CATEGORIES,
  type DiscordServerEmbed,
  type PartnerCategory,
  type PartnerApplication,
  type Partner,
} from '@/services/partners';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat?: (userId: string, userName: string, orderId?: string) => void;
}

// Discord icon component
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

export function AdminDashboard({ isOpen, onClose, onOpenChat }: AdminDashboardProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'partnerships' | 'discord' | 'settings'>('overview');
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeUsers: 0,
    newUsersToday: 0,
    newOrdersToday: 0,
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Discord servers state
  const [discordServers, setDiscordServers] = useState<DiscordServerEmbed[]>([]);
  const [showAddDiscordModal, setShowAddDiscordModal] = useState(false);
  const [discordForm, setDiscordForm] = useState({
    serverId: '',
    name: '',
    description: '',
    inviteLink: '',
    category: 'community' as PartnerCategory,
    isOfficial: false,
    isFeatured: false,
  });
  const [savingDiscord, setSavingDiscord] = useState(false);

  // Partner applications state
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>([]);
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [partnerSubTab, setPartnerSubTab] = useState<'applications' | 'partners'>('applications');
  const [processingPartner, setProcessingPartner] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const currentUserRole = getUserRole(userProfile?.email || null, userProfile?.role);
  const canManageUsers = hasPermission(currentUserRole, 'admin');
  const isOwner = currentUserRole === 'owner';

  // Subscribe to real-time data
  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    const unsubscribers: (() => void)[] = [];

    // Subscribe to online users in real-time
    const unsubOnline = subscribeToAllPresence((presenceUsers) => {
      setOnlineUsers(presenceUsers.filter(u => u.isOnline));
    });
    unsubscribers.push(unsubOnline);

    // Subscribe to users in real-time
    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'), limit(100));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData: AdminUser[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email || '',
          displayName: data.displayName || 'Sem nome',
          photoURL: data.photoURL || null,
          role: getUserRole(data.email, data.role),
          plan: data.plan || 'free',
          points: data.points || 0,
          level: data.level || 1,
          ordersCount: data.ordersCount || 0,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          lastLogin: (data.lastLogin as Timestamp)?.toDate(),
          isOnline: data.isOnline || false,
          isBanned: data.isBanned || false,
          banReason: data.banReason,
        };
      });
      setUsers(usersData);
      
      // Update total users stat
      setStats(prev => ({ ...prev, totalUsers: usersData.length }));
      
      // Count new users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newToday = usersData.filter(u => u.createdAt >= today).length;
      setStats(prev => ({ ...prev, newUsersToday: newToday }));
      
      setLoading(false);
    }, (error) => {
      console.error('Error loading users:', error);
      setLoading(false);
    });
    unsubscribers.push(unsubUsers);

    // Subscribe to orders in real-time
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(100));
    const unsubOrders = onSnapshot(ordersQuery, async (snapshot) => {
      let totalRevenue = 0;
      let pendingOrders = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let newOrdersToday = 0;

      const ordersData: AdminOrder[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate() || new Date();
        
        // Calculate stats
        if (data.status === 'completed') {
          totalRevenue += data.price || 0;
        }
        if (data.status === 'pending') {
          pendingOrders++;
        }
        if (createdAt >= today) {
          newOrdersToday++;
        }

        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName || 'Usuário',
          title: data.title || 'Sem título',
          type: data.type || 'outro',
          price: data.price || 0,
          status: data.status || 'pending',
          createdAt,
        };
      });
      
      setOrders(ordersData);
      setStats(prev => ({
        ...prev,
        totalOrders: ordersData.length,
        totalRevenue,
        pendingOrders,
        newOrdersToday,
      }));
    });
    unsubscribers.push(unsubOrders);

    // Subscribe to Discord servers
    const unsubDiscord = subscribeToDiscordServers((servers) => {
      setDiscordServers(servers);
    });
    unsubscribers.push(unsubDiscord);

    // Subscribe to partner applications
    const unsubApplications = subscribeToPartnerApplications((applications) => {
      setPartnerApplications(applications);
    });
    unsubscribers.push(unsubApplications);

    // Subscribe to all partners
    const unsubPartners = subscribeToAllPartners((partners) => {
      setAllPartners(partners);
    });
    unsubscribers.push(unsubPartners);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isOpen]);

  // Update active users count when online users change
  useEffect(() => {
    setStats(prev => ({ ...prev, activeUsers: onlineUsers.length }));
  }, [onlineUsers]);

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('Cargo atualizado!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar cargo');
    }
  };

  const handleUpdatePlan = async (userId: string, plan: string) => {
    try {
      await updateUserPlan(userId, plan);
      toast.success('Plano atualizado!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar plano');
    }
  };

  const handleActivatePlanWithExpiry = async (userId: string, planId: string, billingCycle: 'monthly' | 'yearly') => {
    try {
      await activatePlanManually(userId, planId, billingCycle, 'manual_activation');
      toast.success(`Plano ${PLANS[planId as keyof typeof PLANS]?.name} ativado com sucesso!`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao ativar plano');
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      await banUser(userId, reason);
      toast.success('Usuário banido');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao banir usuário');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUser(userId);
      toast.success('Usuário desbanido');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao desbanir usuário');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await adminUpdateOrderStatus(orderId, status);
      toast.success('Status atualizado!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (order) =>
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Add Discord Server
  const handleAddDiscordServer = async () => {
    if (!discordForm.serverId.trim() || !discordForm.name.trim() || !discordForm.inviteLink.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setSavingDiscord(true);
    try {
      await addDiscordServer(discordForm, userProfile?.uid || '');
      toast.success('Servidor adicionado com sucesso! 🎉');
      setShowAddDiscordModal(false);
      setDiscordForm({
        serverId: '',
        name: '',
        description: '',
        inviteLink: '',
        category: 'community',
        isOfficial: false,
        isFeatured: false,
      });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao adicionar servidor');
    } finally {
      setSavingDiscord(false);
    }
  };

  // Handle Delete Discord Server
  const handleDeleteDiscordServer = async (serverId: string) => {
    if (!confirm('Tem certeza que deseja remover este servidor?')) return;
    
    try {
      await deleteDiscordServer(serverId);
      toast.success('Servidor removido');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover servidor');
    }
  };

  // Handle Toggle Featured Discord Server
  const handleToggleDiscordFeatured = async (serverId: string, currentFeatured: boolean) => {
    try {
      await toggleDiscordServerFeatured(serverId, !currentFeatured);
      toast.success(currentFeatured ? 'Removido dos destaques' : 'Adicionado aos destaques');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar servidor');
    }
  };

  // Handle Toggle Official Discord Server
  const handleToggleDiscordOfficial = async (serverId: string, currentOfficial: boolean) => {
    try {
      await updateDiscordServer(serverId, { isOfficial: !currentOfficial });
      toast.success(currentOfficial ? 'Removido como oficial' : 'Marcado como oficial');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar servidor');
    }
  };

  // Handle approve partner application
  const handleApprovePartner = async (application: PartnerApplication) => {
    if (!userProfile?.uid) return;
    
    setProcessingPartner(application.id);
    try {
      await approvePartnerApplication(application.id, userProfile.uid);
      toast.success(`Parceria com ${application.name} aprovada! 🎉`);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao aprovar parceria');
    } finally {
      setProcessingPartner(null);
    }
  };

  // Handle reject partner application
  const handleRejectPartner = async () => {
    if (!userProfile?.uid || !selectedApplication) return;
    if (!rejectionReason.trim()) {
      toast.error('Informe o motivo da rejeição');
      return;
    }
    
    setProcessingPartner(selectedApplication.id);
    try {
      await rejectPartnerApplication(selectedApplication.id, userProfile.uid, rejectionReason);
      toast.success('Solicitação rejeitada');
      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionReason('');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao rejeitar solicitação');
    } finally {
      setProcessingPartner(null);
    }
  };

  // Handle remove partner
  const handleRemovePartner = async (partner: Partner) => {
    if (!confirm(`Tem certeza que deseja remover o parceiro "${partner.name}"?`)) return;
    
    setProcessingPartner(partner.id);
    try {
      await removePartner(partner.id, partner.userId);
      toast.success('Parceiro removido');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover parceiro');
    } finally {
      setProcessingPartner(null);
    }
  };

  // Handle suspend partner
  const handleSuspendPartner = async (partner: Partner) => {
    setProcessingPartner(partner.id);
    try {
      await suspendPartner(partner.id, partner.userId);
      toast.success('Parceiro suspenso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao suspender parceiro');
    } finally {
      setProcessingPartner(null);
    }
  };

  // Handle reactivate partner
  const handleReactivatePartner = async (partner: Partner) => {
    setProcessingPartner(partner.id);
    try {
      await reactivatePartner(partner.id, partner.userId);
      toast.success('Parceiro reativado');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao reativar parceiro');
    } finally {
      setProcessingPartner(null);
    }
  };

  // Handle toggle partner featured
  const handleTogglePartnerFeatured = async (partnerId: string, currentFeatured: boolean) => {
    try {
      await togglePartnerFeatured(partnerId, !currentFeatured);
      toast.success(currentFeatured ? 'Removido dos destaques' : 'Adicionado aos destaques');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar parceiro');
    }
  };

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.some(u => u.uid === userId);
  };

  // Check permission
  if (!hasPermission(currentUserRole, 'moderator')) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass rounded-2xl p-8 text-center z-10">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
              <p className="text-zinc-400">Você não tem permissão para acessar esta área.</p>
              <button onClick={onClose} className="btn-primary mt-6">
                Fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-2 md:inset-4 lg:inset-8 bg-zinc-900 rounded-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-zinc-950">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Painel Administrativo</h1>
                  <div className="flex items-center gap-2">
                    <UserBadge role={currentUserRole} size="sm" />
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current" />
                      {onlineUsers.length} online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 md:px-6 py-2 border-b border-white/10 overflow-x-auto">
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                { id: 'users', label: 'Usuários', icon: Users },
                { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
                { id: 'partnerships', label: 'Parcerias', icon: Handshake, badge: partnerApplications.filter(a => a.status === 'pending').length },
                { id: 'discord', label: 'Discord', icon: DiscordIcon },
                { id: 'settings', label: 'Configurações', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {'badge' in tab && typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyan-500 text-white text-xs min-w-[18px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass rounded-xl p-4 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                              <Users className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-sm text-zinc-400">Total Usuários</span>
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            {stats.totalUsers}
                          </div>
                          <div className="text-xs text-green-400 mt-1">
                            +{stats.newUsersToday} hoje
                          </div>
                        </div>

                        <div className="glass rounded-xl p-4 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-sm text-zinc-400">Total Pedidos</span>
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            {stats.totalOrders}
                          </div>
                          <div className="text-xs text-green-400 mt-1">
                            +{stats.newOrdersToday} hoje
                          </div>
                        </div>

                        <div className="glass rounded-xl p-4 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-sm text-zinc-400">Receita Total</span>
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            R$ {stats.totalRevenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            De pedidos concluídos
                          </div>
                        </div>

                        <div className="glass rounded-xl p-4 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="text-sm text-zinc-400">Pendentes</span>
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            {stats.pendingOrders}
                          </div>
                          <div className="text-xs text-amber-400 mt-1">
                            Aguardando ação
                          </div>
                        </div>
                      </div>

                      {/* Online Users Bar */}
                      <div className="glass rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-white flex items-center gap-2">
                            <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                            Usuários Online Agora ({onlineUsers.length})
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {onlineUsers.slice(0, 20).map((user) => (
                            <div
                              key={user.uid}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                            >
                              <div className="relative">
                                <img
                                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=6366f1&color=fff&size=24`}
                                  alt={user.displayName}
                                  className="w-5 h-5 rounded-full"
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-zinc-900" />
                              </div>
                              <span className="text-xs text-white">{user.displayName}</span>
                              <UserBadge role={user.role} size="sm" showLabel={false} />
                            </div>
                          ))}
                          {onlineUsers.length === 0 && (
                            <p className="text-sm text-zinc-500">Nenhum usuário online</p>
                          )}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recent Users */}
                        <div className="glass rounded-xl p-4 md:p-6">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" />
                            Usuários Recentes
                          </h3>
                          <div className="space-y-3">
                            {users.slice(0, 5).map((user) => (
                              <div
                                key={user.uid}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                              >
                                <div className="relative">
                                  <UserAvatarWithFrame
                                    src={user.photoURL}
                                    name={user.displayName}
                                    role={user.role}
                                    size="sm"
                                  />
                                  {isUserOnline(user.uid) && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {user.displayName}
                                  </p>
                                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                </div>
                                <UserBadge role={user.role} size="sm" showLabel={false} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="glass rounded-xl p-4 md:p-6">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-purple-400" />
                            Pedidos Recentes
                          </h3>
                          <div className="space-y-3">
                            {orders.slice(0, 5).map((order) => (
                              <div
                                key={order.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                              >
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">
                                    {order.title}
                                  </p>
                                  <p className="text-xs text-zinc-500">por {order.userName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-green-400">
                                    R$ {order.price}
                                  </span>
                                  {onOpenChat && (
                                    <button
                                      onClick={() => onOpenChat(order.userId, order.userName, order.id)}
                                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                                      title="Conversar"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Users Tab */}
                  {activeTab === 'users' && (
                    <div className="space-y-4">
                      {/* Search */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar usuários..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Users List (Mobile-friendly) */}
                      <div className="space-y-3">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.uid}
                            className="glass rounded-xl p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <UserAvatarWithFrame
                                  src={user.photoURL}
                                  name={user.displayName}
                                  role={user.role}
                                  size="md"
                                />
                                {isUserOnline(user.uid) && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-900" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-white">{user.displayName}</p>
                                  <UserBadge role={user.role} size="sm" />
                                  {user.isBanned && (
                                    <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                                      <Ban className="w-3 h-3" /> Banido
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-zinc-400 truncate">{user.email}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                                  <span>{user.points} pts</span>
                                  <span>Nível {user.level}</span>
                                  <span>{user.ordersCount} pedidos</span>
                                  <span className="capitalize">{user.plan}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            {canManageUsers && user.role !== 'owner' && (
                              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateRole(user.uid, e.target.value as UserRole)}
                                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
                                  disabled={!isOwner && user.role === 'admin'}
                                >
                                  <option value="member">Membro</option>
                                  <option value="client">Cliente</option>
                                  <option value="moderator">Moderador</option>
                                  {isOwner && <option value="admin">Admin</option>}
                                </select>

                                <select
                                  value={user.plan}
                                  onChange={(e) => {
                                    const newPlan = e.target.value;
                                    if (newPlan === 'free') {
                                      handleUpdatePlan(user.uid, newPlan);
                                    } else {
                                      // Perguntar se é mensal ou anual
                                      const cycle = window.confirm('Ativar como ANUAL?\n\nOK = Anual (1 ano)\nCancelar = Mensal (1 mês)') ? 'yearly' : 'monthly';
                                      handleActivatePlanWithExpiry(user.uid, newPlan, cycle);
                                    }
                                  }}
                                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
                                >
                                  <option value="free">Free</option>
                                  <option value="pro">Pro (Ativar)</option>
                                  <option value="studio">Studio (Ativar)</option>
                                  <option value="agency">Agency (Ativar)</option>
                                </select>

                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                                  title="Ver detalhes"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {onOpenChat && (
                                  <button
                                    onClick={() => onOpenChat(user.uid, user.displayName)}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                                    title="Conversar"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </button>
                                )}

                                {user.isBanned ? (
                                  <button
                                    onClick={() => handleUnbanUser(user.uid)}
                                    className="p-2 rounded-lg text-green-400 hover:bg-green-500/10"
                                    title="Desbanir"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Motivo do ban:');
                                      if (reason) handleBanUser(user.uid, reason);
                                    }}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                                    title="Banir"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      {/* Search */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar pedidos..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Orders List (Mobile-friendly) */}
                      <div className="space-y-3">
                        {filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            className="glass rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white">{order.title}</p>
                                <p className="text-sm text-zinc-400">por {order.userName}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                                  <span className="capitalize">{order.type}</span>
                                  <span>{order.createdAt.toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                              <span className="text-lg font-bold text-green-400">
                                R$ {order.price}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`bg-white/5 border rounded-lg px-3 py-1.5 text-sm ${
                                  order.status === 'completed' ? 'border-green-500/50 text-green-400' :
                                  order.status === 'pending' ? 'border-amber-500/50 text-amber-400' :
                                  order.status === 'in_progress' ? 'border-blue-500/50 text-blue-400' :
                                  order.status === 'cancelled' ? 'border-red-500/50 text-red-400' :
                                  'border-white/10 text-white'
                                }`}
                              >
                                <option value="pending">Pendente</option>
                                <option value="in_progress">Em Andamento</option>
                                <option value="review">Em Revisão</option>
                                <option value="completed">Concluído</option>
                                <option value="cancelled">Cancelado</option>
                              </select>

                              {onOpenChat && (
                                <button
                                  onClick={() => onOpenChat(order.userId, order.userName, order.id)}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Conversar
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partnerships Tab */}
                  {activeTab === 'partnerships' && (
                    <div className="space-y-6">
                      {/* Sub Tabs */}
                      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <button
                          onClick={() => setPartnerSubTab('applications')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            partnerSubTab === 'applications'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Solicitações
                          {partnerApplications.filter(a => a.status === 'pending').length > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-500 text-white text-xs">
                              {partnerApplications.filter(a => a.status === 'pending').length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setPartnerSubTab('partners')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            partnerSubTab === 'partners'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Parceiros Ativos ({allPartners.filter(p => p.status === 'approved').length})
                        </button>
                      </div>

                      {/* Applications Sub Tab */}
                      {partnerSubTab === 'applications' && (
                        <div className="space-y-4">
                          {partnerApplications.length === 0 ? (
                            <div className="text-center py-12 glass rounded-xl">
                              <Handshake className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                              <h4 className="text-lg font-medium text-white mb-2">
                                Nenhuma solicitação de parceria
                              </h4>
                              <p className="text-zinc-500">
                                Quando alguém solicitar parceria, aparecerá aqui
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Pending Applications */}
                              {partnerApplications.filter(a => a.status === 'pending').length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Pendentes ({partnerApplications.filter(a => a.status === 'pending').length})
                                  </h4>
                                  <div className="space-y-3">
                                    {partnerApplications
                                      .filter(a => a.status === 'pending')
                                      .map((app) => {
                                        const categoryConfig = PARTNER_CATEGORIES[app.category];
                                        return (
                                          <div key={app.id} className="glass rounded-xl p-4 border border-amber-500/30">
                                            <div className="flex items-start gap-4">
                                              <img
                                                src={app.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userName)}&background=6366f1&color=fff&size=64`}
                                                alt={app.userName}
                                                className="w-14 h-14 rounded-xl object-cover"
                                              />
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <h5 className="font-bold text-white">{app.name}</h5>
                                                  <span className={`text-xs ${categoryConfig.color}`}>
                                                    {categoryConfig.icon} {categoryConfig.name}
                                                  </span>
                                                </div>
                                                <p className="text-sm text-zinc-400">{app.userName} • {app.userEmail}</p>
                                                <p className="text-sm text-zinc-300 mt-2 line-clamp-2">{app.description}</p>
                                                
                                                {/* Social Links */}
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                  {app.socialLinks?.instagram && (
                                                    <a
                                                      href={app.socialLinks.instagram}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="flex items-center gap-1 text-xs text-pink-400 hover:underline"
                                                    >
                                                      <Instagram className="w-3 h-3" />
                                                      Instagram
                                                    </a>
                                                  )}
                                                  {app.socialLinks?.youtube && (
                                                    <a
                                                      href={app.socialLinks.youtube}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="flex items-center gap-1 text-xs text-red-400 hover:underline"
                                                    >
                                                      <Youtube className="w-3 h-3" />
                                                      YouTube
                                                    </a>
                                                  )}
                                                  {app.socialLinks?.discord && (
                                                    <a
                                                      href={app.socialLinks.discord}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="flex items-center gap-1 text-xs text-indigo-400 hover:underline"
                                                    >
                                                      <DiscordIcon className="w-3 h-3" />
                                                      Discord
                                                    </a>
                                                  )}
                                                  {app.socialLinks?.website && (
                                                    <a
                                                      href={app.socialLinks.website}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                                                    >
                                                      <Globe className="w-3 h-3" />
                                                      Website
                                                    </a>
                                                  )}
                                                </div>

                                                {/* Audience & Reason */}
                                                <div className="mt-3 p-3 rounded-lg bg-white/5 space-y-2">
                                                  <p className="text-xs text-zinc-400">
                                                    <strong className="text-zinc-300">Audiência:</strong> {app.audience}
                                                  </p>
                                                  <p className="text-xs text-zinc-400">
                                                    <strong className="text-zinc-300">Motivo:</strong> {app.reason}
                                                  </p>
                                                </div>

                                                <p className="text-xs text-zinc-500 mt-2">
                                                  Enviado em {app.createdAt.toLocaleDateString('pt-BR')} às {app.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                              </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                              <button
                                                onClick={() => handleApprovePartner(app)}
                                                disabled={processingPartner === app.id}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                              >
                                                {processingPartner === app.id ? (
                                                  <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                  <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Aprovar
                                                  </>
                                                )}
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setSelectedApplication(app);
                                                  setShowRejectModal(true);
                                                }}
                                                disabled={processingPartner === app.id}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                              >
                                                <XCircle className="w-4 h-4" />
                                                Rejeitar
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}

                              {/* Approved/Rejected Applications History */}
                              {partnerApplications.filter(a => a.status !== 'pending').length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-zinc-400 mb-3">
                                    Histórico
                                  </h4>
                                  <div className="space-y-2">
                                    {partnerApplications
                                      .filter(a => a.status !== 'pending')
                                      .slice(0, 10)
                                      .map((app) => (
                                        <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                          <img
                                            src={app.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userName)}&background=6366f1&color=fff&size=32`}
                                            alt={app.userName}
                                            className="w-8 h-8 rounded-lg"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{app.name}</p>
                                            <p className="text-xs text-zinc-500">{app.userName}</p>
                                          </div>
                                          <span className={`text-xs px-2 py-1 rounded-full ${
                                            app.status === 'approved' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-red-500/20 text-red-400'
                                          }`}>
                                            {app.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {/* Partners Sub Tab */}
                      {partnerSubTab === 'partners' && (
                        <div className="space-y-4">
                          {allPartners.length === 0 ? (
                            <div className="text-center py-12 glass rounded-xl">
                              <Handshake className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                              <h4 className="text-lg font-medium text-white mb-2">
                                Nenhum parceiro ainda
                              </h4>
                              <p className="text-zinc-500">
                                Aprove solicitações de parceria para ver aqui
                              </p>
                            </div>
                          ) : (
                            <div className="grid gap-4">
                              {allPartners.map((partner) => {
                                const categoryConfig = PARTNER_CATEGORIES[partner.category];
                                return (
                                  <div
                                    key={partner.id}
                                    className={`glass rounded-xl p-4 ${
                                      partner.status === 'suspended' ? 'opacity-60 border border-red-500/30' :
                                      partner.isFeatured ? 'border border-amber-500/30' : ''
                                    }`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0">
                                        <Handshake className="w-7 h-7 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h5 className="font-bold text-white">{partner.name}</h5>
                                          {partner.isFeatured && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                                              <Star className="w-3 h-3" />
                                              Destaque
                                            </span>
                                          )}
                                          {partner.status === 'suspended' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                                              <Ban className="w-3 h-3" />
                                              Suspenso
                                            </span>
                                          )}
                                          <span className={`text-xs ${categoryConfig.color}`}>
                                            {categoryConfig.icon} {categoryConfig.name}
                                          </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 mt-1 line-clamp-1">{partner.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                          <span>{partner.viewCount} views</span>
                                          <span>{partner.clickCount} cliques</span>
                                          <span>Desde {partner.createdAt.toLocaleDateString('pt-BR')}</span>
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => handleTogglePartnerFeatured(partner.id, partner.isFeatured)}
                                          className={`p-2 rounded-lg transition-colors ${
                                            partner.isFeatured
                                              ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                                              : 'text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10'
                                          }`}
                                          title={partner.isFeatured ? 'Remover destaque' : 'Destacar'}
                                        >
                                          <Star className="w-4 h-4" />
                                        </button>
                                        {partner.status === 'approved' ? (
                                          <button
                                            onClick={() => handleSuspendPartner(partner)}
                                            disabled={processingPartner === partner.id}
                                            className="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
                                            title="Suspender"
                                          >
                                            {processingPartner === partner.id ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <Ban className="w-4 h-4" />
                                            )}
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => handleReactivatePartner(partner)}
                                            disabled={processingPartner === partner.id}
                                            className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                                            title="Reativar"
                                          >
                                            {processingPartner === partner.id ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <Check className="w-4 h-4" />
                                            )}
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleRemovePartner(partner)}
                                          disabled={processingPartner === partner.id}
                                          className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                          title="Remover"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Discord Tab */}
                  {activeTab === 'discord' && (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <DiscordIcon className="w-5 h-5 text-indigo-400" />
                            Gerenciar Servidores Discord
                          </h3>
                          <p className="text-sm text-zinc-400">
                            Adicione servidores parceiros para serem exibidos na área de parceiros
                          </p>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() => setShowAddDiscordModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
                          >
                            <Plus className="w-4 h-4" />
                            Adicionar Servidor
                          </button>
                        )}
                      </div>

                      {/* Servers List */}
                      {discordServers.length === 0 ? (
                        <div className="text-center py-12 glass rounded-xl">
                          <DiscordIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-white mb-2">
                            Nenhum servidor adicionado
                          </h4>
                          <p className="text-zinc-500 mb-4">
                            Adicione servidores Discord para serem exibidos na área de parceiros
                          </p>
                          {isOwner && (
                            <button
                              onClick={() => setShowAddDiscordModal(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Adicionar Primeiro Servidor
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {discordServers.map((server) => {
                            const categoryConfig = PARTNER_CATEGORIES[server.category];
                            return (
                              <div
                                key={server.id}
                                className={`glass rounded-xl p-4 ${
                                  server.isFeatured ? 'border border-amber-500/30' : ''
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                  {/* Server Info */}
                                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                                    <DiscordIcon className="w-8 h-8 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-bold text-white">{server.name}</h4>
                                      {server.isOfficial && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                                          <Check className="w-3 h-3" />
                                          Oficial
                                        </span>
                                      )}
                                      {server.isFeatured && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                                          <Star className="w-3 h-3" />
                                          Destaque
                                        </span>
                                      )}
                                      <span className={`text-xs ${categoryConfig.color}`}>
                                        {categoryConfig.icon} {categoryConfig.name}
                                      </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-1">
                                      {server.description || 'Sem descrição'}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                      <span>ID: {server.serverId}</span>
                                      <a
                                        href={server.inviteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-indigo-400 hover:underline"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Link de Convite
                                      </a>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  {isOwner && (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        onClick={() => handleToggleDiscordOfficial(server.id, server.isOfficial)}
                                        className={`p-2 rounded-lg transition-colors ${
                                          server.isOfficial
                                            ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                                            : 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                                        }`}
                                        title={server.isOfficial ? 'Remover como oficial' : 'Marcar como oficial'}
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleToggleDiscordFeatured(server.id, server.isFeatured)}
                                        className={`p-2 rounded-lg transition-colors ${
                                          server.isFeatured
                                            ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                                            : 'text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10'
                                        }`}
                                        title={server.isFeatured ? 'Remover destaque' : 'Destacar'}
                                      >
                                        <Star className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteDiscordServer(server.id)}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Remover servidor"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Preview iframe */}
                                <div className="mt-4 rounded-xl overflow-hidden bg-[#2f3136]">
                                  <iframe
                                    src={`https://discord.com/widget?id=${server.serverId}&theme=dark`}
                                    width="100%"
                                    height="200"
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                                    className="border-0"
                                    title={`Widget do servidor ${server.name}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <div className="glass rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Configurações da Plataforma
                        </h3>
                        <p className="text-zinc-400">
                          Configurações avançadas disponíveis em breve.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* User Details Modal */}
          <AnimatePresence>
            {showUserModal && selectedUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowUserModal(false)}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-md glass rounded-2xl p-6 z-10"
                >
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-6">
                    <UserAvatarWithFrame
                      src={selectedUser.photoURL}
                      name={selectedUser.displayName}
                      role={selectedUser.role}
                      size="xl"
                    />
                    <h3 className="text-xl font-bold text-white mt-4">
                      {selectedUser.displayName}
                    </h3>
                    <p className="text-zinc-400">{selectedUser.email}</p>
                    <div className="mt-2">
                      <UserBadge role={selectedUser.role} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-zinc-400">Plano</span>
                      <span className="text-white capitalize">{selectedUser.plan}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-zinc-400">Pontos</span>
                      <span className="text-white">{selectedUser.points}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-zinc-400">Nível</span>
                      <span className="text-white">{selectedUser.level}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-zinc-400">Pedidos</span>
                      <span className="text-white">{selectedUser.ordersCount}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-zinc-400">Membro desde</span>
                      <span className="text-white">
                        {selectedUser.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-zinc-400">Status</span>
                      <span className={isUserOnline(selectedUser.uid) ? 'text-green-400' : 'text-zinc-500'}>
                        {isUserOnline(selectedUser.uid) ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    {selectedUser.isBanned && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-red-400 text-sm">
                          <strong>Banido:</strong> {selectedUser.banReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {onOpenChat && (
                    <button
                      onClick={() => {
                        onOpenChat(selectedUser.uid, selectedUser.displayName);
                        setShowUserModal(false);
                      }}
                      className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Iniciar Conversa
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Discord Server Modal */}
          <AnimatePresence>
            {showAddDiscordModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowAddDiscordModal(false)}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-lg glass rounded-2xl overflow-hidden z-10"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <DiscordIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Adicionar Servidor Discord</h3>
                          <p className="text-sm text-zinc-400">Preencha as informações do servidor</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAddDiscordModal(false)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        ID do Servidor *
                      </label>
                      <input
                        type="text"
                        value={discordForm.serverId}
                        onChange={(e) => setDiscordForm({ ...discordForm, serverId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        placeholder="Ex: 1234567890123456789"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        Encontre nas configurações do servidor → Widget → ID do Servidor
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Nome do Servidor *
                      </label>
                      <input
                        type="text"
                        value={discordForm.name}
                        onChange={(e) => setDiscordForm({ ...discordForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        placeholder="Nome do servidor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={discordForm.description}
                        onChange={(e) => setDiscordForm({ ...discordForm, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                        rows={3}
                        placeholder="Descrição do servidor..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Link de Convite *
                      </label>
                      <input
                        type="url"
                        value={discordForm.inviteLink}
                        onChange={(e) => setDiscordForm({ ...discordForm, inviteLink: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        placeholder="https://discord.gg/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Categoria
                      </label>
                      <select
                        value={discordForm.category}
                        onChange={(e) => setDiscordForm({ ...discordForm, category: e.target.value as PartnerCategory })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                      >
                        {Object.entries(PARTNER_CATEGORIES).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.icon} {config.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={discordForm.isOfficial}
                          onChange={(e) => setDiscordForm({ ...discordForm, isOfficial: e.target.checked })}
                          className="w-4 h-4 rounded bg-white/10 border-white/20 text-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-zinc-300">Servidor Oficial</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={discordForm.isFeatured}
                          onChange={(e) => setDiscordForm({ ...discordForm, isFeatured: e.target.checked })}
                          className="w-4 h-4 rounded bg-white/10 border-white/20 text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-sm text-zinc-300">Em Destaque</span>
                      </label>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-white/10 flex gap-3">
                    <button
                      onClick={() => setShowAddDiscordModal(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddDiscordServer}
                      disabled={savingDiscord}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {savingDiscord ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Adicionar Servidor
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reject Partner Modal */}
          <AnimatePresence>
            {showRejectModal && selectedApplication && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedApplication(null);
                    setRejectionReason('');
                  }}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-md glass rounded-2xl overflow-hidden z-10"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-rose-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Rejeitar Solicitação</h3>
                        <p className="text-sm text-zinc-400">{selectedApplication.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Motivo da rejeição *
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 resize-none"
                        rows={4}
                        placeholder="Explique o motivo da rejeição..."
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-white/10 flex gap-3">
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setSelectedApplication(null);
                        setRejectionReason('');
                      }}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleRejectPartner}
                      disabled={processingPartner === selectedApplication.id || !rejectionReason.trim()}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingPartner === selectedApplication.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          Confirmar Rejeição
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
