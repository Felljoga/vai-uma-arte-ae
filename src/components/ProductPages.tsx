import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Zap, Users, BookOpen, Crown, Check, Star, Trophy,
  Palette, Layout, PenTool, Image, Package, Layers, Clock, Shield,
  MessageSquare, Heart, Award, Target, TrendingUp, Gift,
  Play, FileText, Video, Lightbulb, GraduationCap, Rocket, ChevronRight,
  Instagram, Gem, Flame, Coffee, Headphones
} from 'lucide-react';

interface ProductPagesProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage: 'features' | 'pricing' | 'community' | 'educational';
  onOpenAuth?: () => void;
}

type PageType = 'features' | 'pricing' | 'community' | 'educational';

export function ProductPages({ isOpen, onClose, initialPage, onOpenAuth }: ProductPagesProps) {
  const [activePage, setActivePage] = useState<PageType>(initialPage);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pages = [
    { id: 'features' as PageType, label: 'Recursos', icon: Sparkles },
    { id: 'pricing' as PageType, label: 'Preços', icon: Crown },
    { id: 'community' as PageType, label: 'Comunidade', icon: Users },
    { id: 'educational' as PageType, label: 'Educacional', icon: BookOpen },
  ];

  // Features data
  const features = [
    {
      category: 'Design Sob Demanda',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      items: [
        { title: 'Logos & Identidade Visual', description: 'Criação de logos profissionais, manuais de marca e identidade visual completa', icon: Layers },
        { title: 'Social Media', description: 'Posts, stories, capas e todo tipo de material para suas redes sociais', icon: Image },
        { title: 'Ilustrações', description: 'Ilustrações personalizadas para qualquer finalidade', icon: PenTool },
        { title: 'UI/UX Design', description: 'Design de interfaces para apps e websites', icon: Layout },
        { title: 'Embalagens', description: 'Design de embalagens criativas para seus produtos', icon: Package },
      ]
    },
    {
      category: 'Agilidade & Qualidade',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      items: [
        { title: 'Entrega Rápida', description: 'Prazos de 24h a 15 dias conforme sua necessidade', icon: Clock },
        { title: 'Revisões Inclusas', description: 'Todas as artes incluem revisões para sua satisfação', icon: Check },
        { title: 'Arquivos Editáveis', description: 'Receba arquivos em alta qualidade e formatos editáveis', icon: FileText },
        { title: 'Suporte Dedicado', description: 'Atendimento humanizado via chat em tempo real', icon: MessageSquare },
      ]
    },
    {
      category: 'Comunidade & Gamificação',
      icon: Trophy,
      color: 'from-purple-500 to-indigo-500',
      items: [
        { title: 'Sistema de XP', description: 'Ganhe pontos de experiência a cada interação na plataforma', icon: Star },
        { title: 'Conquistas', description: 'Desbloqueie badges exclusivos por suas atividades', icon: Award },
        { title: 'Ranking', description: 'Apareça no ranking dos membros mais ativos', icon: TrendingUp },
        { title: 'Fórum Criativo', description: 'Participe de discussões e aprenda com a comunidade', icon: Users },
      ]
    },
    {
      category: 'Segurança & Transparência',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500',
      items: [
        { title: 'Pagamento Seguro', description: 'Transações protegidas pelo Mercado Pago', icon: Shield },
        { title: 'Preços Transparentes', description: 'Simulador de orçamento em tempo real', icon: Target },
        { title: 'Garantia de Satisfação', description: 'Revisões até você ficar 100% satisfeito', icon: Heart },
        { title: 'LGPD Compliant', description: 'Seus dados protegidos conforme a lei', icon: Shield },
      ]
    },
  ];

  // Pricing data
  const plans = [
    {
      name: 'Grátis',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfeito para começar',
      color: 'from-zinc-500 to-zinc-600',
      icon: Coffee,
      features: [
        '1 pedido por mês',
        '1 revisão por pedido',
        'Acesso à comunidade',
        'Suporte por email',
        'Arquivos em JPG/PNG',
      ],
      limitations: [
        'Sem prioridade na fila',
        'Sem arquivos editáveis',
        'Sem acesso ao fórum VIP',
      ]
    },
    {
      name: 'Pro',
      price: { monthly: 19.90, yearly: 199 },
      description: 'Para criadores frequentes',
      color: 'from-blue-500 to-cyan-500',
      icon: Zap,
      popular: false,
      features: [
        '5 pedidos por mês',
        '3 revisões por pedido',
        'Prioridade na fila',
        'Suporte prioritário',
        'Arquivos editáveis',
        'Desconto de 10% em extras',
        'Badge Pro exclusivo',
      ],
      limitations: []
    },
    {
      name: 'Studio',
      price: { monthly: 49.90, yearly: 499 },
      description: 'Ideal para pequenos negócios',
      color: 'from-purple-500 to-pink-500',
      icon: Gem,
      popular: true,
      features: [
        '15 pedidos por mês',
        '5 revisões por pedido',
        'Máxima prioridade',
        'Suporte VIP 24/7',
        'Todos os formatos',
        'Desconto de 20% em extras',
        'Badge Studio exclusivo',
        'Acesso ao fórum VIP',
        'Consultoria mensal',
      ],
      limitations: []
    },
    {
      name: 'Empresa',
      price: { monthly: 99.90, yearly: 999 },
      description: 'Para times e agências',
      color: 'from-amber-500 to-orange-500',
      icon: Flame,
      features: [
        'Pedidos ilimitados',
        'Revisões ilimitadas',
        'Atendimento exclusivo',
        'Gerente de conta dedicado',
        'Todos os formatos + RAW',
        'Desconto de 30% em extras',
        'Badge Empresa exclusivo',
        'Acesso total VIP',
        'Consultoria semanal',
        'API de integração',
        'Faturamento personalizado',
      ],
      limitations: []
    },
  ];

  // Community features
  const communityFeatures = [
    {
      title: 'Fórum de Discussões',
      description: 'Participe de conversas sobre design, tendências, dicas e muito mais com outros membros da comunidade.',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      stats: '500+ tópicos'
    },
    {
      title: 'Sistema de XP & Níveis',
      description: 'Ganhe pontos de experiência ao interagir na plataforma e suba de nível desbloqueando benefícios exclusivos.',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      stats: '50 níveis'
    },
    {
      title: 'Conquistas & Badges',
      description: 'Colecione badges exclusivos por suas realizações e mostre seu progresso para toda a comunidade.',
      icon: Award,
      color: 'from-amber-500 to-orange-500',
      stats: '30+ badges'
    },
    {
      title: 'Ranking de Membros',
      description: 'Apareça no ranking dos membros mais ativos e engajados da plataforma.',
      icon: Trophy,
      color: 'from-emerald-500 to-teal-500',
      stats: 'Top 100'
    },
    {
      title: 'Eventos Exclusivos',
      description: 'Participe de desafios de design, sorteios e eventos especiais da comunidade.',
      icon: Gift,
      color: 'from-rose-500 to-pink-500',
      stats: 'Mensais'
    },
    {
      title: 'Networking Criativo',
      description: 'Conecte-se com outros designers, empreendedores e criativos do Brasil inteiro.',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      stats: '1000+ membros'
    },
  ];

  // XP activities
  const xpActivities = [
    { action: 'Criar conta', xp: 100, icon: '🎉' },
    { action: 'Completar perfil', xp: 50, icon: '👤' },
    { action: 'Primeiro pedido', xp: 200, icon: '🛒' },
    { action: 'Criar tópico no fórum', xp: 30, icon: '💬' },
    { action: 'Responder no fórum', xp: 15, icon: '💭' },
    { action: 'Receber like', xp: 5, icon: '❤️' },
    { action: 'Login diário', xp: 10, icon: '📅' },
    { action: 'Avaliar pedido', xp: 25, icon: '⭐' },
    { action: 'Indicar amigo', xp: 100, icon: '👥' },
    { action: 'Completar tutorial', xp: 50, icon: '📚' },
  ];

  // Educational content
  const educationalContent = [
    {
      type: 'Cursos',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { title: 'Fundamentos do Design Gráfico', duration: '2h', lessons: 12, level: 'Iniciante' },
        { title: 'Design para Redes Sociais', duration: '1.5h', lessons: 8, level: 'Iniciante' },
        { title: 'Criando sua Identidade Visual', duration: '3h', lessons: 15, level: 'Intermediário' },
        { title: 'Psicologia das Cores', duration: '1h', lessons: 6, level: 'Iniciante' },
      ]
    },
    {
      type: 'Tutoriais',
      icon: Play,
      color: 'from-purple-500 to-pink-500',
      items: [
        { title: 'Como fazer um briefing perfeito', duration: '10min', lessons: 1, level: 'Iniciante' },
        { title: 'Escolhendo as cores certas', duration: '15min', lessons: 1, level: 'Iniciante' },
        { title: 'Tipografia para iniciantes', duration: '20min', lessons: 1, level: 'Iniciante' },
        { title: 'Preparando arquivos para impressão', duration: '12min', lessons: 1, level: 'Intermediário' },
      ]
    },
    {
      type: 'E-books',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      items: [
        { title: 'Guia Completo do Design Digital', duration: '45 páginas', lessons: 10, level: 'Todos' },
        { title: 'Manual de Identidade Visual', duration: '30 páginas', lessons: 7, level: 'Intermediário' },
        { title: 'Tendências de Design 2025', duration: '20 páginas', lessons: 5, level: 'Todos' },
      ]
    },
    {
      type: 'Lives & Workshops',
      icon: Video,
      color: 'from-amber-500 to-orange-500',
      items: [
        { title: 'Live semanal de Design', duration: 'Quintas 20h', lessons: 0, level: 'Todos' },
        { title: 'Workshop: Criando do Zero', duration: 'Mensal', lessons: 0, level: 'Intermediário' },
        { title: 'Q&A com Designers', duration: 'Quinzenal', lessons: 0, level: 'Todos' },
      ]
    },
  ];

  const benefits = [
    { icon: Lightbulb, title: 'Aprenda na Prática', description: 'Conteúdos aplicáveis imediatamente' },
    { icon: GraduationCap, title: 'Certificados', description: 'Receba certificados de conclusão' },
    { icon: Headphones, title: 'Suporte', description: 'Tire dúvidas com instrutores' },
    { icon: Rocket, title: 'Atualizações', description: 'Conteúdo sempre atualizado' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-[95vh] sm:h-auto sm:max-h-[90vh] max-w-6xl bg-zinc-900 sm:rounded-2xl overflow-hidden flex flex-col rounded-t-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Conheça a Plataforma</h2>
                    <p className="text-xs sm:text-sm text-zinc-400">Tudo sobre nossos produtos e serviços</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-1 mt-4 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-1 sm:flex-none justify-center ${
                      activePage === page.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <page.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{page.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {/* Features Page */}
                {activePage === 'features' && (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 sm:space-y-8"
                  >
                    {/* Hero */}
                    <div className="text-center mb-6 sm:mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Recursos <span className="gradient-text">Poderosos</span>
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
                        Tudo o que você precisa para ter designs profissionais, 
                        fazer parte de uma comunidade incrível e crescer criativamente.
                      </p>
                    </div>

                    {/* Features Grid */}
                    {features.map((category, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg sm:text-xl font-bold text-white">{category.category}</h4>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {category.items.map((item, itemIdx) => (
                            <motion.div
                              key={itemIdx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: itemIdx * 0.05 }}
                              className="glass p-4 rounded-xl hover:bg-white/10 transition-all group"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                  <item.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-semibold text-white text-sm sm:text-base">{item.title}</h5>
                                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* CTA */}
                    <div className="glass rounded-xl p-4 sm:p-6 text-center">
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Pronto para começar?</h4>
                      <p className="text-sm text-zinc-400 mb-4">Crie sua conta gratuita e descubra todo o potencial da plataforma.</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.button
                          onClick={() => {
                            onClose();
                            onOpenAuth?.();
                          }}
                          className="btn-primary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Criar Conta Grátis
                        </motion.button>
                        <motion.a
                          href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Instagram className="w-4 h-4" />
                          Fale Conosco
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Pricing Page */}
                {activePage === 'pricing' && (
                  <motion.div
                    key="pricing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Hero */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Planos & <span className="gradient-text">Preços</span>
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
                        Escolha o plano ideal para suas necessidades. Todos incluem acesso à comunidade!
                      </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-3">
                      <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>
                        Mensal
                      </span>
                      <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-14 h-7 rounded-full bg-white/10 p-1"
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          animate={{ x: billingCycle === 'yearly' ? 28 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                      <span className={`text-sm flex items-center gap-1 ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-500'}`}>
                        Anual
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                          -17%
                        </span>
                      </span>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {plans.map((plan, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`relative glass rounded-xl p-4 sm:p-5 ${
                            plan.popular ? 'ring-2 ring-purple-500' : ''
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                              Mais Popular
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                              <plan.icon className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl sm:text-3xl font-bold text-white">
                                R$ {plan.price[billingCycle].toFixed(2).replace('.', ',')}
                              </span>
                              {plan.price[billingCycle] > 0 && (
                                <span className="text-zinc-500 text-sm">
                                  /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                          </div>
                          
                          <ul className="space-y-2 mb-4">
                            {plan.features.map((feature, featureIdx) => (
                              <li key={featureIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                            {plan.limitations.map((limitation, limIdx) => (
                              <li key={limIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-500">
                                <X className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <motion.button
                            onClick={() => {
                              onClose();
                              onOpenAuth?.();
                            }}
                            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                              plan.popular
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {plan.price[billingCycle] === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>

                    {/* FAQ */}
                    <div className="glass rounded-xl p-4 sm:p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Perguntas Frequentes</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-white text-sm">Posso cancelar a qualquer momento?</h5>
                          <p className="text-xs text-zinc-400 mt-1">Sim! Você pode cancelar sua assinatura quando quiser, sem taxas.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-white text-sm">Os pedidos não utilizados acumulam?</h5>
                          <p className="text-xs text-zinc-400 mt-1">Não, os pedidos são mensais e não acumulam para o próximo período.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-white text-sm">Quais formas de pagamento aceitam?</h5>
                          <p className="text-xs text-zinc-400 mt-1">PIX, cartão de crédito e boleto via Mercado Pago.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-white text-sm">Posso fazer upgrade do plano?</h5>
                          <p className="text-xs text-zinc-400 mt-1">Sim! Você pode fazer upgrade a qualquer momento, pagando a diferença.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Community Page */}
                {activePage === 'community' && (
                  <motion.div
                    key="community"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Hero */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Nossa <span className="gradient-text">Comunidade</span>
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
                        Faça parte de uma comunidade vibrante de designers, empreendedores e criativos!
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Membros', value: '1.000+', icon: Users },
                        { label: 'Tópicos', value: '500+', icon: MessageSquare },
                        { label: 'Badges', value: '30+', icon: Award },
                        { label: 'Níveis', value: '50', icon: TrendingUp },
                      ].map((stat, idx) => (
                        <div key={idx} className="glass rounded-xl p-3 sm:p-4 text-center">
                          <stat.icon className="w-5 h-5 mx-auto text-purple-400 mb-2" />
                          <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-zinc-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {communityFeatures.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="glass rounded-xl p-4 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-zinc-400">
                              {feature.stats}
                            </span>
                          </div>
                          <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                          <p className="text-xs sm:text-sm text-zinc-400">{feature.description}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* XP System */}
                    <div className="glass rounded-xl p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Sistema de XP</h4>
                          <p className="text-xs text-zinc-400">Ganhe pontos e suba de nível!</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                        {xpActivities.map((activity, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                            <span className="text-xl sm:text-2xl">{activity.icon}</span>
                            <p className="text-xs text-zinc-300 mt-1 line-clamp-1">{activity.action}</p>
                            <p className="text-xs font-bold text-amber-400">+{activity.xp} XP</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="glass rounded-xl p-4 sm:p-6 text-center">
                      <h4 className="text-lg font-bold text-white mb-2">Junte-se à comunidade!</h4>
                      <p className="text-sm text-zinc-400 mb-4">Crie sua conta e comece a ganhar XP agora mesmo.</p>
                      <motion.button
                        onClick={() => {
                          onClose();
                          onOpenAuth?.();
                        }}
                        className="btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Users className="w-4 h-4" />
                        Entrar na Comunidade
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Educational Page */}
                {activePage === 'educational' && (
                  <motion.div
                    key="educational"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Hero */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Central <span className="gradient-text">Educacional</span>
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
                        Aprenda design, marketing e muito mais com nossos conteúdos exclusivos!
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {benefits.map((benefit, idx) => (
                        <div key={idx} className="glass rounded-xl p-3 sm:p-4 text-center">
                          <benefit.icon className="w-5 h-5 mx-auto text-indigo-400 mb-2" />
                          <h5 className="font-medium text-white text-xs sm:text-sm">{benefit.title}</h5>
                          <p className="text-xs text-zinc-400 mt-1">{benefit.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Content Categories */}
                    {educationalContent.map((category, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                            <category.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white">{category.type}</h4>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3">
                          {category.items.map((item, itemIdx) => (
                            <motion.div
                              key={itemIdx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: itemIdx * 0.05 }}
                              className="glass rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all cursor-pointer group"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-white text-sm sm:text-base group-hover:text-indigo-400 transition-colors line-clamp-1">
                                    {item.title}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-xs text-zinc-400">{item.duration}</span>
                                    {item.lessons > 0 && (
                                      <>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-xs text-zinc-400">{item.lessons} aulas</span>
                                      </>
                                    )}
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-zinc-400">
                                      {item.level}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Coming Soon */}
                    <div className="glass rounded-xl p-4 sm:p-6 border border-indigo-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Em Breve</h4>
                          <p className="text-xs text-zinc-400">Novidades chegando!</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-xl">🎓</span>
                          <p className="text-sm text-white mt-1">Certificados Oficiais</p>
                          <p className="text-xs text-zinc-400">Para seu currículo</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-xl">🏆</span>
                          <p className="text-sm text-white mt-1">Desafios de Design</p>
                          <p className="text-xs text-zinc-400">Com prêmios reais</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-xl">👨‍🏫</span>
                          <p className="text-sm text-white mt-1">Mentorias</p>
                          <p className="text-xs text-zinc-400">Com designers experts</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="glass rounded-xl p-4 sm:p-6 text-center">
                      <h4 className="text-lg font-bold text-white mb-2">Acesse todos os conteúdos</h4>
                      <p className="text-sm text-zinc-400 mb-4">Membros têm acesso gratuito a toda a central educacional.</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.button
                          onClick={() => {
                            onClose();
                            onOpenAuth?.();
                          }}
                          className="btn-primary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BookOpen className="w-4 h-4" />
                          Acessar Conteúdos
                        </motion.button>
                        <motion.a
                          href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Instagram className="w-4 h-4" />
                          Siga para Novidades
                        </motion.a>
                      </div>
                    </div>
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
