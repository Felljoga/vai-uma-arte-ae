import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, Users, Target, Heart, Zap, Globe,
  Sparkles, BookOpen, Calendar, Clock, ArrowRight, Tag,
  Briefcase, MapPin, DollarSign, Star, CheckCircle, Send,
  Instagram, Palette, TrendingUp, Shield, Coffee, Rocket,
  PenTool, Megaphone, HeadphonesIcon, ChevronRight,
  Quote, ExternalLink
} from 'lucide-react';

interface CompanyPagesProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: 'about' | 'blog' | 'careers';
  onOpenPartners?: () => void;
}

type PageType = 'about' | 'blog' | 'careers';

// Dados do time
const teamMembers = [
  {
    name: 'Wanderson Silva',
    role: 'Fundador & CEO',
    bio: 'Apaixonado por design e tecnologia. Criou a VAI UMA ARTE AÊ?! para democratizar o acesso a design de qualidade no Brasil.',
    avatar: '👨‍💻',
    color: 'from-indigo-500 to-purple-500'
  }
];

// Valores da empresa
const companyValues = [
  {
    icon: Heart,
    title: 'Paixão pelo Design',
    description: 'Cada arte é criada com amor e dedicação para superar expectativas.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Comunidade em Primeiro Lugar',
    description: 'Construímos juntos. Nossa comunidade é o coração de tudo.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Velocidade & Qualidade',
    description: 'Entregas rápidas sem comprometer a excelência do trabalho.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Transparência Total',
    description: 'Preços justos, comunicação clara e sem surpresas.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Rocket,
    title: 'Inovação Constante',
    description: 'Sempre buscando novas formas de melhorar sua experiência.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Globe,
    title: '100% Brasileiro',
    description: 'Orgulho de ser uma plataforma feita por brasileiros para brasileiros.',
    color: 'from-green-500 to-yellow-500'
  }
];

// Timeline da empresa
const companyTimeline = [
  {
    year: '2024',
    title: 'O Início',
    description: 'VAI UMA ARTE AÊ?! nasce com a missão de democratizar o design no Brasil.',
    icon: Sparkles
  },
  {
    year: '2024',
    title: 'Lançamento da Plataforma',
    description: 'Versão completa com pedidos, comunidade, fórum e sistema de planos.',
    icon: Rocket
  },
  {
    year: '2025',
    title: 'Expansão',
    description: 'Novos recursos, mais artistas parceiros e expansão nacional.',
    icon: TrendingUp
  }
];

// Posts do blog
const blogPosts = [
  {
    id: 1,
    title: 'Como criar uma identidade visual que conecta com seu público',
    excerpt: 'Descubra os segredos para desenvolver uma marca memorável que ressoa com seus clientes e se destaca no mercado.',
    category: 'Design',
    categoryColor: 'bg-pink-500/20 text-pink-400',
    date: '15 Jan 2025',
    readTime: '5 min',
    image: '🎨',
    featured: true
  },
  {
    id: 2,
    title: '5 tendências de design para 2025 que você precisa conhecer',
    excerpt: 'Fique por dentro das principais tendências visuais que vão dominar o ano e como aplicá-las no seu negócio.',
    category: 'Tendências',
    categoryColor: 'bg-purple-500/20 text-purple-400',
    date: '12 Jan 2025',
    readTime: '7 min',
    image: '🚀'
  },
  {
    id: 3,
    title: 'Por que investir em design profissional para sua empresa',
    excerpt: 'Entenda como o design de qualidade pode impactar diretamente nas vendas e na percepção da sua marca.',
    category: 'Negócios',
    categoryColor: 'bg-blue-500/20 text-blue-400',
    date: '10 Jan 2025',
    readTime: '4 min',
    image: '💼'
  },
  {
    id: 4,
    title: 'Guia completo: Como fazer um briefing perfeito',
    excerpt: 'Aprenda a comunicar suas ideias de forma clara para obter resultados incríveis em seus projetos de design.',
    category: 'Tutoriais',
    categoryColor: 'bg-green-500/20 text-green-400',
    date: '08 Jan 2025',
    readTime: '6 min',
    image: '📝'
  },
  {
    id: 5,
    title: 'A psicologia das cores no marketing digital',
    excerpt: 'Como as cores influenciam decisões de compra e como usar isso a favor da sua marca.',
    category: 'Marketing',
    categoryColor: 'bg-orange-500/20 text-orange-400',
    date: '05 Jan 2025',
    readTime: '8 min',
    image: '🌈'
  },
  {
    id: 6,
    title: 'Design para redes sociais: O que funciona em 2025',
    excerpt: 'Estratégias visuais comprovadas para aumentar seu engajamento no Instagram, TikTok e outras redes.',
    category: 'Social Media',
    categoryColor: 'bg-cyan-500/20 text-cyan-400',
    date: '02 Jan 2025',
    readTime: '5 min',
    image: '📱'
  }
];

