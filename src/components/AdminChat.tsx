import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Paperclip,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  CheckCheck,
  MessageSquare,
  ChevronLeft,
  Eye,
  Package,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole, type UserRole } from '@/services/admin';
import {
  subscribeToMessages,
  subscribeToUserChatRooms,
  sendMessage,
  getOrCreateChatRoom,
  markMessagesAsRead,
  type ChatMessage,
  type ChatRoom,
} from '@/services/chat';
import { subscribeToAllOrders } from '@/services/realtime';
import { type Order } from '@/services/orders';
import toast from 'react-hot-toast';

interface AdminChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialTarget?: {
    recipientId: string;
    recipientName: string;
    orderId?: string;
  };
}

const statusConfig = {
  pending: { label: 'Pendente', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: AlertCircle },
  in_progress: { label: 'Em Andamento', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
  review: { label: 'Em Revisão', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Eye },
  completed: { label: 'Concluído', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-400/10', icon: X },
};

export function AdminChat({ isOpen, onClose, initialTarget }: AdminChatProps) {
  const { currentUser, userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<'orders' | 'chat'>('orders');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userRole: UserRole = getUserRole(userProfile?.email || null, userProfile?.role as UserRole);

  // Handle initial target (open specific conversation)
  useEffect(() => {
    if (initialTarget && orders.length > 0) {
      // Find the order matching the initial target
      let targetOrder: Order | undefined;
      
      if (initialTarget.orderId) {
        targetOrder = orders.find(o => o.id === initialTarget.orderId);
      } else {
        // Find most recent order from this user
        targetOrder = orders.find(o => o.userId === initialTarget.recipientId);
      }

      if (targetOrder) {
        handleSelectOrder(targetOrder);
      }
    }
  }, [initialTarget, orders]);

  // Subscribe to all orders in real-time
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToAllOrders((allOrders) => {
      // Filter to show only orders with activity or pending
      const relevantOrders = allOrders.filter(
        (order) => order.status !== 'cancelled'
      );
      setOrders(relevantOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Subscribe to all chat rooms
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    // Admin sees all chat rooms
    const unsubscribe = subscribeToUserChatRooms('admin', (rooms) => {
      setChatRooms(rooms);
    });

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  // Subscribe to messages when an order is selected
  useEffect(() => {
    if (!selectedOrder) return;

    const unsubscribe = subscribeToMessages(selectedOrder.id, (msgs) => {
      setMessages(msgs);
      markMessagesAsRead(selectedOrder.id);
    });

    return () => unsubscribe();
  }, [selectedOrder]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectOrder = async (order: Order) => {
    setSelectedOrder(order);
    setMobileView('chat');
    
    // Ensure chat room exists
    try {
      await getOrCreateChatRoom(order.id, order.title, order.userId);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedOrder || !currentUser || !userProfile) return;

    setSending(true);
    try {
      await sendMessage(
        selectedOrder.id,
        currentUser.uid,
        `${userProfile.displayName} (${userRole === 'owner' ? 'Fundador' : userRole === 'admin' ? 'Admin' : 'Moderador'})`,
        userProfile.photoURL,
        newMessage.trim()
      );
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    setSelectedOrder(null);
    setMobileView('orders');
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return date.toLocaleDateString('pt-BR');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = message.createdAt.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  // Get unread count for an order
  const getUnreadCount = (orderId: string): number => {
    const room = chatRooms.find((r) => r.orderId === orderId);
    return room?.unreadCount || 0;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl h-[80vh] glass rounded-2xl overflow-hidden z-10 flex"
          >
            {/* Orders List */}
            <div
              className={`
                ${mobileView === 'orders' ? 'flex' : 'hidden'}
                md:flex flex-col w-full md:w-80 lg:w-96 border-r border-white/10
              `}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Chat de Pedidos</h3>
                      <p className="text-xs text-zinc-400">
                        {orders.filter((o) => o.status === 'pending' || o.status === 'in_progress').length} pedidos ativos
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-white transition-colors md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-2 border-b border-white/10">
                {['Todos', 'Pendentes', 'Em Andamento'].map((filter, i) => (
                  <button
                    key={filter}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      i === 0
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Package className="w-16 h-16 text-zinc-700 mb-4" />
                    <p className="text-zinc-500">Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {orders.map((order) => {
                      const status = statusConfig[order.status];
                      const unreadCount = getUnreadCount(order.id);

                      return (
                        <motion.button
                          key={order.id}
                          onClick={() => handleSelectOrder(order)}
                          className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${
                            selectedOrder?.id === order.id ? 'bg-white/5' : ''
                          }`}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                              <status.icon className={`w-5 h-5 ${status.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="font-medium text-white truncate text-sm">
                                  {order.title}
                                </h4>
                                {unreadCount > 0 && (
                                  <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <span className={`${status.color}`}>{status.label}</span>
                                <span>•</span>
                                <span>R$ {order.price}</span>
                              </div>
                              <p className="text-xs text-zinc-600 mt-1">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Close button (desktop) */}
              <div className="hidden md:block p-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`
                ${mobileView === 'chat' ? 'flex' : 'hidden'}
                md:flex flex-col flex-1 min-w-0
              `}
            >
              {selectedOrder ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBack}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors md:hidden"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {selectedOrder.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className={statusConfig[selectedOrder.status].color}>
                            {statusConfig[selectedOrder.status].label}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            R$ {selectedOrder.price}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hidden md:block"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
                      <div key={dateKey}>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center mb-4">
                          <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-400">
                            {formatDate(new Date(dateKey))}
                          </span>
                        </div>

                        {/* Messages */}
                        <div className="space-y-3">
                          {msgs.map((message) => {
                            const isOwn = message.senderId === currentUser?.uid;
                            const isSystem = message.type === 'system';
                            const isStaff = message.senderName.includes('Admin') || 
                                          message.senderName.includes('Moderador') ||
                                          message.senderName.includes('Fundador');

                            if (isSystem) {
                              return (
                                <div key={message.id} className="flex justify-center">
                                  <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-400 text-center">
                                    {message.content}
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isOwn || isStaff ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`flex items-end gap-2 max-w-[80%] ${isOwn || isStaff ? 'flex-row-reverse' : ''}`}>
                                  {!(isOwn || isStaff) && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center text-xs font-bold shrink-0">
                                      {message.senderAvatar ? (
                                        <img
                                          src={message.senderAvatar}
                                          alt=""
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      ) : (
                                        <User className="w-4 h-4" />
                                      )}
                                    </div>
                                  )}
                                  <div
                                    className={`px-4 py-2 rounded-2xl ${
                                      isOwn || isStaff
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md'
                                        : 'bg-white/10 text-white rounded-bl-md'
                                    }`}
                                  >
                                    {!(isOwn) && (
                                      <p className={`text-xs mb-1 font-medium ${isStaff ? 'text-amber-300' : 'text-indigo-300'}`}>
                                        {message.senderName}
                                        {isStaff && ' ⭐'}
                                      </p>
                                    )}
                                    <p className="text-sm break-words">{message.content}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn || isStaff ? 'text-white/60' : 'text-zinc-500'}`}>
                                      <span className="text-[10px]">{formatTime(message.createdAt)}</span>
                                      {(isOwn || isStaff) && (
                                        message.read ? (
                                          <CheckCheck className="w-3 h-3" />
                                        ) : (
                                          <Check className="w-3 h-3" />
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Responder ao cliente..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageSquare className="w-20 h-20 text-zinc-800 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-500 mb-2">
                      Selecione um pedido
                    </h3>
                    <p className="text-sm text-zinc-600">
                      Escolha um pedido para iniciar o chat com o cliente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
