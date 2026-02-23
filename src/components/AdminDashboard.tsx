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

export function AdminDashboard({ isOpen, onClose, onOpenChat }: AdminDashboardProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'settings'>('overview');
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