// Categorias do blog
const blogCategories = [
  { name: 'Todos', count: 6 },
  { name: 'Design', count: 1 },
  { name: 'Tendências', count: 1 },
  { name: 'Negócios', count: 1 },
  { name: 'Tutoriais', count: 1 },
  { name: 'Marketing', count: 1 },
  { name: 'Social Media', count: 1 }
];

// Vagas disponíveis
const jobOpenings = [
  {
    id: 1,
    title: 'Designer Gráfico Freelancer',
    department: 'Design',
    type: 'Freelancer',
    location: 'Remoto',
    salary: 'Por projeto',
    description: 'Buscamos designers talentosos para criar artes incríveis para nossos clientes. Flexibilidade total de horários.',
    requirements: [
      'Portfolio com trabalhos de qualidade',
      'Domínio de Adobe Creative Suite ou Figma',
      'Boa comunicação e cumprimento de prazos',
      'Criatividade e atenção aos detalhes'
    ],
    benefits: [
      'Trabalhe de onde quiser',
      'Horários flexíveis',
      'Pagamento por projeto',
      'Faça parte de uma comunidade criativa'
    ],
    color: 'from-pink-500 to-rose-500',
    icon: PenTool,
    urgent: true
  },
  {
    id: 2,
    title: 'Ilustrador Digital',
    department: 'Design',
    type: 'Freelancer',
    location: 'Remoto',
    salary: 'Por projeto',
    description: 'Procuramos ilustradores com estilo único para criar ilustrações personalizadas e encantadoras.',
    requirements: [
      'Portfolio de ilustrações originais',
      'Estilo próprio e versátil',
      'Experiência com ilustração digital',
      'Disponibilidade para projetos variados'
    ],
    benefits: [
      'Liberdade criativa',
      'Projetos diversificados',
      'Networking com outros artistas',
      'Divulgação do seu trabalho'
    ],
    color: 'from-purple-500 to-indigo-500',
    icon: Palette
  },
  {
    id: 3,
    title: 'Social Media Designer',
    department: 'Marketing',
    type: 'Freelancer',
    location: 'Remoto',
    salary: 'Por projeto',
    description: 'Designer especializado em criar conteúdo visual para redes sociais que engaja e converte.',
    requirements: [
      'Experiência com design para Instagram/TikTok',
      'Conhecimento de tendências de social media',
      'Agilidade e criatividade',
      'Portfolio com cases de redes sociais'
    ],
    benefits: [
      'Projetos constantes',
      'Clientes variados',
      'Crescimento profissional',
      'Ambiente colaborativo'
    ],
    color: 'from-cyan-500 to-blue-500',
    icon: Megaphone
  },
  {
    id: 4,
    title: 'Moderador da Comunidade',
    department: 'Comunidade',
    type: 'Voluntário',
    location: 'Remoto',
    salary: 'Benefícios exclusivos',
    description: 'Ajude a manter nossa comunidade saudável, engajada e acolhedora para todos.',
    requirements: [
      'Ser membro ativo da comunidade',
      'Boa comunicação e empatia',
      'Disponibilidade de algumas horas por semana',
      'Paixão por ajudar pessoas'
    ],
    benefits: [
      'Badge exclusivo de Moderador',
      'Acesso antecipado a novidades',
      'Plano Pro gratuito',
      'Participação em decisões da plataforma'
    ],
    color: 'from-green-500 to-emerald-500',
    icon: HeadphonesIcon
  }
];

// Benefícios de trabalhar conosco
const workBenefits = [
  { icon: Globe, title: '100% Remoto', description: 'Trabalhe de qualquer lugar do Brasil' },
  { icon: Clock, title: 'Flexibilidade', description: 'Você define seus horários' },
  { icon: Coffee, title: 'Ambiente Criativo', description: 'Comunidade colaborativa' },
  { icon: TrendingUp, title: 'Crescimento', description: 'Desenvolva suas habilidades' },
  { icon: DollarSign, title: 'Pagamento Justo', description: 'Valores competitivos' },
  { icon: Heart, title: 'Propósito', description: 'Faça parte de algo maior' }
];

