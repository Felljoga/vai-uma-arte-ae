import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Award, TrendingUp, Users, Flame, Eye } from 'lucide-react';

const artworks = [
  {
    id: 1,
    title: 'Identidade Visual Cyberpunk',
    author: 'Marina Silva',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=600&h=600&fit=crop',
    likes: 1289,
    comments: 87,
    views: 5420,
    featured: true,
    badge: 'Top Criador',
  },
  {
    id: 2,
    title: 'Logo Minimalista Tech',
    author: 'Pedro Henrique',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop',
    likes: 892,
    comments: 45,
    views: 3210,
    featured: false,
    badge: null,
  },
  {
    id: 3,
    title: 'Ilustração Digital NFT',
    author: 'Ana Beatriz',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop',
    likes: 2150,
    comments: 132,
    views: 8900,
    featured: true,
    badge: 'Artista do Mês',
  },
  {
    id: 4,
    title: 'Branding Sustentável',
    author: 'Lucas Mendes',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=600&fit=crop',
    likes: 756,
    comments: 38,
    views: 2890,
    featured: false,
    badge: null,
  },
  {
    id: 5,
    title: 'UI Dashboard Futurista',
    author: 'Carla Souza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop',
    likes: 1567,
    comments: 94,
    views: 6780,
    featured: true,
    badge: 'Trending',
  },
  {
    id: 6,
    title: 'Embalagem Premium',
    author: 'Rafael Costa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600&h=600&fit=crop',
    likes: 943,
    comments: 52,
    views: 4120,
    featured: false,
    badge: 'Novato Destaque',
  },
];

const topCreators = [
  { name: 'Marina Silva', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', points: 12450, rank: 1 },
  { name: 'Ana Beatriz', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', points: 11230, rank: 2 },
  { name: 'Carla Souza', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', points: 9870, rank: 3 },
];

export function Community() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <section id="comunidade" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Comunidade Criativa
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Inspire e seja <span className="gradient-neon">inspirado</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Descubra trabalhos incríveis, conecte-se com criadores e mostre seu talento para o mundo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {[
                { name: 'Trending', icon: Flame },
                { name: 'Novos', icon: TrendingUp },
                { name: 'Destaques', icon: Award },
                { name: 'Seguindo', icon: Users },
              ].map((tab, i) => (
                <motion.button
                  key={tab.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    i === 0
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </motion.button>
              ))}
            </div>

            {/* Artworks Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden glass-light card-hover"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Badge */}
                  {artwork.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {artwork.badge}
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={artwork.avatar}
                        alt={artwork.author}
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{artwork.title}</h4>
                        <p className="text-xs text-zinc-400">por {artwork.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.button
                          onClick={() => toggleLike(artwork.id)}
                          className="flex items-center gap-1 text-sm"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              likedPosts.includes(artwork.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-zinc-400'
                            }`}
                          />
                          <span className="text-zinc-400">
                            {artwork.likes + (likedPosts.includes(artwork.id) ? 1 : 0)}
                          </span>
                        </motion.button>
                        <button className="flex items-center gap-1 text-sm text-zinc-400">
                          <MessageCircle className="w-4 h-4" />
                          {artwork.comments}
                        </button>
                      </div>
                      <button className="text-zinc-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Views */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-xs text-white">
                    <Eye className="w-3 h-3" />
                    {(artwork.views / 1000).toFixed(1)}k
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explorar mais trabalhos
              </motion.button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Creators */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Top Criadores
              </h3>
              <div className="space-y-4">
                {topCreators.map((creator) => (
                  <div key={creator.rank} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      creator.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-black' :
                      creator.rank === 2 ? 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-black' :
                      'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                    }`}>
                      {creator.rank}
                    </span>
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{creator.name}</div>
                      <div className="text-xs text-zinc-400">{creator.points.toLocaleString()} pts</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-indigo-400 hover:text-indigo-300">
                Ver ranking completo →
              </button>
            </motion.div>

            {/* Join CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 text-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Junte-se à comunidade
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Conecte-se com mais de 50.000 criativos apaixonados.
              </p>
              <motion.button
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Criar Conta Grátis
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
