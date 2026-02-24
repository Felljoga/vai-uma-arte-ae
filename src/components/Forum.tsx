import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Hash,
  Plus,
  Send,
  Heart,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  Trash2,
  ChevronLeft,
  Users,
  Loader2,
  Crown,
  Reply,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatarWithFrame, UserNameWithBadge, UserBadge } from './UserBadge';
import { getUserRole, hasPermission, type UserRole } from '@/services/admin';
import {
  subscribeToChannels,
  subscribeToThreads,
  subscribeToReplies,
  createThread,
  createReply,
  likeThread,
  likeReply,
  viewThread,
  togglePinThread,
  toggleLockThread,
  deleteThread,
  deleteReply,
  initializeChannels,
  type ForumChannel,
  type ForumThread,
  type ForumReply,
} from '@/services/forum';
import toast from 'react-hot-toast';

interface ForumProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Forum({ isOpen, onClose }: ForumProps) {
  const { currentUser, userProfile } = useAuth();
  // Áudio gerenciado globalmente
  const [channels, setChannels] = useState<ForumChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ForumChannel | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<'channels' | 'threads' | 'thread'>('channels');
  const repliesEndRef = useRef<HTMLDivElement>(null);

  const userRole: UserRole = getUserRole(userProfile?.email || null, userProfile?.role as UserRole);
  const canModerate = hasPermission(userRole, 'moderator');

  // Initialize channels on first load
  useEffect(() => {
    if (isOpen) {
      initializeChannels().catch(console.error);
    }
  }, [isOpen]);

  // Subscribe to channels
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToChannels((channelList) => {
      // Filter channels based on user permissions
      const filteredChannels = channelList.filter((channel) => {
        if (!channel.isPrivate) return true;
        if (!currentUser) return false;
        return (
          channel.allowedRoles.length === 0 ||
          channel.allowedRoles.includes(userRole)
        );
      });
      setChannels(filteredChannels);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, currentUser, userRole]);

  // Subscribe to threads when channel is selected
  useEffect(() => {
    if (!selectedChannel) return;

    const unsubscribe = subscribeToThreads(selectedChannel.id, setThreads);
    return () => unsubscribe();
  }, [selectedChannel]);

  // Subscribe to replies when thread is selected
  useEffect(() => {
    if (!selectedThread) return;

    // Increment view count (anti-spam: só conta 1 vez por usuário)
    if (currentUser) {
      viewThread(selectedThread.id, currentUser.uid).catch(console.error);
    }

    const unsubscribe = subscribeToReplies(selectedThread.id, setReplies);
    return () => unsubscribe();
  }, [selectedThread, currentUser]);

  // Scroll to bottom on new replies
  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const handleSelectChannel = (channel: ForumChannel) => {
    setSelectedChannel(channel);
    setSelectedThread(null);
    setMobileView('threads');
  };

  const handleSelectThread = (thread: ForumThread) => {
    setSelectedThread(thread);
    setMobileView('thread');
  };

  const handleBack = () => {
    if (mobileView === 'thread') {
      setSelectedThread(null);
      setMobileView('threads');
    } else if (mobileView === 'threads') {
      setSelectedChannel(null);
      setMobileView('channels');
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile || !selectedChannel) return;
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    setSending(true);
    try {
      await createThread(
        selectedChannel.id,
        currentUser.uid,
        userProfile.displayName,
        userProfile.photoURL,
        userRole,
        newThreadTitle.trim(),
        newThreadContent.trim()
      );
      setNewThreadTitle('');
      setNewThreadContent('');
      setShowNewThread(false);
      toast.success('Tópico criado! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar tópico');
    } finally {
      setSending(false);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile || !selectedThread) return;
    if (!newReplyContent.trim()) return;

    setSending(true);
    try {
      await createReply(
        selectedThread.id,
        currentUser.uid,
        userProfile.displayName,
        userProfile.photoURL,
        userRole,
        newReplyContent.trim(),
        replyingTo?.id,
        replyingTo?.author
      );
      setNewReplyContent('');
      setReplyingTo(null);
      toast.success('Resposta enviada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar resposta');
    } finally {
      setSending(false);
    }
  };