export function CompanyPages({ isOpen, onClose, initialPage = 'about', onOpenPartners }: CompanyPagesProps) {
  const [activePage, setActivePage] = useState<PageType>(initialPage);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    portfolio: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);

  const filteredPosts = selectedCategory === 'Todos' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setApplicationSent(true);
  };

  const pages: { id: PageType; label: string; icon: React.ElementType }[] = [
    { id: 'about', label: 'Sobre Nós', icon: Building2 },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'careers', label: 'Carreiras', icon: Briefcase }
  ];

  const renderAboutPage = () => (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Conheça a{' '}
          <span className="gradient-text">VAI UMA ARTE AÊ?!</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto px-2">
          Somos uma plataforma brasileira de design sob demanda que nasceu para democratizar 
          o acesso a artes de qualidade profissional para todos.
        </p>
      </div>

      {/* Missão, Visão, Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Missão</h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Democratizar o acesso a design de qualidade, conectando pessoas e empresas 
            a artistas talentosos com preços justos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Visão</h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Ser a maior e mais amada plataforma de design do Brasil, conhecida por 
            qualidade, rapidez e comunidade.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Propósito</h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Acreditamos que todo negócio merece uma identidade visual incrível, 
            independente do tamanho ou orçamento.
          </p>
        </motion.div>
      </div>

      {/* Valores */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Nossos Valores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {companyValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center`}>
                <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white text-sm sm:text-base">{value.title}</h4>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Nossa Jornada</h3>
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="space-y-6 sm:space-y-8">
            {companyTimeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center gap-4 sm:gap-6 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Mobile: always left aligned */}
                <div className="sm:hidden flex items-start gap-4">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="glass rounded-xl p-4 flex-1">
                    <span className="text-xs text-indigo-400 font-medium">{item.year}</span>
                    <h4 className="font-semibold text-white text-sm mt-1">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden sm:flex items-center gap-6 w-full">
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left order-2'}`}>
                    <div className={`glass rounded-xl p-5 inline-block ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                      <span className="text-xs text-indigo-400 font-medium">{item.year}</span>
                      <h4 className="font-semibold text-white mt-1">{item.title}</h4>
                      <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Time */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Nosso Time</h3>
        <div className="flex justify-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center max-w-xs"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-3xl sm:text-4xl`}>
                {member.avatar}
              </div>
              <h4 className="font-bold text-white text-base sm:text-lg">{member.name}</h4>
              <p className="text-xs sm:text-sm text-indigo-400 mb-2">{member.role}</p>
              <p className="text-xs sm:text-sm text-zinc-400">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
      >
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Quer fazer parte dessa história?</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Junte-se à nossa comunidade ou torne-se um parceiro
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.a
            href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Instagram className="w-4 h-4" />
            Siga no Instagram
          </motion.a>
          {onOpenPartners && (
            <motion.button
              onClick={onOpenPartners}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Seja um Parceiro
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderBlogPage = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Blog</h2>
        <p className="text-sm sm:text-base text-zinc-400">
          Dicas, tendências e insights sobre design e criatividade
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {blogCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.name
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category.name}
            <span className="ml-1 opacity-60">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {filteredPosts.find(p => p.featured) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl sm:rounded-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 h-40 sm:h-48 md:h-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-6xl sm:text-8xl">
              {filteredPosts.find(p => p.featured)?.image}
            </div>
            <div className="p-4 sm:p-6 md:p-8 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                  Em Destaque
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${filteredPosts.find(p => p.featured)?.categoryColor}`}>
                  {filteredPosts.find(p => p.featured)?.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                {filteredPosts.find(p => p.featured)?.title}
              </h3>
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                {filteredPosts.find(p => p.featured)?.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {filteredPosts.find(p => p.featured)?.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {filteredPosts.find(p => p.featured)?.readTime} de leitura
                </span>
              </div>
              <motion.button
                className="mt-4 inline-flex items-center gap-2 text-indigo-400 text-sm font-medium hover:text-indigo-300"
                whileHover={{ x: 5 }}
              >
                Ler artigo
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPosts.filter(p => !p.featured).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl overflow-hidden group cursor-pointer hover:border-white/20 transition-colors"
          >
            <div className="h-32 sm:h-40 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
              {post.image}
            </div>
            <div className="p-4 sm:p-5">
              <span className={`px-2 py-1 rounded-full text-xs ${post.categoryColor}`}>
                {post.category}
              </span>
              <h3 className="font-bold text-white mt-2 sm:mt-3 mb-2 text-sm sm:text-base line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
      >
        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-indigo-400" />
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          Não perca nenhum artigo!
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Siga nosso Instagram para receber as novidades em primeira mão
        </p>
        <motion.a
          href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Instagram className="w-4 h-4" />
          Seguir no Instagram
        </motion.a>
      </motion.div>
    </div>
  );

  const renderCareersPage = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Carreiras</h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Faça parte do time que está revolucionando o design no Brasil
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {workBenefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-3 sm:p-4 text-center"
          >
            <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-indigo-400" />
            <h4 className="font-semibold text-white text-xs sm:text-sm">{benefit.title}</h4>
            <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Job Openings */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
          Vagas Abertas
          <span className="ml-2 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs sm:text-sm">
            {jobOpenings.length} vagas
          </span>
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedJob(job)}
              className="glass rounded-xl p-4 sm:p-5 cursor-pointer hover:border-white/20 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center`}>
                  <job.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm sm:text-base">{job.title}</h4>
                    {job.urgent && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] sm:text-xs">
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 sm:line-clamp-1">{job.description}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500">
                      <Briefcase className="w-3 h-3" />
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500">
                      <DollarSign className="w-3 h-3" />
                      {job.salary}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500">
                      <Tag className="w-3 h-3" />
                      {job.type}
                    </span>
                  </div>
                </div>

                <ChevronRight className="hidden sm:block w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
      >
        <Quote className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-indigo-400" />
        <p className="text-base sm:text-lg text-white italic mb-4 max-w-2xl mx-auto">
          "Não encontrou uma vaga que combina com você? Envie seu portfolio mesmo assim! 
          Estamos sempre em busca de talentos."
        </p>
        <motion.a
          href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Instagram className="w-4 h-4" />
          Enviar pelo Instagram
        </motion.a>
      </motion.div>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setSelectedJob(null);
              setApplicationSent(false);
              setApplicationForm({ name: '', email: '', portfolio: '', message: '' });
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl"
            >
              {/* Header */}
              <div className={`p-4 sm:p-6 bg-gradient-to-r ${selectedJob.color} rounded-t-2xl`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <selectedJob.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{selectedJob.title}</h3>
                      <p className="text-xs sm:text-sm text-white/80">{selectedJob.department} • {selectedJob.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedJob(null);
                      setApplicationSent(false);
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {applicationSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Candidatura Enviada!</h4>
                    <p className="text-zinc-400 mb-4">
                      Recebemos seu interesse. Entraremos em contato pelo Instagram em breve!
                    </p>
                    <motion.a
                      href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                    >
                      <Instagram className="w-4 h-4" />
                      Seguir no Instagram
                      <ExternalLink className="w-3 h-3" />
                    </motion.a>
                  </motion.div>
                ) : (
                  <>
                    {/* Info */}
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-zinc-300">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        {selectedJob.location}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-zinc-300">
                        <DollarSign className="w-4 h-4 text-zinc-500" />
                        {selectedJob.salary}
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-zinc-300">
                        <Briefcase className="w-4 h-4 text-zinc-500" />
                        {selectedJob.type}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Sobre a vaga</h4>
                      <p className="text-sm text-zinc-400">{selectedJob.description}</p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Requisitos</h4>
                      <ul className="space-y-2">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                            <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-white mb-2">Benefícios</h4>
                      <ul className="space-y-2">
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                            <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Application Form */}
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="font-semibold text-white mb-4">Candidate-se</h4>
                      <form onSubmit={handleApplicationSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-zinc-400 mb-1">Nome completo</label>
                            <input
                              type="text"
                              value={applicationForm.name}
                              onChange={(e) => setApplicationForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-zinc-400 mb-1">Email</label>
                            <input
                              type="email"
                              value={applicationForm.email}
                              onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">Link do Portfolio / Instagram</label>
                          <input
                            type="url"
                            value={applicationForm.portfolio}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolio: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none"
                            placeholder="https://"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">Por que você quer fazer parte do time?</label>
                          <textarea
                            value={applicationForm.message}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-indigo-500 focus:outline-none resize-none"
                            rows={3}
                            required
                          />
                        </div>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Enviar Candidatura
                            </>
                          )}
                        </motion.button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col glass rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 mr-4">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      activePage === page.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <page.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{page.label}</span>
                    <span className="sm:hidden">{page.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activePage === 'about' && renderAboutPage()}
                  {activePage === 'blog' && renderBlogPage()}
                  {activePage === 'careers' && renderCareersPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
