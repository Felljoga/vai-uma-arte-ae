import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Handshake,
  Instagram,
  Youtube,
  Globe,
  ExternalLink,
  Users,
  Eye,
  MousePointer,
  Star,
  Loader2,
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole, type UserRole } from '@/services/admin';
import {
  subscribeToPartners,
  subscribeToDiscordServers,
  submitPartnerApplication,
  checkUserPartnerStatus,
  incrementPartnerViews,
  incrementPartnerClicks,
  PARTNER_CATEGORIES,
  type Partner,
  type PartnerCategory,
  type DiscordServerEmbed,
} from '@/services/partners';

// Type for social links
type SocialLinks = {
  instagram?: string;
  discord?: string;
  youtube?: string;
  twitch?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
};
import toast from 'react-hot-toast';

// Discord icon component
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

// Twitch icon component
function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
    </svg>
  );
}

// Twitter/X icon component
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

interface PartnersProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'partners' | 'discord';

export function Partners({ isOpen, onClose }: PartnersProps) {
  const { currentUser, userProfile } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [discordServers, setDiscordServers] = useState<DiscordServerEmbed[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiscord, setLoadingDiscord] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PartnerCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<TabType>('partners');
  const [userPartnerStatus, setUserPartnerStatus] = useState<{
    isPartner: boolean;
    hasPendingApplication: boolean;
  }>({ isPartner: false, hasPendingApplication: false });

  // Reserved for future use
  void getUserRole(userProfile?.email || null, userProfile?.role as UserRole);

  // Check user partner status
  useEffect(() => {
    if (currentUser) {
      checkUserPartnerStatus(currentUser.uid).then(setUserPartnerStatus);
    }
  }, [currentUser]);

  // Subscribe to partners
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToPartners((partnerList) => {
      setPartners(partnerList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Subscribe to Discord servers
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToDiscordServers((servers) => {
      setDiscordServers(servers);
      setLoadingDiscord(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Handle view partner (anti-spam: só conta 1 vez por usuário)
  const handleViewPartner = async (partner: Partner) => {
    setSelectedPartner(partner);
    if (currentUser) {
      await incrementPartnerViews(partner.id, currentUser.uid);
    }
  };

  // Handle click social link (anti-spam: só conta 1 vez por usuário por parceiro)
  const handleSocialClick = async (partnerId: string, url: string) => {
    if (currentUser) {
      await incrementPartnerClicks(partnerId, currentUser.uid);
    }
    window.open(url, '_blank');
  };

  // Filter partners by category
  const filteredPartners = selectedCategory === 'all'
    ? partners
    : partners.filter(p => p.category === selectedCategory);

  // Featured partners
  const featuredPartners = partners.filter(p => p.isFeatured);

  const getSocialIcon = (type: keyof SocialLinks) => {
    switch (type) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'discord': return <DiscordIcon className="w-5 h-5" />;
      case 'twitch': return <TwitchIcon className="w-5 h-5" />;
      case 'twitter': return <TwitterIcon className="w-5 h-5" />;
      case 'tiktok': return <TikTokIcon className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getSocialColor = (type: keyof SocialLinks) => {
    switch (type) {
      case 'instagram': return 'from-purple-500 via-pink-500 to-orange-500';
      case 'youtube': return 'from-red-500 to-red-600';
      case 'discord': return 'from-indigo-500 to-indigo-600';
      case 'twitch': return 'from-purple-500 to-purple-600';
      case 'twitter': return 'from-zinc-700 to-zinc-800';
      case 'tiktok': return 'from-zinc-900 to-zinc-950';
      case 'website': return 'from-cyan-500 to-blue-500';
      default: return 'from-zinc-500 to-zinc-600';
    }
  };

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

          {/* Partners Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-2 md:inset-4 lg:inset-8 bg-zinc-900 rounded-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-500 flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                      Parceiros Oficiais
                      <span className="text-2xl">🤝</span>
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Conheça quem faz parte da nossa comunidade
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Users className="w-4 h-4" />
                  <span>{partners.length} parceiros</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <Star className="w-4 h-4" />
                  <span>{featuredPartners.length} em destaque</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                  <DiscordIcon className="w-4 h-4" />
                  <span>{discordServers.length} servidores</span>
                </div>
              </div>

              {/* Become Partner Button */}
              {currentUser && !userPartnerStatus.isPartner && (
                <div className="mt-4">
                  {userPartnerStatus.hasPendingApplication ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <Clock className="w-4 h-4" />
                      Sua solicitação está em análise
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-4 h-4" />
                      Quero ser Parceiro
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="px-4 md:px-6 py-3 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('partners')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'partners'
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Handshake className="w-4 h-4" />
                  Parceiros
                </button>
                <button
                  onClick={() => setActiveTab('discord')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'discord'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <DiscordIcon className="w-4 h-4" />
                  Servidores Discord
                </button>
              </div>
            </div>

            {/* Category Filter - Only show for partners tab */}
            {activeTab === 'partners' && (
              <div className="p-4 border-b border-white/10 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    Todos
                  </button>
                  {Object.entries(PARTNER_CATEGORIES).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as PartnerCategory)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedCategory === key
                          ? `bg-gradient-to-r ${config.gradient} text-white`
                          : 'bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      <span>{config.icon}</span>
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {/* Partners Tab */}
              {activeTab === 'partners' && (
                <>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                  ) : filteredPartners.length === 0 ? (
                    <div className="text-center py-12">
                      <Handshake className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Nenhum parceiro encontrado
                      </h3>
                      <p className="text-zinc-500">
                        {selectedCategory === 'all'
                          ? 'Em breve teremos parceiros incríveis aqui!'
                          : 'Não há parceiros nesta categoria ainda.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Featured Partners */}
                      {selectedCategory === 'all' && featuredPartners.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            Em Destaque
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featuredPartners.map((partner) => (
                              <PartnerCard
                                key={partner.id}
                                partner={partner}
                                featured
                                onClick={() => handleViewPartner(partner)}
                                onSocialClick={(url) => handleSocialClick(partner.id, url)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* All Partners Grid */}
                      <div>
                        {selectedCategory === 'all' && featuredPartners.length > 0 && (
                          <h3 className="text-lg font-bold text-white mb-4">Todos os Parceiros</h3>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredPartners
                            .filter(p => selectedCategory !== 'all' || !p.isFeatured)
                            .map((partner) => (
                              <PartnerCard
                                key={partner.id}
                                partner={partner}
                                onClick={() => handleViewPartner(partner)}
                                onSocialClick={(url) => handleSocialClick(partner.id, url)}
                              />
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Discord Servers Tab */}
              {activeTab === 'discord' && (
                <>
                  {loadingDiscord ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    </div>
                  ) : discordServers.length === 0 ? (
                    <div className="text-center py-12">
                      <DiscordIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Nenhum servidor adicionado
                      </h3>
                      <p className="text-zinc-500">
                        Em breve teremos servidores parceiros aqui!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Featured Servers */}
                      {discordServers.filter(s => s.isFeatured).length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            Servidores em Destaque
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {discordServers
                              .filter(s => s.isFeatured)
                              .map((server) => (
                                <DiscordServerCard key={server.id} server={server} featured />
                              ))}
                          </div>
                        </div>
                      )}

                      {/* All Servers */}
                      <div>
                        {discordServers.filter(s => s.isFeatured).length > 0 && (
                          <h3 className="text-lg font-bold text-white mb-4">Todos os Servidores</h3>
                        )}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                          {discordServers
                            .filter(s => !s.isFeatured)
                            .map((server) => (
                              <DiscordServerCard key={server.id} server={server} />
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Partner Detail Modal */}
          <AnimatePresence>
            {selectedPartner && (
              <PartnerDetailModal
                partner={selectedPartner}
                onClose={() => setSelectedPartner(null)}
                onSocialClick={(url) => handleSocialClick(selectedPartner.id, url)}
                getSocialIcon={getSocialIcon}
                getSocialColor={getSocialColor}
              />
            )}
          </AnimatePresence>

          {/* Application Form Modal */}
          <AnimatePresence>
            {showApplicationForm && currentUser && userProfile && (
              <PartnerApplicationForm
                userId={currentUser.uid}
                userEmail={userProfile.email}
                userName={userProfile.displayName}
                userPhoto={userProfile.photoURL || undefined}
                onClose={() => setShowApplicationForm(false)}
                onSuccess={() => {
                  setShowApplicationForm(false);
                  setUserPartnerStatus({ ...userPartnerStatus, hasPendingApplication: true });
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Discord Server Card Component
interface DiscordServerCardProps {
  server: DiscordServerEmbed;
  featured?: boolean;
}

function DiscordServerCard({ server, featured }: DiscordServerCardProps) {
  const categoryConfig = PARTNER_CATEGORIES[server.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl ${
        featured
          ? 'bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/10 border border-indigo-500/30'
          : 'glass'
      }`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            Destaque
          </span>
        </div>
      )}

      {/* Official badge */}
      {server.isOfficial && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Oficial
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
            <DiscordIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-lg truncate flex items-center gap-2">
              {server.name}
              {server.isOfficial && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            </h4>
            <span className={`inline-flex items-center gap-1 text-sm ${categoryConfig.color}`}>
              {categoryConfig.icon} {categoryConfig.name}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
          {server.description}
        </p>

        {/* Discord Widget Embed */}
        <div className="mb-4 rounded-xl overflow-hidden bg-[#2f3136]">
          <iframe
            src={`https://discord.com/widget?id=${server.serverId}&theme=dark`}
            width="100%"
            height="300"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            className="border-0"
            title={`Widget do servidor ${server.name}`}
          />
        </div>

        {/* Join Button */}
        <a
          href={server.inviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <DiscordIcon className="w-5 h-5" />
          Entrar no Servidor
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

// Partner Card Component
interface PartnerCardProps {
  partner: Partner;
  featured?: boolean;
  onClick: () => void;
  onSocialClick: (url: string) => void;
}

function PartnerCard({ partner, featured, onClick, onSocialClick }: PartnerCardProps) {
  const categoryConfig = PARTNER_CATEGORIES[partner.category];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl cursor-pointer ${
        featured
          ? 'bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 border border-amber-500/30'
          : 'glass'
      }`}
      onClick={onClick}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
            <Star className="w-3 h-3 fill-current" />
            Destaque
          </span>
        </div>
      )}

      {/* Partner glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.gradient} opacity-10`} />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              categoryConfig.icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white truncate flex items-center gap-2">
              {partner.name}
              <span className="text-lg">🤝</span>
            </h4>
            <span className={`text-xs ${categoryConfig.color}`}>
              {categoryConfig.name}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
          {partner.description}
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-2 flex-wrap">
          {partner.socialLinks.instagram && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSocialClick(partner.socialLinks.instagram!);
              }}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-80 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
            </button>
          )}
          {partner.socialLinks.youtube && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSocialClick(partner.socialLinks.youtube!);
              }}
              className="p-2 rounded-lg bg-red-500 text-white hover:opacity-80 transition-opacity"
            >
              <Youtube className="w-4 h-4" />
            </button>
          )}
          {partner.socialLinks.discord && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSocialClick(partner.socialLinks.discord!);
              }}
              className="p-2 rounded-lg bg-indigo-500 text-white hover:opacity-80 transition-opacity"
            >
              <DiscordIcon className="w-4 h-4" />
            </button>
          )}
          {partner.socialLinks.twitch && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSocialClick(partner.socialLinks.twitch!);
              }}
              className="p-2 rounded-lg bg-purple-500 text-white hover:opacity-80 transition-opacity"
            >
              <TwitchIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {partner.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <MousePointer className="w-3 h-3" />
            {partner.clickCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Partner Detail Modal
interface PartnerDetailModalProps {
  partner: Partner;
  onClose: () => void;
  onSocialClick: (url: string) => void;
  getSocialIcon: (type: keyof SocialLinks) => React.ReactNode;
  getSocialColor: (type: keyof SocialLinks) => string;
}

function PartnerDetailModal({ 
  partner, 
  onClose, 
  onSocialClick,
  getSocialIcon,
  getSocialColor,
}: PartnerDetailModalProps) {
  const categoryConfig = PARTNER_CATEGORIES[partner.category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg glass rounded-2xl overflow-hidden z-10"
      >
        {/* Banner */}
        <div className={`h-32 bg-gradient-to-br ${categoryConfig.gradient}`}>
          {partner.banner && (
            <img src={partner.banner} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Avatar */}
        <div className="relative px-6 -mt-12">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center text-4xl shadow-xl border-4 border-zinc-900`}>
            {partner.logo ? (
              <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              categoryConfig.icon
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {partner.name}
                <span className="text-2xl">🤝</span>
              </h3>
              <span className={`inline-flex items-center gap-1 text-sm ${categoryConfig.color}`}>
                {categoryConfig.icon} {categoryConfig.name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-zinc-300 mb-6">{partner.description}</p>

          {/* Benefits */}
          {partner.benefits.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-2">Benefícios</h4>
              <ul className="space-y-1">
                {partner.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Redes Sociais</h4>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(partner.socialLinks) as [keyof SocialLinks, string][])
                .filter(([, value]) => value)
                .map(([type, url]) => (
                  <button
                    key={type}
                    onClick={() => onSocialClick(url)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${getSocialColor(type)} text-white font-medium hover:opacity-90 transition-opacity`}
                  >
                    {getSocialIcon(type)}
                    <span className="capitalize">{type}</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </button>
                ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{partner.viewCount}</p>
              <p className="text-xs text-zinc-500">Visualizações</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{partner.clickCount}</p>
              <p className="text-xs text-zinc-500">Cliques</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Partner Application Form
interface PartnerApplicationFormProps {
  userId: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  onClose: () => void;
  onSuccess: () => void;
}

function PartnerApplicationForm({
  userId,
  userEmail,
  userName,
  userPhoto,
  onClose,
  onSuccess,
}: PartnerApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: userName,
    description: '',
    category: 'creator' as PartnerCategory,
    instagram: '',
    discord: '',
    youtube: '',
    twitch: '',
    twitter: '',
    tiktok: '',
    website: '',
    benefits: '',
    reason: '',
    audience: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.reason.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se tem pelo menos uma rede social
    const hasSocialLink = formData.instagram || formData.discord || formData.youtube || 
                          formData.twitch || formData.twitter || formData.tiktok || formData.website;
    
    if (!hasSocialLink) {
      toast.error('Adicione pelo menos uma rede social');
      return;
    }

    setSending(true);
    try {
      // Construir objeto de redes sociais apenas com valores preenchidos
      const socialLinks: Record<string, string> = {};
      if (formData.instagram.trim()) socialLinks.instagram = formData.instagram.trim();
      if (formData.discord.trim()) socialLinks.discord = formData.discord.trim();
      if (formData.youtube.trim()) socialLinks.youtube = formData.youtube.trim();
      if (formData.twitch.trim()) socialLinks.twitch = formData.twitch.trim();
      if (formData.twitter.trim()) socialLinks.twitter = formData.twitter.trim();
      if (formData.tiktok.trim()) socialLinks.tiktok = formData.tiktok.trim();
      if (formData.website.trim()) socialLinks.website = formData.website.trim();

      await submitPartnerApplication(
        userId,
        userEmail,
        userName,
        userPhoto || '',
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          socialLinks,
          benefits: formData.benefits.split('\n').filter(b => b.trim()),
          reason: formData.reason.trim(),
          audience: formData.audience.trim() || 'Não informado',
        }
      );
      toast.success('Solicitação enviada com sucesso! 🎉');
      onSuccess();
    } catch (error: unknown) {
      console.error('Erro ao enviar solicitação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao enviar solicitação: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl z-10"
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-white/10 bg-zinc-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Handshake className="w-6 h-6 text-cyan-400" />
                Quero ser Parceiro
              </h3>
              <p className="text-sm text-zinc-400">Preencha o formulário abaixo</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">
                Nome do Parceiro *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-modern w-full"
                placeholder="Seu nome ou marca"
                required
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as PartnerCategory })}
                className="input-modern w-full"
              >
                {Object.entries(PARTNER_CATEGORIES).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.icon} {config.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-modern w-full resize-none"
              rows={3}
              placeholder="Conte sobre você ou sua marca..."
              required
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="text-sm text-zinc-400 block mb-3">
              Redes Sociais (pelo menos uma)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link do Instagram"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500">
                  <DiscordIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link do Discord"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500">
                  <Youtube className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link do YouTube"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500">
                  <TwitchIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.twitch}
                  onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link da Twitch"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-700">
                  <TwitterIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link do Twitter/X"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <TikTokIcon className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link do TikTok"
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <div className="p-2 rounded-lg bg-cyan-500">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-modern flex-1"
                  placeholder="Link do seu site"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-2">
              Tamanho da sua audiência
            </label>
            <input
              type="text"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="input-modern w-full"
              placeholder="Ex: 10k no Instagram, 5k no YouTube..."
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-2">
              Por que quer ser parceiro? *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="input-modern w-full resize-none"
              rows={3}
              placeholder="Conta pra gente porque você quer fazer parte..."
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-2">
              O que você pode oferecer? (um por linha)
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="input-modern w-full resize-none"
              rows={3}
              placeholder="Divulgação nas redes&#10;Lives semanais&#10;Conteúdo exclusivo"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Partners Section for Landing Page
export function PartnersSection({ onOpenPartners }: { onOpenPartners: () => void }) {
  const [featuredPartners, setFeaturedPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPartners((partners) => {
      setFeaturedPartners(partners.filter(p => p.isFeatured).slice(0, 4));
    });
    return () => unsubscribe();
  }, []);

  if (featuredPartners.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
            <Handshake className="w-4 h-4" />
            Parceiros Oficiais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Quem faz parte da nossa
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400"> família</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Conheça os criadores e marcas que confiam no nosso trabalho
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {featuredPartners.map((partner, i) => {
            const categoryConfig = PARTNER_CATEGORIES[partner.category];
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors cursor-pointer"
                onClick={onOpenPartners}
              >
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center text-2xl mb-3`}>
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    categoryConfig.icon
                  )}
                </div>
                <h4 className="font-semibold text-white truncate">{partner.name}</h4>
                <p className={`text-xs ${categoryConfig.color}`}>{categoryConfig.name}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onOpenPartners}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Ver todos os parceiros
            <Handshake className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Suppress unused import warning
void MessageSquare;