  const handleLikeThread = async (threadId: string) => {
    if (!currentUser) return;
    try {
      await likeThread(threadId, currentUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!currentUser || !selectedThread) return;
    try {
      await likeReply(selectedThread.id, replyId, currentUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePinThread = async (threadId: string) => {
    try {
      await togglePinThread(threadId);
      toast.success('Tópico atualizado');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fixar tópico');
    }
  };

  const handleLockThread = async (threadId: string) => {
    try {
      await toggleLockThread(threadId);
      toast.success('Tópico atualizado');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao trancar tópico');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este tópico?')) return;
    try {
      await deleteThread(threadId);
      setSelectedThread(null);
      setMobileView('threads');
      toast.success('Tópico excluído');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir tópico');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!selectedThread) return;
    if (!confirm('Tem certeza que deseja excluir esta resposta?')) return;
    try {
      await deleteReply(selectedThread.id, replyId);
      toast.success('Resposta excluída');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir resposta');
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR');
  };

  if (!currentUser) {
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
              <Users className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Faça login para acessar</h2>
              <p className="text-zinc-400">Entre na sua conta para participar do fórum.</p>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Forum Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-2 md:inset-4 lg:inset-8 bg-zinc-900 rounded-2xl overflow-hidden flex z-10"
          >
            {/* Channels Sidebar */}
            <div
              className={`
                ${mobileView === 'channels' ? 'flex' : 'hidden'}
                md:flex flex-col w-full md:w-64 lg:w-72 border-r border-white/10 bg-zinc-950
              `}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Comunidade
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-white md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {channels.length} canais disponíveis
                </p>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <UserAvatarWithFrame
                    src={userProfile?.photoURL}
                    name={userProfile?.displayName || 'User'}
                    role={userRole}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <UserNameWithBadge
                      name={userProfile?.displayName || 'User'}
                      role={userRole}
                      size="sm"
                    />
                    <p className="text-xs text-zinc-500">{userProfile?.points || 0} pts</p>
                  </div>
                </div>
              </div>

              {/* Channels List */}
              <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => handleSelectChannel(channel)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                          selectedChannel?.id === channel.id
                            ? 'bg-indigo-500/20 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-lg">{channel.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 opacity-50" />
                            <span className="font-medium truncate">{channel.name}</span>
                          </div>
                        </div>
                        {channel.isPrivate && (
                          <Lock className="w-3 h-3 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close button (desktop) */}
              <div className="hidden md:block p-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                >
                  Fechar Fórum
                </button>
              </div>
            </div>

            {/* Threads Panel */}
            <div
              className={`
                ${mobileView === 'threads' ? 'flex' : 'hidden'}
                md:flex flex-col w-full md:w-80 lg:w-96 border-r border-white/10
              `}
            >
              {selectedChannel ? (
                <>
                  {/* Channel Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBack}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white md:hidden"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-2xl">{selectedChannel.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">#{selectedChannel.name}</h3>
                        <p className="text-xs text-zinc-500 truncate">
                          {selectedChannel.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* New Thread Button */}
                  <div className="p-3 border-b border-white/10">
                    <button
                      onClick={() => setShowNewThread(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      Novo Tópico
                    </button>
                  </div>

                  {/* Threads List */}
                  <div className="flex-1 overflow-y-auto">
                    {threads.length === 0 ? (
                      <div className="p-8 text-center">
                        <MessageCircle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-500">Nenhum tópico ainda</p>
                        <p className="text-xs text-zinc-600">Seja o primeiro a criar!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {threads.map((thread) => (
                          <button
                            key={thread.id}
                            onClick={() => handleSelectThread(thread)}
                            className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${
                              selectedThread?.id === thread.id ? 'bg-white/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <UserAvatarWithFrame
                                src={thread.authorAvatar}
                                name={thread.authorName}
                                role={thread.authorRole}
                                size="sm"
                                showBadge={false}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {thread.isPinned && (
                                    <Pin className="w-3 h-3 text-amber-400" />
                                  )}
                                  {thread.isLocked && (
                                    <Lock className="w-3 h-3 text-red-400" />
                                  )}
                                  <h4 className="font-medium text-white truncate text-sm">
                                    {thread.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                  <UserNameWithBadge
                                    name={thread.authorName}
                                    role={thread.authorRole}
                                    size="sm"
                                    showRoleBadge={false}
                                  />
                                  <span>•</span>
                                  <span>{formatDate(thread.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {thread.likes}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3" />
                                    {thread.repliesCount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {thread.views}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Hash className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">Selecione um canal</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thread Content */}
            <div
              className={`
                ${mobileView === 'thread' ? 'flex' : 'hidden'}
                md:flex flex-col flex-1 min-w-0
              `}
            >
              {selectedThread ? (
                <>
                  {/* Thread Header */}
                  <div className="p-4 border-b border-white/10 bg-zinc-900/50">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={handleBack}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white md:hidden"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {selectedThread.isPinned && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                              <Pin className="w-3 h-3" />
                              Fixado
                            </span>
                          )}
                          {selectedThread.isLocked && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              Trancado
                            </span>
                          )}
                          <UserBadge role={selectedThread.authorRole} size="sm" />
                        </div>
                        <h2 className="text-lg font-bold text-white">{selectedThread.title}</h2>
                      </div>

                      {/* Mod actions */}
                      {canModerate && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handlePinThread(selectedThread.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              selectedThread.isPinned
                                ? 'text-amber-400 bg-amber-500/10'
                                : 'text-zinc-400 hover:text-white hover:bg-white/10'
                            }`}
                            title={selectedThread.isPinned ? 'Desafixar' : 'Fixar'}
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleLockThread(selectedThread.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              selectedThread.isLocked
                                ? 'text-red-400 bg-red-500/10'
                                : 'text-zinc-400 hover:text-white hover:bg-white/10'
                            }`}
                            title={selectedThread.isLocked ? 'Destrancar' : 'Trancar'}
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteThread(selectedThread.id)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thread Content + Replies */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Original Post */}
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <UserAvatarWithFrame
                          src={selectedThread.authorAvatar}
                          name={selectedThread.authorName}
                          role={selectedThread.authorRole}
                          size="md"
                        />
                        <div className="flex-1">
                          <UserNameWithBadge
                            name={selectedThread.authorName}
                            role={selectedThread.authorRole}
                          />
                          <p className="text-xs text-zinc-500">
                            {selectedThread.createdAt.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <p className="text-zinc-300 whitespace-pre-wrap">
                          {selectedThread.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleLikeThread(selectedThread.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            selectedThread.likedBy?.includes(currentUser?.uid || '')
                              ? 'text-red-400'
                              : 'text-zinc-400 hover:text-red-400'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              selectedThread.likedBy?.includes(currentUser?.uid || '')
                                ? 'fill-current'
                                : ''
                            }`}
                          />
                          {selectedThread.likes}
                        </button>
                        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <MessageCircle className="w-4 h-4" />
                          {selectedThread.repliesCount} respostas
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <Eye className="w-4 h-4" />
                          {selectedThread.views} views
                        </span>
                      </div>
                    </div>

                    {/* Replies */}
                    {replies.map((reply) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-light rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <UserAvatarWithFrame
                            src={reply.authorAvatar}
                            name={reply.authorName}
                            role={reply.authorRole}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <UserNameWithBadge
                                name={reply.authorName}
                                role={reply.authorRole}
                                size="sm"
                              />
                              <span className="text-xs text-zinc-500">
                                {formatDate(reply.createdAt)}
                              </span>
                              {reply.isEdited && (
                                <span className="text-xs text-zinc-600">(editado)</span>
                              )}
                            </div>

                            {reply.replyTo && (
                              <div className="mt-2 px-3 py-1.5 rounded-lg bg-white/5 border-l-2 border-indigo-500 text-xs text-zinc-400">
                                Respondendo a <span className="text-white">{reply.replyToAuthor}</span>
                              </div>
                            )}

                            <p className="text-sm text-zinc-300 mt-2 whitespace-pre-wrap">
                              {reply.content}
                            </p>

                            <div className="flex items-center gap-4 mt-3">
                              <button
                                onClick={() => handleLikeReply(reply.id)}
                                className={`flex items-center gap-1 text-xs transition-colors ${
                                  reply.likedBy?.includes(currentUser?.uid || '')
                                    ? 'text-red-400'
                                    : 'text-zinc-500 hover:text-red-400'
                                }`}
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${
                                    reply.likedBy?.includes(currentUser?.uid || '')
                                      ? 'fill-current'
                                      : ''
                                  }`}
                                />
                                {reply.likes}
                              </button>
                              {!selectedThread.isLocked && (
                                <button
                                  onClick={() =>
                                    setReplyingTo({ id: reply.id, author: reply.authorName })
                                  }
                                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
                                >
                                  <Reply className="w-3.5 h-3.5" />
                                  Responder
                                </button>
                              )}
                              {(canModerate || reply.authorId === currentUser?.uid) && (
                                <button
                                  onClick={() => handleDeleteReply(reply.id)}
                                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={repliesEndRef} />
                  </div>

                  {/* Reply Input */}
                  {!selectedThread.isLocked && (
                    <form
                      onSubmit={handleCreateReply}
                      className="p-4 border-t border-white/10 bg-zinc-900/50"
                    >
                      {replyingTo && (
                        <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-lg bg-indigo-500/10 text-sm">
                          <span className="text-indigo-400">
                            Respondendo a <strong>{replyingTo.author}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newReplyContent}
                          onChange={(e) => setNewReplyContent(e.target.value)}
                          placeholder="Escreva sua resposta..."
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={!newReplyContent.trim() || sending}
                          className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white disabled:opacity-50"
                        >
                          {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageCircle className="w-20 h-20 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-600">Selecione um tópico para ver</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* New Thread Modal */}
          <AnimatePresence>
            {showNewThread && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowNewThread(false)}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-lg glass rounded-2xl p-6 z-10"
                >
                  <h3 className="text-lg font-bold text-white mb-4">
                    Novo Tópico em #{selectedChannel?.name}
                  </h3>
                  <form onSubmit={handleCreateThread} className="space-y-4">
                    <div>
                      <label className="text-sm text-zinc-400 block mb-2">Título</label>
                      <input
                        type="text"
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        placeholder="Título do tópico"
                        className="input-modern w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400 block mb-2">Conteúdo</label>
                      <textarea
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        placeholder="Escreva o conteúdo do seu tópico..."
                        rows={5}
                        className="input-modern w-full resize-none"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowNewThread(false)}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={sending || !newThreadTitle.trim() || !newThreadContent.trim()}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            Criar Tópico
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
