import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, Trophy, Award, Flame, Star, Heart, MessageCircle,
  Eye, Upload, Target, Calendar,
  Gift, Zap, Clock, Check,
  Image as ImageIcon, Send, Play, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LEVELS, ACHIEVEMENTS, XP_ACTIONS,
  getLevelFromXP, getXPProgress,
  subscribeToRanking, subscribeToEvents,
  joinEvent, checkDailyLogin,
  RankingUser, CommunityEvent, Achievement
} from '@/services/gamification';
import {
  createArtwork, likeArtwork, viewArtwork, addComment,
  Artwork
} from '@/services/community';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserBadge } from './UserBadge';

interface CommunityHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'feed' | 'ranking' | 'achievements' | 'events' | 'profile';

export function CommunityHub({ isOpen, onClose }: CommunityHubProps) {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [feedFilter, setFeedFilter] = useState<'trending' | 'new' | 'following'>('trending');
  const [dailyReward, setDailyReward] = useState<{ streak: number; xp: number } | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);

  // Check daily login
  useEffect(() => {
    if (currentUser && isOpen) {
      checkDailyLogin(currentUser.uid).then(result => {
        if (result.xpGained > 0) {
          setDailyReward({ streak: result.streak, xp: result.xpGained });
          setShowDailyReward(true);
        }
      });
    }
  }, [currentUser, isOpen]);

  // Subscribe to artworks
  useEffect(() => {
    if (!isOpen) return;

    const artworksRef = collection(db, 'artworks');
    const q = query(
      artworksRef,
      orderBy(feedFilter === 'trending' ? 'likes' : 'createdAt', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          comments: data.comments || [],
        } as Artwork;
      });
      setArtworks(arts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, feedFilter]);

  // Subscribe to ranking
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToRanking(50, setRanking);
    return () => unsubscribe();
  }, [isOpen]);

  // Subscribe to events
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToEvents(setEvents);
    return () => unsubscribe();
  }, [isOpen]);

  const userLevel = userProfile ? getLevelFromXP(userProfile.points || 0) : LEVELS[0];
  const xpProgress = userProfile ? getXPProgress(userProfile.points || 0) : { current: 0, needed: 100, percentage: 0 };
  const userAchievements = (userProfile as any)?.achievements || [];

  const tabs = [
    { id: 'feed' as TabType, name: 'Feed', icon: Flame },
    { id: 'ranking' as TabType, name: 'Ranking', icon: Trophy },
    { id: 'achievements' as TabType, name: 'Conquistas', icon: Award },
    { id: 'events' as TabType, name: 'Eventos', icon: Calendar },
    { id: 'profile' as TabType, name: 'Meu Perfil', icon: Users },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[95vh] bg-zinc-900 rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Comunidade Criativa</h2>
                  <p className="text-xs sm:text-sm text-zinc-400">Inspire e seja inspirado</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            {/* User XP Bar */}
            {currentUser && userProfile && (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                <div className="relative">
                  <img
                    src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName}&background=6366f1&color=fff`}
                    alt={userProfile.displayName}
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${userLevel.color} flex items-center justify-center text-xs font-bold`}>
                    {userLevel.level}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white truncate">{userProfile.displayName}</span>
                    <span className="text-lg">{userLevel.icon}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${userLevel.color} text-white`}>
                      {userLevel.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress.percentage}%` }}
                        className={`h-full bg-gradient-to-r ${userLevel.color}`}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 whitespace-nowrap">
                      {xpProgress.current}/{xpProgress.needed} XP
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{userProfile.points || 0}</div>
                    <div className="text-xs text-zinc-400">XP Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-400">{userAchievements.length}</div>
                    <div className="text-xs text-zinc-400">Conquistas</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mt-4 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Feed Tab */}
            {activeTab === 'feed' && (
              <FeedTab
                artworks={artworks}
                loading={loading}
                feedFilter={feedFilter}
                setFeedFilter={setFeedFilter}
                currentUser={currentUser}
                onSelectArtwork={setSelectedArtwork}
                onShowUpload={() => setShowUploadModal(true)}
              />
            )}

            {/* Ranking Tab */}
            {activeTab === 'ranking' && (
              <RankingTab ranking={ranking} currentUserId={currentUser?.uid} />
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <AchievementsTab
                userAchievements={userAchievements}
                userProfile={userProfile}
              />
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <EventsTab
                events={events}
                currentUser={currentUser}
                onJoinEvent={joinEvent}
              />
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <ProfileTab
                userProfile={userProfile}
                userLevel={userLevel}
                xpProgress={xpProgress}
                userAchievements={userAchievements}
                artworks={artworks.filter(a => a.userId === currentUser?.uid)}
              />
            )}
          </div>

          {/* Daily Reward Modal */}
          <AnimatePresence>
            {showDailyReward && dailyReward && (
              <DailyRewardModal
                streak={dailyReward.streak}
                xp={dailyReward.xp}
                onClose={() => setShowDailyReward(false)}
              />
            )}
          </AnimatePresence>

          {/* Artwork Detail Modal */}
          <AnimatePresence>
            {selectedArtwork && (
              <ArtworkDetailModal
                artwork={selectedArtwork}
                currentUser={currentUser}
                onClose={() => setSelectedArtwork(null)}
              />
            )}
          </AnimatePresence>

          {/* Upload Modal */}
          <AnimatePresence>
            {showUploadModal && currentUser && (
              <UploadArtworkModal
                currentUser={currentUser}
                userProfile={userProfile}
                onClose={() => setShowUploadModal(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== SUB-COMPONENTS ====================

function FeedTab({
  artworks,
  loading,
  feedFilter,
  setFeedFilter,
  currentUser,
  onSelectArtwork,
  onShowUpload,
}: {
  artworks: Artwork[];
  loading: boolean;
  feedFilter: 'trending' | 'new' | 'following';
  setFeedFilter: (filter: 'trending' | 'new' | 'following') => void;
  currentUser: any;
  onSelectArtwork: (artwork: Artwork) => void;
  onShowUpload: () => void;
}) {
  const [likedArtworks, setLikedArtworks] = useState<string[]>([]);

  const handleLike = async (artwork: Artwork, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;

    try {
      await likeArtwork(artwork.id, currentUser.uid);
      setLikedArtworks(prev =>
        prev.includes(artwork.id)
          ? prev.filter(id => id !== artwork.id)
          : [...prev, artwork.id]
      );
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const isLiked = (artwork: Artwork) =>
    likedArtworks.includes(artwork.id) || (currentUser && artwork.likedBy?.includes(currentUser.uid));

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {[
            { id: 'trending', name: 'Trending', icon: Flame },
            { id: 'new', name: 'Novos', icon: Sparkles },
            { id: 'following', name: 'Seguindo', icon: Users },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFeedFilter(filter.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                feedFilter === filter.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{filter.name}</span>
            </button>
          ))}
        </div>

        {currentUser && (
          <motion.button
            onClick={onShowUpload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Publicar Arte</span>
          </motion.button>
        )}
      </div>

      {/* Artworks Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhuma arte ainda</h3>
          <p className="text-zinc-400 mb-4">Seja o primeiro a publicar!</p>
          {currentUser && (
            <button
              onClick={onShowUpload}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg"
            >
              Publicar Arte
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectArtwork(artwork)}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-white/5"
            >
              {artwork.imageUrl ? (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                  <ImageIcon className="w-12 h-12 text-zinc-600" />
                </div>
              )}

              {/* Featured Badge */}
              {artwork.featured && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Destaque
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={artwork.authorAvatar || `https://ui-avatars.com/api/?name=${artwork.authorName}&background=6366f1&color=fff`}
                    alt={artwork.authorName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-white truncate">{artwork.authorName}</span>
                </div>
                <h4 className="text-sm font-medium text-white truncate mb-2">{artwork.title}</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(artwork, e)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked(artwork) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                    <span className="text-white">{artwork.likes}</span>
                  </button>
                  <div className="flex items-center gap-1 text-xs text-white">
                    <MessageCircle className="w-4 h-4" />
                    {artwork.comments?.length || 0}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white">
                    <Eye className="w-4 h-4" />
                    {artwork.views}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function RankingTab({ ranking, currentUserId }: { ranking: RankingUser[]; currentUserId?: string }) {
  const [rankingType, setRankingType] = useState<'all' | 'weekly' | 'monthly'>('all');

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-amber-400 to-yellow-500';
    if (rank === 2) return 'from-zinc-300 to-zinc-400';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-zinc-600 to-zinc-700';
  };

  // Rank icon helper - using inline JSX in the component

  return (
    <div>
      {/* Type Selector */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[
          { id: 'all', name: 'Geral' },
          { id: 'weekly', name: 'Semanal' },
          { id: 'monthly', name: 'Mensal' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setRankingType(type.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              rankingType === type.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {ranking.slice(0, 3).map((_, i) => {
          const order = [1, 0, 2][i];
          const heights = ['h-32', 'h-40', 'h-28'];
          const sizes = ['w-16 h-16', 'w-20 h-20', 'w-14 h-14'];
          const actualUser = ranking[order];
          if (!actualUser) return null;

          return (
            <motion.div
              key={actualUser.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <img
                  src={actualUser.photoURL || `https://ui-avatars.com/api/?name=${actualUser.displayName}&background=6366f1&color=fff`}
                  alt={actualUser.displayName}
                  className={`${sizes[order]} rounded-full border-4 ${
                    order === 0 ? 'border-amber-400' : order === 1 ? 'border-zinc-300' : 'border-amber-600'
                  }`}
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${actualUser.level.color} flex items-center justify-center text-xs font-bold text-white`}>
                  {actualUser.level.level}
                </div>
              </div>
              <span className="text-sm font-medium text-white text-center truncate max-w-20">
                {actualUser.displayName}
              </span>
              <span className="text-xs text-zinc-400">{actualUser.points.toLocaleString()} XP</span>
              <div className={`${heights[order]} w-20 mt-2 rounded-t-lg bg-gradient-to-t ${getRankColor(actualUser.rank)} flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">{actualUser.rank}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Ranking List */}
      <div className="space-y-2">
        {ranking.slice(3).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`flex items-center gap-4 p-3 rounded-xl ${
              user.id === currentUserId ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center text-sm font-bold text-white`}>
              {user.rank}
            </div>
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff`}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white truncate">{user.displayName}</span>
                <UserBadge role={user.role as any} size="sm" />
                <span className="text-sm">{user.level.icon}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${user.level.color} text-white`}>
                  Nv. {user.level.level}
                </span>
                <span className="text-xs text-zinc-400">{user.achievements.length} conquistas</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">{user.points.toLocaleString()}</div>
              <div className="text-xs text-zinc-400">XP</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab({
  userAchievements,
}: {
  userAchievements: string[];
  userProfile?: any;
}) {
  const [category, setCategory] = useState<'all' | Achievement['category']>('all');

  const categories = [
    { id: 'all', name: 'Todas', icon: Award },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'creator', name: 'Criador', icon: Sparkles },
    { id: 'engagement', name: 'Engajamento', icon: Heart },
    { id: 'milestone', name: 'Marcos', icon: Target },
    { id: 'special', name: 'Especiais', icon: Star },
  ];

  const filteredAchievements = category === 'all'
    ? ACHIEVEMENTS.filter(a => !a.secret || userAchievements.includes(a.id))
    : ACHIEVEMENTS.filter(a => a.category === category && (!a.secret || userAchievements.includes(a.id)));

  const rarityColors = {
    common: 'from-zinc-400 to-zinc-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-amber-400 to-orange-500',
  };

  const rarityNames = {
    common: 'Comum',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Lendário',
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-white">{userAchievements.length}</div>
          <div className="text-xs text-zinc-400">Desbloqueadas</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-zinc-500">{ACHIEVEMENTS.length - userAchievements.length}</div>
          <div className="text-xs text-zinc-400">Bloqueadas</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-amber-400">
            {ACHIEVEMENTS.filter(a => a.rarity === 'legendary' && userAchievements.includes(a.id)).length}
          </div>
          <div className="text-xs text-zinc-400">Lendárias</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round((userAchievements.length / ACHIEVEMENTS.length) * 100)}%
          </div>
          <div className="text-xs text-zinc-400">Progresso</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id as any)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = userAchievements.includes(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/5 border-white/5 opacity-60'
              }`}
            >
              {/* Rarity Badge */}
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                {rarityNames[achievement.rarity]}
              </div>

              <div className="flex items-start gap-3">
                <div className={`text-4xl ${!isUnlocked && 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    {achievement.name}
                    {isUnlocked && <Check className="w-4 h-4 text-green-400" />}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-xs text-amber-400">+{achievement.xpReward} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* XP Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Como Ganhar XP
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(XP_ACTIONS).map((action) => (
            <div
              key={action.action}
              className="p-3 rounded-lg bg-white/5 flex items-center gap-3"
            >
              <span className="text-2xl">{action.icon}</span>
              <div>
                <div className="text-sm text-white">{action.description}</div>
                <div className="text-xs text-amber-400">+{action.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsTab({
  events,
  currentUser,
  onJoinEvent,
}: {
  events: CommunityEvent[];
  currentUser: any;
  onJoinEvent: (eventId: string, userId: string) => Promise<boolean>;
}) {
  const [joining, setJoining] = useState<string | null>(null);

  const handleJoin = async (eventId: string) => {
    if (!currentUser) return;
    setJoining(eventId);
    try {
      await onJoinEvent(eventId, currentUser.uid);
    } catch (error) {
      console.error('Error joining event:', error);
    }
    setJoining(null);
  };

  const getEventTypeInfo = (type: CommunityEvent['type']) => {
    const types = {
      challenge: { icon: Target, color: 'from-orange-500 to-red-500', name: 'Desafio' },
      contest: { icon: Trophy, color: 'from-amber-500 to-yellow-500', name: 'Competição' },
      workshop: { icon: Sparkles, color: 'from-blue-500 to-indigo-500', name: 'Workshop' },
      live: { icon: Play, color: 'from-red-500 to-pink-500', name: 'Live' },
      special: { icon: Star, color: 'from-purple-500 to-pink-500', name: 'Especial' },
    };
    return types[type];
  };

  const getStatusInfo = (status: CommunityEvent['status']) => {
    const statuses = {
      upcoming: { color: 'bg-blue-500', name: 'Em breve' },
      active: { color: 'bg-green-500', name: 'Ativo' },
      ended: { color: 'bg-zinc-500', name: 'Encerrado' },
    };
    return statuses[status];
  };

  return (
    <div>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum evento no momento</h3>
          <p className="text-zinc-400">Novos eventos em breve!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => {
            const typeInfo = getEventTypeInfo(event.type);
            const statusInfo = getStatusInfo(event.status);
            const isParticipating = event.participants?.includes(currentUser?.uid);
            const TypeIcon = typeInfo.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusInfo.color} text-white`}>
                        {statusInfo.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${typeInfo.color} text-white`}>
                        {typeInfo.name}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white">{event.title}</h4>
                    <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{event.description}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.startDate.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.participants?.length || 0}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400">+{event.xpReward} XP</span>
                      </div>
                    </div>

                    {event.prizes && event.prizes.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Gift className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-zinc-300">{event.prizes.join(', ')}</span>
                      </div>
                    )}

                    {event.status !== 'ended' && currentUser && (
                      <button
                        onClick={() => handleJoin(event.id)}
                        disabled={isParticipating || joining === event.id}
                        className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isParticipating
                            ? 'bg-green-500/20 text-green-400 cursor-default'
                            : `bg-gradient-to-r ${typeInfo.color} text-white hover:opacity-90`
                        }`}
                      >
                        {joining === event.id ? (
                          'Entrando...'
                        ) : isParticipating ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-4 h-4" /> Participando
                          </span>
                        ) : (
                          'Participar'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProfileTab({
  userProfile,
  userLevel,
  xpProgress,
  userAchievements,
  artworks,
}: {
  userProfile: any;
  userLevel: any;
  xpProgress: any;
  userAchievements: string[];
  artworks: Artwork[];
}) {
  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Faça login para ver seu perfil</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${userLevel.color} blur-lg opacity-50`} />
          <img
            src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.displayName}&background=6366f1&color=fff&size=200`}
            alt={userProfile.displayName}
            className={`relative w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-br ${userLevel.color} p-1`}
          />
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${userLevel.color} flex items-center justify-center text-lg font-bold text-white border-4 border-zinc-900`}>
            {userLevel.level}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          {userProfile.displayName}
          <UserBadge role={userProfile.role} />
        </h2>
        <p className="text-zinc-400 flex items-center justify-center gap-2">
          <span className="text-xl">{userLevel.icon}</span>
          {userLevel.name}
        </p>
        {userProfile.bio && (
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">{userProfile.bio}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-center">
          <div className="text-2xl font-bold text-white">{userProfile.points || 0}</div>
          <div className="text-xs text-zinc-400">XP Total</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-center">
          <div className="text-2xl font-bold text-amber-400">{userAchievements.length}</div>
          <div className="text-xs text-zinc-400">Conquistas</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{artworks.length}</div>
          <div className="text-xs text-zinc-400">Publicações</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-center">
          <div className="text-2xl font-bold text-green-400">{userProfile.loginStreak || 0}</div>
          <div className="text-xs text-zinc-400">Dias Seguidos</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="p-4 rounded-xl bg-white/5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white">Progresso para Nível {userLevel.level + 1}</span>
          <span className="text-sm text-zinc-400">{xpProgress.percentage.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.percentage}%` }}
            className={`h-full bg-gradient-to-r ${userLevel.color}`}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
          <span>{xpProgress.current} XP</span>
          <span>{xpProgress.needed} XP para subir</span>
        </div>
      </div>

      {/* Level Benefits */}
      <div className="p-4 rounded-xl bg-white/5 mb-8">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-400" />
          Benefícios do seu nível
        </h3>
        <div className="space-y-2">
          {userLevel.benefits.map((benefit: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
              <Check className="w-4 h-4 text-green-400" />
              {benefit}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Conquistas Recentes
        </h3>
        <div className="flex flex-wrap gap-3">
          {userAchievements.slice(0, 8).map((achId) => {
            const achievement = ACHIEVEMENTS.find(a => a.id === achId);
            if (!achievement) return null;
            return (
              <div
                key={achId}
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl"
                title={achievement.name}
              >
                {achievement.icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DailyRewardModal({ streak, xp, onClose }: { streak: number; xp: number; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center max-w-sm mx-4"
      >
        <div className="text-6xl mb-4">🔥</div>
        <h3 className="text-xl font-bold text-white mb-2">Login Diário!</h3>
        <p className="text-zinc-300 mb-4">
          {streak === 1
            ? 'Bem-vindo de volta!'
            : `${streak} dias seguidos!`}
        </p>
        <div className="p-4 rounded-xl bg-white/10 mb-4">
          <div className="text-3xl font-bold text-amber-400">+{xp} XP</div>
          <div className="text-sm text-zinc-400">Ganhos hoje</div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium"
        >
          Continuar
        </button>
      </motion.div>
    </motion.div>
  );
}

function ArtworkDetailModal({
  artwork,
  currentUser,
  onClose,
}: {
  artwork: Artwork;
  currentUser: any;
  onClose: () => void;
}) {
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(artwork.likedBy?.includes(currentUser?.uid));

  useEffect(() => {
    viewArtwork(artwork.id);
  }, [artwork.id]);

  const handleLike = async () => {
    if (!currentUser) return;
    await likeArtwork(artwork.id, currentUser.uid);
    setLiked(!liked);
  };

  const handleComment = async () => {
    if (!currentUser || !comment.trim()) return;
    setSending(true);
    await addComment(artwork.id, currentUser.uid, currentUser.displayName || 'Usuário', comment);
    setComment('');
    setSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Image */}
        <div className="md:w-1/2 bg-black flex items-center justify-center">
          {artwork.imageUrl ? (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-zinc-800">
              <ImageIcon className="w-16 h-16 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={artwork.authorAvatar || `https://ui-avatars.com/api/?name=${artwork.authorName}&background=6366f1&color=fff`}
                alt={artwork.authorName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-white">{artwork.authorName}</div>
                <div className="text-xs text-zinc-400">{artwork.category}</div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{artwork.title}</h3>
            <p className="text-sm text-zinc-400 mb-4">{artwork.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-sm"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
                <span className="text-white">{artwork.likes + (liked ? 1 : 0)}</span>
              </button>
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <MessageCircle className="w-5 h-5" />
                {artwork.comments?.length || 0}
              </div>
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <Eye className="w-5 h-5" />
                {artwork.views}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-3">
              {artwork.comments?.map((c: any) => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-white text-sm">{c.userName}</span>
                    <p className="text-sm text-zinc-400">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          {currentUser && (
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleComment}
                  disabled={!comment.trim() || sending}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function UploadArtworkModal({
  currentUser,
  userProfile,
  onClose,
}: {
  currentUser: any;
  userProfile: any;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('design');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Logo', 'Social Media', 'Ilustração', 'UI/UX', 'Branding', 'Embalagem', 'Arte Digital', 'Outro'
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !imageUrl.trim()) return;

    setUploading(true);
    try {
      await createArtwork({
        userId: currentUser.uid,
        authorName: userProfile?.displayName || 'Usuário',
        authorAvatar: userProfile?.photoURL || null,
        title,
        description,
        imageUrl,
        category,
      });
      onClose();
    } catch (error) {
      console.error('Error creating artwork:', error);
    }
    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-zinc-900 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Publicar Arte</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da sua arte"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">URL da Imagem *</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-zinc-500 mt-1">Cole o link de uma imagem hospedada (imgur, etc.)</p>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte sobre sua arte..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-200">Ganhe +50 XP ao publicar!</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 text-white rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !imageUrl.trim() || uploading}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {uploading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
