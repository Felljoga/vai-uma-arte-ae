import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  ChevronLeft,
  MessageCircle,
  Loader2,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribeToMessages,
  subscribeToUserChatRooms,
  sendMessage,
  getOrCreateChatRoom,
  markMessagesAsRead,
  type ChatMessage,
  type ChatRoom,
} from '@/services/chat';
import toast from 'react-hot-toast';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  orderTitle?: string;
}

export function Chat({ isOpen, onClose, orderId, orderTitle }: ChatProps) {
  const { currentUser, userProfile } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(orderId || null);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState<string>(orderTitle || '');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to chat rooms
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const unsubscribe = subscribeToUserChatRooms(currentUser.uid, (rooms) => {
      setChatRooms(rooms);
    });

    return () => unsubscribe();
  }, [currentUser, isOpen]);

  // Subscribe to messages when a room is selected
  useEffect(() => {
    if (!selectedRoom || !isOpen) return;

    setLoading(true);
    const unsubscribe = subscribeToMessages(selectedRoom, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      // Mark as read
      markMessagesAsRead(selectedRoom);
    });

    return () => unsubscribe();
  }, [selectedRoom, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat room if orderId is provided
  useEffect(() => {
    if (orderId && orderTitle && currentUser && isOpen) {
      getOrCreateChatRoom(orderId, orderTitle, currentUser.uid)
        .then(() => {
          setSelectedRoom(orderId);
          setSelectedRoomTitle(orderTitle);
        })
        .catch(console.error);
    }
  }, [orderId, orderTitle, currentUser, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !currentUser || !userProfile) return;

    setSending(true);
    try {
      await sendMessage(
        selectedRoom,
        currentUser.uid,
        userProfile.displayName,
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

  const handleSelectRoom = (room: ChatRoom) => {
    setSelectedRoom(room.orderId);
    setSelectedRoomTitle(room.orderTitle);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
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
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl h-[600px] max-h-[80vh] glass rounded-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/10 bg-zinc-900/50">
              {selectedRoom && (
                <button
                  onClick={handleBackToRooms}
                  className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors lg:hidden"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {selectedRoom ? selectedRoomTitle : 'Minhas Conversas'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedRoom ? 'Chat em tempo real' : `${chatRooms.length} conversas`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Room List (visible when no room selected on mobile) */}
              <AnimatePresence mode="wait">
                {!selectedRoom ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full overflow-y-auto"
                  >
                    {chatRooms.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                          <MessageCircle className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">Nenhuma conversa</h4>
                        <p className="text-sm text-zinc-400 max-w-xs">
                          Suas conversas aparecerão aqui quando você criar um pedido.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {chatRooms.map((room) => (
                          <motion.button
                            key={room.id}
                            onClick={() => handleSelectRoom(room)}
                            className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                              <MessageCircle className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-white truncate">{room.orderTitle}</h4>
                                <span className="text-xs text-zinc-500 shrink-0 ml-2">
                                  {formatDate(room.lastMessageAt)}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-400 truncate">{room.lastMessage}</p>
                            </div>
                            {room.unreadCount > 0 && (
                              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">
                                {room.unreadCount}
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex flex-col"
                  >
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                      ) : (
                        Object.entries(groupedMessages).map(([dateKey, msgs]) => (
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
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div className={`flex items-end gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                                      {!isOwn && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold shrink-0">
                                          {message.senderAvatar ? (
                                            <img
                                              src={message.senderAvatar}
                                              alt=""
                                              className="w-full h-full rounded-full object-cover"
                                            />
                                          ) : (
                                            message.senderName?.charAt(0).toUpperCase() || 'A'
                                          )}
                                        </div>
                                      )}
                                      <div
                                        className={`px-4 py-2 rounded-2xl ${
                                          isOwn
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md'
                                            : 'bg-white/10 text-white rounded-bl-md'
                                        }`}
                                      >
                                        {!isOwn && (
                                          <p className="text-xs text-indigo-300 mb-1 font-medium">
                                            {message.senderName}
                                          </p>
                                        )}
                                        <p className="text-sm break-words">{message.content}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/60' : 'text-zinc-500'}`}>
                                          <span className="text-[10px]">{formatTime(message.createdAt)}</span>
                                          {isOwn && (
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
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-zinc-900/50">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block"
                        >
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors hidden sm:block"
                          >
                            <Smile className="w-5 h-5" />
                          </button>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
