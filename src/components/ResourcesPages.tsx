import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  HelpCircle,
  Book,
  Map,
  Activity,
  Search,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  CreditCard,
  Palette,
  Users,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Instagram,
  Sparkles,
  FileText,
  Target,
  Rocket,
  Heart,
  Star,
  Lightbulb,
  Package,
  RefreshCw,
  Eye,
  Code,
  BookOpen,
  TrendingUp
} from 'lucide-react';

type ResourcePage = 'help' | 'docs' | 'guides' | 'status';

interface ResourcesPagesProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage: ResourcePage;
}

// FAQ Data
const faqCategories = [
  {
    id: 'getting-started',
    name: 'Primeiros Passos',
    icon: Rocket,
    color: 'text-green-400',
    questions: [
      {
        q: 'Como criar uma conta na plataforma?',
        a: 'É muito simples! Clique no botão "Começar Gratuitamente" no topo da página. Você pode se cadastrar usando seu email ou diretamente com sua conta Google. Após o cadastro, você receberá um email de confirmação.'
      },
      {
        q: 'A plataforma é gratuita?',
        a: 'Sim! Oferecemos um plano gratuito com acesso a recursos básicos. Você pode solicitar até 2 pedidos por mês gratuitamente. Para mais recursos, confira nossos planos Pro, Studio e Empresa.'
      },
      {
        q: 'Como funciona o processo de criação de arte?',
        a: '1) Acesse o Simulador de Orçamento e configure sua arte. 2) Envie seu pedido com detalhes do que deseja. 3) Nossa equipe analisa e inicia a criação. 4) Você recebe a arte para revisão. 5) Solicite ajustes se necessário. 6) Receba os arquivos finais!'
      },
      {
        q: 'Quanto tempo leva para receber minha arte?',
        a: 'Depende do prazo escolhido: 24h (urgente), 3 dias (rápido), 7 dias (normal) ou 15 dias (econômico). O prazo começa a contar após a confirmação do pedido.'
      }
    ]
  },
  {
    id: 'orders',
    name: 'Pedidos',
    icon: Package,
    color: 'text-blue-400',
    questions: [
      {
        q: 'Como faço um novo pedido de arte?',
        a: 'Use o Simulador de Orçamento na página inicial. Selecione o tipo de arte, complexidade, prazo e outras opções. Clique em "Solicitar Esta Arte" para enviar seu pedido. Você pode adicionar detalhes e referências no chat do pedido.'
      },
      {
        q: 'Como acompanho o status do meu pedido?',
        a: 'Acesse seu Dashboard clicando no seu avatar no menu. Na aba "Meus Pedidos" você vê todos os seus pedidos com status em tempo real: Pendente, Em Andamento, Revisão ou Concluído.'
      },
      {
        q: 'Quantas revisões estão incluídas?',
        a: 'Depende do pacote escolhido: 1 revisão (básico), 3 revisões (+R$10), 5 revisões (+R$20) ou revisões ilimitadas (+R$40). Cada revisão pode incluir ajustes de cores, posicionamento, texto e outros elementos.'
      },
      {
        q: 'Posso cancelar um pedido?',
        a: 'Sim, pedidos podem ser cancelados se ainda estiverem com status "Pendente". Uma vez que a equipe começar a trabalhar, o cancelamento pode ter custos. Entre em contato pelo chat do pedido para solicitar.'
      },
      {
        q: 'Em quais formatos recebo a arte final?',
        a: 'Você recebe em PNG de alta resolução. Dependendo do tipo de arte e plano, também pode receber: JPG, PDF, SVG e arquivos editáveis (AI, PSD, Figma).'
      }
    ]
  },
  {
    id: 'payments',
    name: 'Pagamentos',
    icon: CreditCard,
    color: 'text-amber-400',
    questions: [
      {
        q: 'Quais formas de pagamento são aceitas?',
        a: 'Aceitamos via Mercado Pago: PIX (confirmação instantânea), Cartão de Crédito (parcelamento em até 12x), Cartão de Débito e Boleto Bancário (até 3 dias úteis para compensar).'
      },
      {
        q: 'Como funciona o pagamento dos planos?',
        a: 'Os planos podem ser mensais ou anuais. O pagamento anual oferece desconto de até 17%. Você é redirecionado ao Mercado Pago para concluir o pagamento com segurança.'
      },
      {
        q: 'Posso parcelar o pagamento?',
        a: 'Sim! Pagamentos com cartão de crédito podem ser parcelados em até 12x. O parcelamento é processado pelo Mercado Pago.'
      },
      {
        q: 'Como solicito reembolso?',
        a: 'Reembolsos podem ser solicitados em até 7 dias após a entrega se a arte não atender às especificações do briefing. Entre em contato pelo Instagram ou pelo chat do pedido.'
      },
      {
        q: 'Os pagamentos são seguros?',
        a: 'Sim! Todos os pagamentos são processados pelo Mercado Pago, uma das maiores plataformas de pagamento da América Latina, com criptografia de ponta e proteção ao comprador.'
      }
    ]
  },
  {
    id: 'community',
    name: 'Comunidade',
    icon: Users,
    color: 'text-purple-400',
    questions: [
      {
        q: 'O que é a comunidade criativa?',
        a: 'É um espaço onde artistas e clientes podem compartilhar trabalhos, trocar experiências e se inspirar. Você pode curtir artes, comentar e ganhar pontos de experiência!'
      },
      {
        q: 'Como funciona o sistema de XP e níveis?',
        a: 'Você ganha XP ao: criar pedidos (50 XP), postar no fórum (10 XP), receber curtidas (5 XP), completar perfil (25 XP). Ao acumular XP, você sobe de nível e desbloqueia conquistas!'
      },
      {
        q: 'O que são as conquistas/badges?',
        a: 'São distintivos que você ganha por ações especiais: primeiro pedido, 10 curtidas, 1 ano na plataforma, ser parceiro, etc. Eles aparecem no seu perfil e mostram sua jornada!'
      },
      {
        q: 'Como participar do fórum?',
        a: 'Clique em "Fórum" no menu. Você pode criar novas threads, responder discussões, curtir posts e participar de diferentes salas temáticas. O VIP Lounge é exclusivo para assinantes!'
      }
    ]
  },
  {
    id: 'partnership',
    name: 'Parcerias',
    icon: Heart,
    color: 'text-pink-400',
    questions: [
      {
        q: 'Como me tornar um parceiro?',
        a: 'Acesse a seção de Parceiros e clique em "Quero Ser Parceiro". Preencha o formulário com suas informações e redes sociais. Nossa equipe analisará sua solicitação em até 7 dias.'
      },
      {
        q: 'Quais os benefícios de ser parceiro?',
        a: 'Parceiros recebem: selo exclusivo no perfil, divulgação na página de parceiros, acesso ao VIP Lounge, descontos especiais em pedidos e prioridade no atendimento.'
      },
      {
        q: 'Quais os requisitos para parceria?',
        a: 'Buscamos criadores de conteúdo, artistas, marcas e influenciadores com audiência engajada. Não há número mínimo de seguidores, valorizamos a qualidade e alinhamento com nossa marca.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Conta e Perfil',
    icon: Settings,
    color: 'text-cyan-400',
    questions: [
      {
        q: 'Como editar meu perfil?',
        a: 'Clique no seu avatar no menu e acesse o Dashboard. Na aba "Perfil" você pode editar: nome, bio, avatar, estilo preferido e links do portfólio.'
      },
      {
        q: 'Como alterar minha senha?',
        a: 'Atualmente, você pode redefinir sua senha pela opção "Esqueci minha senha" na tela de login. Um email será enviado com um link seguro para criar nova senha.'
      },
      {
        q: 'Posso excluir minha conta?',
        a: 'Sim, você tem direito à exclusão de dados conforme a LGPD. Entre em contato pelo Instagram para solicitar a exclusão. Seus pedidos finalizados serão mantidos por questões fiscais.'
      },
      {
        q: 'Como ativar/desativar notificações?',
        a: 'No seu Dashboard, acesse as Configurações. Lá você pode gerenciar notificações de pedidos, mensagens, atualizações da comunidade e newsletters.'
      }
    ]
  }
];

// Documentation sections
const documentationSections = [
  {
    id: 'overview',
    name: 'Visão Geral',
    icon: Eye,
    content: `
## Bem-vindo à VAI UMA ARTE AÊ?!

A **VAI UMA ARTE AÊ?!** é a plataforma brasileira mais moderna de design sob demanda. Conectamos você a soluções criativas de alta qualidade de forma rápida, acessível e profissional.

### Nossa Missão
Democratizar o acesso ao design de qualidade, permitindo que empreendedores, criadores de conteúdo e empresas tenham artes profissionais sem gastar fortunas.

### O que oferecemos
- **Artes Personalizadas**: Logos, posts, ilustrações, UI design, branding e embalagens
- **Preços Acessíveis**: A partir de R$ 15 por arte
- **Prazos Flexíveis**: De 24h a 15 dias
- **Comunidade Ativa**: Fórum, networking e aprendizado
- **Área Educacional**: Cursos e tutoriais

### Tecnologia
Nossa plataforma é construída com as mais modernas tecnologias:
- Interface responsiva e rápida
- Sistema de chat em tempo real
- Pagamentos seguros via Mercado Pago
- Infraestrutura Firebase (Google Cloud)
- Experiência sonora imersiva
    `
  },
  {
    id: 'orders-flow',
    name: 'Fluxo de Pedidos',
    icon: RefreshCw,
    content: `
## Como funciona um pedido

### 1. Configuração
Use o **Simulador de Orçamento** para configurar:
- Tipo de arte (logo, social media, ilustração, etc.)
- Nível de complexidade
- Prazo de entrega
- Número de revisões
- Uso comercial ou pessoal

### 2. Envio do Pedido
Ao clicar em "Solicitar Esta Arte":
- Seu pedido é registrado no sistema
- Você recebe confirmação por email
- Status inicial: **Pendente**

### 3. Análise
Nossa equipe analisa seu pedido:
- Verificamos os detalhes do briefing
- Iniciamos a criação
- Status muda para: **Em Andamento**

### 4. Entrega
Quando a arte está pronta:
- Você recebe notificação
- Status muda para: **Revisão**
- Avalie e solicite ajustes se necessário

### 5. Revisões
Dependendo do seu pacote:
- 1 revisão (básico) - incluída
- 3, 5 ou ilimitadas - conforme contratado

### 6. Finalização
Após aprovação:
- Status: **Concluído**
- Arquivos liberados para download
- Você ganha 50 XP!

### Status dos Pedidos
| Status | Descrição |
|--------|-----------|
| 🟡 Pendente | Aguardando análise |
| 🔵 Em Andamento | Sendo criado |
| 🟣 Revisão | Aguardando sua aprovação |
| 🟢 Concluído | Finalizado com sucesso |
    `
  },
  {
    id: 'plans',
    name: 'Planos e Preços',
    icon: CreditCard,
    content: `
## Planos Disponíveis

### Grátis - R$ 0/mês
- 2 pedidos por mês
- 1 revisão por pedido
- Acesso à comunidade
- Suporte por chat

### Pro - R$ 19,90/mês
- 10 pedidos por mês
- 3 revisões por pedido
- Prioridade no atendimento
- 10% de desconto
- Acesso ao VIP Lounge

### Studio - R$ 49,90/mês
- 30 pedidos por mês
- 5 revisões por pedido
- Arquivos editáveis
- 20% de desconto
- Suporte prioritário

### Empresa - R$ 99,90/mês
- Pedidos ilimitados
- Revisões ilimitadas
- Gerente de conta dedicado
- 30% de desconto
- API de integração (em breve)

### Pagamento Anual
Economize até **17%** pagando anualmente!
- Pro Anual: R$ 199/ano (2 meses grátis)
- Studio Anual: R$ 499/ano (2 meses grátis)
- Empresa Anual: R$ 999/ano (2 meses grátis)
    `
  },
  {
    id: 'art-types',
    name: 'Tipos de Arte',
    icon: Palette,
    content: `
## Tipos de Arte Disponíveis

### 🎨 Logo
Identidade visual para sua marca.
- Logo principal
- Variações (horizontal, vertical, ícone)
- Versões para fundo claro e escuro
- **A partir de R$ 35**

### 📱 Social Media
Posts e materiais para redes sociais.
- Posts para feed (Instagram, Facebook)
- Stories
- Capas e banners
- **A partir de R$ 15**

### ✏️ Ilustração
Ilustrações personalizadas e únicas.
- Ilustrações para livros
- Mascotes
- Arte conceitual
- **A partir de R$ 45**

### 💻 UI Design
Interfaces para aplicativos e sites.
- Telas de app
- Landing pages
- Dashboards
- **A partir de R$ 60**

### 🏢 Branding
Identidade visual completa.
- Logo + manual de marca
- Paleta de cores
- Tipografia
- Aplicações
- **A partir de R$ 120**

### 📦 Embalagem
Design para embalagens de produtos.
- Caixas
- Rótulos
- Sacolas
- Tags
- **A partir de R$ 80**
    `
  },
  {
    id: 'community-guide',
    name: 'Comunidade',
    icon: Users,
    content: `
## Guia da Comunidade

### Código de Conduta
1. **Respeito**: Trate todos com cordialidade
2. **Originalidade**: Não plagie trabalhos
3. **Construtividade**: Feedbacks devem ajudar
4. **Legalidade**: Não compartilhe conteúdo ilegal
5. **Privacidade**: Respeite dados de terceiros

### Sistema de XP
Ganhe pontos por ações na plataforma:

| Ação | XP |
|------|-----|
| Criar pedido | +50 XP |
| Postar no fórum | +10 XP |
| Receber curtida | +5 XP |
| Completar perfil | +25 XP |
| Primeiro pedido | +100 XP |

### Níveis
- **Nível 1**: 0-100 XP
- **Nível 2**: 101-300 XP
- **Nível 3**: 301-600 XP
- **Nível 4**: 601-1000 XP
- **Nível 5+**: 1001+ XP

### Conquistas
Desbloqueie badges especiais:
- 🎯 **Primeiro Pedido**: Faça seu primeiro pedido
- ❤️ **Popular**: Receba 10 curtidas
- 🎂 **Veterano**: 1 ano na plataforma
- ⭐ **Assinante**: Tenha um plano ativo
- 🤝 **Parceiro**: Seja um parceiro oficial

### Fórum
Salas disponíveis:
- **Geral**: Discussões diversas
- **Showcase**: Mostre seus trabalhos
- **Feedback**: Peça opiniões
- **Dicas**: Compartilhe conhecimento
- **Off-Topic**: Assuntos aleatórios
- **VIP Lounge**: Exclusivo para assinantes
    `
  },
  {
    id: 'api',
    name: 'API (Em Breve)',
    icon: Code,
    content: `
## API VAI UMA ARTE AÊ?!

### Em Desenvolvimento 🚧
Estamos trabalhando em uma API pública para permitir integrações com sua plataforma ou aplicativo.

### Funcionalidades Planejadas
- Criar pedidos programaticamente
- Consultar status de pedidos
- Webhooks para atualizações
- Gerenciar usuários (para agências)
- Download de arquivos

### Autenticação
A API usará autenticação via API Key.
Cada plano terá limites diferentes de requisições.

### Disponibilidade
- **Plano Empresa**: Acesso prioritário (Q1 2025)
- **Plano Studio**: Acesso beta (Q2 2025)
- **Outros planos**: A definir

### Interesse?
Se você tem interesse na API, entre em contato pelo Instagram para participar do programa beta!
    `
  }
];

// Guides data
const guides = [
  {
    id: 'first-order',
    title: 'Seu Primeiro Pedido',
    description: 'Aprenda a fazer seu primeiro pedido de arte na plataforma',
    icon: Rocket,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'Iniciante',
    duration: '5 min',
    steps: [
      {
        title: 'Acesse o Simulador',
        content: 'Na página inicial, role até encontrar o Simulador de Orçamento ou clique no botão "Solicitar Arte" no menu.'
      },
      {
        title: 'Escolha o Tipo de Arte',
        content: 'Selecione entre: Logo, Social Media, Ilustração, UI Design, Branding ou Embalagem. Cada tipo tem um preço base diferente.'
      },
      {
        title: 'Configure as Opções',
        content: 'Defina a complexidade (simples a premium), prazo de entrega (24h a 15 dias), número de revisões e se é uso comercial.'
      },
      {
        title: 'Revise o Orçamento',
        content: 'O preço é calculado automaticamente. Confira se está dentro do seu orçamento antes de prosseguir.'
      },
      {
        title: 'Envie o Pedido',
        content: 'Clique em "Solicitar Esta Arte". Se ainda não estiver logado, faça login ou crie uma conta.'
      },
      {
        title: 'Adicione Detalhes',
        content: 'Use o chat do pedido para enviar referências, explicar sua visão e tirar dúvidas com a equipe.'
      }
    ]
  },
  {
    id: 'perfect-briefing',
    title: 'Como Criar um Briefing Perfeito',
    description: 'Dicas para comunicar exatamente o que você precisa',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Iniciante',
    duration: '8 min',
    steps: [
      {
        title: 'Descreva Seu Negócio',
        content: 'Conte sobre sua empresa/projeto: nome, segmento, público-alvo, valores e diferenciais. Quanto mais contexto, melhor o resultado!'
      },
      {
        title: 'Explique o Objetivo',
        content: 'Para que será usada a arte? Post de Instagram? Logo para cartão de visita? Banner de site? Cada uso tem necessidades específicas.'
      },
      {
        title: 'Compartilhe Referências',
        content: 'Envie exemplos de artes que você gosta (e também as que não gosta). Imagens de referência aceleram muito o processo.'
      },
      {
        title: 'Defina Cores e Estilo',
        content: 'Tem cores da marca? Prefere algo minimalista ou detalhado? Moderno ou clássico? Seja específico sobre preferências visuais.'
      },
      {
        title: 'Inclua Textos',
        content: 'Se a arte terá texto, envie exatamente o que deve ser escrito. Revise a ortografia antes de enviar!'
      },
      {
        title: 'Especifique Formatos',
        content: 'Precisa de tamanhos específicos? Feed do Instagram (1080x1080), Story (1080x1920), ou outros? Informe todos os formatos necessários.'
      }
    ]
  },
  {
    id: 'maximize-plan',
    title: 'Aproveitando ao Máximo seu Plano',
    description: 'Estratégias para extrair o máximo valor da sua assinatura',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Intermediário',
    duration: '10 min',
    steps: [
      {
        title: 'Entenda seus Limites',
        content: 'Conheça quantos pedidos seu plano permite por mês. Planeje suas necessidades para não desperdiçar nem faltar.'
      },
      {
        title: 'Use as Revisões Estrategicamente',
        content: 'Antes de pedir revisão, junte todos os ajustes em uma só solicitação. Isso otimiza suas revisões disponíveis.'
      },
      {
        title: 'Aproveite os Descontos',
        content: 'Planos pagos têm descontos em pedidos extras. Se precisar de mais artes, você paga menos por cada uma.'
      },
      {
        title: 'Participe da Comunidade',
        content: 'Assinantes têm acesso ao VIP Lounge no fórum. Network com outros clientes e aprenda dicas valiosas!'
      },
      {
        title: 'Baixe Arquivos Editáveis',
        content: 'Planos Studio e Empresa incluem arquivos editáveis. Guarde-os para fazer pequenos ajustes futuros você mesmo.'
      },
      {
        title: 'Considere o Plano Anual',
        content: 'Se você usa a plataforma regularmente, o plano anual economiza até 17%. São 2 meses grátis!'
      }
    ]
  },
  {
    id: 'community-success',
    title: 'Sucesso na Comunidade',
    description: 'Como se destacar e crescer na comunidade criativa',
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    difficulty: 'Intermediário',
    duration: '7 min',
    steps: [
      {
        title: 'Complete seu Perfil',
        content: 'Um perfil completo com foto, bio e links transmite profissionalismo. Isso também rende 25 XP!'
      },
      {
        title: 'Participe do Fórum',
        content: 'Crie threads interessantes, responda discussões e ajude outros membros. Cada post rende 10 XP.'
      },
      {
        title: 'Compartilhe Trabalhos',
        content: 'Use a sala Showcase para mostrar artes que você recebeu (com permissão) ou criou. Inspire outros!'
      },
      {
        title: 'Dê Feedbacks Construtivos',
        content: 'Quando alguém pedir feedback, seja detalhado e educado. A comunidade valoriza quem ajuda genuinamente.'
      },
      {
        title: 'Conquiste Badges',
        content: 'Desbloqueie conquistas completando desafios. Badges aparecem no seu perfil e mostram sua experiência.'
      },
      {
        title: 'Considere uma Parceria',
        content: 'Se você é criador de conteúdo ou tem uma marca, candidate-se ao programa de parceiros para benefícios exclusivos!'
      }
    ]
  },
  {
    id: 'brand-identity',
    title: 'Construindo sua Identidade Visual',
    description: 'Guia completo para criar uma marca memorável',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    difficulty: 'Avançado',
    duration: '15 min',
    steps: [
      {
        title: 'Defina sua Essência',
        content: 'Antes da parte visual, entenda: qual o propósito da sua marca? Quais valores ela representa? Qual personalidade ela tem?'
      },
      {
        title: 'Conheça seu Público',
        content: 'Quem são seus clientes ideais? Idade, interesses, comportamento. O visual deve ressoar com eles.'
      },
      {
        title: 'Escolha um Arquétipo',
        content: 'Marcas de sucesso seguem arquétipos: O Herói, O Criador, O Cuidador, etc. Isso guia todas as decisões visuais.'
      },
      {
        title: 'Crie o Logo',
        content: 'O logo é o coração da identidade. Deve ser simples, memorável e funcionar em diferentes tamanhos e fundos.'
      },
      {
        title: 'Defina a Paleta de Cores',
        content: 'Escolha 2-4 cores principais. Considere a psicologia das cores: azul = confiança, vermelho = energia, verde = natureza.'
      },
      {
        title: 'Selecione Tipografias',
        content: 'Uma fonte para títulos e outra para textos. Elas devem ser legíveis e refletir a personalidade da marca.'
      },
      {
        title: 'Crie Padrões de Uso',
        content: 'Documente como aplicar os elementos: espaçamentos, tamanhos mínimos, o que evitar. Isso garante consistência.'
      },
      {
        title: 'Aplique em Materiais',
        content: 'Cartões de visita, redes sociais, site, embalagens. Cada aplicação reforça a identidade e constrói reconhecimento.'
      }
    ]
  }
];

// System status data
const systemServices = [
  { name: 'Plataforma Web', status: 'operational', uptime: 99.98 },
  { name: 'Sistema de Pedidos', status: 'operational', uptime: 99.95 },
  { name: 'Chat em Tempo Real', status: 'operational', uptime: 99.90 },
  { name: 'Processamento de Pagamentos', status: 'operational', uptime: 99.99 },
  { name: 'Autenticação', status: 'operational', uptime: 99.97 },
  { name: 'Armazenamento de Arquivos', status: 'operational', uptime: 99.92 },
  { name: 'Fórum da Comunidade', status: 'operational', uptime: 99.88 },
  { name: 'Sistema de Notificações', status: 'operational', uptime: 99.85 },
];

const recentIncidents = [
  {
    date: '2024-01-15',
    title: 'Manutenção Programada',
    description: 'Atualização do sistema de banco de dados para melhorar performance.',
    status: 'resolved',
    duration: '30 minutos'
  },
  {
    date: '2024-01-10',
    title: 'Lentidão no Chat',
    description: 'Usuários reportaram lentidão no carregamento de mensagens. Problema identificado e corrigido.',
    status: 'resolved',
    duration: '15 minutos'
  },
  {
    date: '2024-01-05',
    title: 'Atualização de Segurança',
    description: 'Implementação de novos protocolos de segurança. Sem impacto para usuários.',
    status: 'resolved',
    duration: '5 minutos'
  }
];

export function ResourcesPages({ isOpen, onClose, initialPage }: ResourcesPagesProps) {
  const [currentPage, setCurrentPage] = useState<ResourcePage>(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(faqCategories[0].id);
  const [selectedDocSection, setSelectedDocSection] = useState(documentationSections[0].id);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const pages = [
    { id: 'help' as ResourcePage, name: 'Central de Ajuda', icon: HelpCircle, color: 'text-green-400' },
    { id: 'docs' as ResourcePage, name: 'Documentação', icon: Book, color: 'text-blue-400' },
    { id: 'guides' as ResourcePage, name: 'Guias', icon: Map, color: 'text-purple-400' },
    { id: 'status' as ResourcePage, name: 'Status', icon: Activity, color: 'text-amber-400' },
  ];

  const filteredFaqs = searchQuery
    ? faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqCategories;

  const selectedCategoryData = filteredFaqs.find(c => c.id === selectedCategory) || filteredFaqs[0];
  const selectedDocData = documentationSections.find(s => s.id === selectedDocSection);
  const selectedGuideData = guides.find(g => g.id === selectedGuide);

  const renderHelpCenter = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar dúvidas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm md:text-base placeholder-zinc-500 focus:outline-none focus:border-green-500/50"
        />
      </div>

      {/* Categories - Horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {filteredFaqs.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap transition-all text-xs md:text-sm ${
              selectedCategory === cat.id
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <cat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${cat.color}`} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-2 md:space-y-3">
        {selectedCategoryData?.questions.map((faq, index) => {
          const faqId = `${selectedCategory}-${index}`;
          const isExpanded = expandedFaq === faqId;
          
          return (
            <motion.div
              key={faqId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                className="w-full flex items-start md:items-center justify-between p-3 md:p-4 text-left hover:bg-white/5 transition-colors gap-3"
              >
                <span className="font-medium text-white text-sm md:text-base flex-1">{faq.q}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-0.5 md:mt-0"
                >
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-3 md:px-4 pb-3 md:pb-4 text-zinc-300 text-xs md:text-sm border-t border-white/5 pt-3 md:pt-4 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 md:p-6 border border-green-500/20">
        <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1 text-sm md:text-base">Não encontrou sua resposta?</h3>
            <p className="text-zinc-400 text-xs md:text-sm mb-3 md:mb-4">
              Entre em contato pelo nosso Instagram que respondemos rapidinho!
            </p>
            <a
              href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              Falar no Instagram
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Mobile selector - Moved to top and always visible on mobile */}
      <div className="md:hidden w-full">
        <label className="text-sm text-zinc-400 mb-2 block">Selecione uma seção:</label>
        <select
          value={selectedDocSection}
          onChange={(e) => setSelectedDocSection(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
          {documentationSections.map((section) => (
            <option key={section.id} value={section.id} className="bg-zinc-900">
              {section.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-56 flex-shrink-0 hidden md:block">
        <div className="sticky top-0 space-y-1 bg-white/5 rounded-xl p-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider px-3 mb-2">Navegação</p>
          {documentationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedDocSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                selectedDocSection === section.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <section.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {selectedDocData && (
          <motion.div
            key={selectedDocData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-none"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <selectedDocData.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-white">{selectedDocData.name}</h2>
            </div>
            
            {/* Content Box */}
            <div className="bg-white/5 rounded-xl p-4 md:p-6 text-zinc-300 leading-relaxed overflow-x-auto">
              {selectedDocData.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-lg md:text-xl font-bold text-white mt-5 mb-3 first:mt-0">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-base md:text-lg font-semibold text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('- ')) {
                  return (
                    <div key={i} className="flex items-start gap-2 ml-2 mb-1">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-zinc-300 text-sm md:text-base">{line.replace('- ', '')}</span>
                    </div>
                  );
                }
                if (line.startsWith('| ') && line.includes('|')) {
                  const cells = line.split('|').filter(cell => cell.trim());
                  if (cells.every(cell => cell.trim().match(/^[-]+$/))) {
                    return null; // Skip separator row
                  }
                  return (
                    <div key={i} className="flex flex-wrap gap-2 md:gap-4 my-1 text-sm">
                      {cells.map((cell, j) => (
                        <span key={j} className="bg-white/5 px-2 py-1 rounded text-zinc-300">
                          {cell.trim()}
                        </span>
                      ))}
                    </div>
                  );
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-2" />;
                }
                return <p key={i} className="text-zinc-300 text-sm md:text-base mb-2 break-words">{line}</p>;
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderGuides = () => (
    <div className="space-y-4 md:space-y-6">
      {!selectedGuide ? (
        <>
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Guias e Tutoriais</h2>
            <p className="text-sm md:text-base text-zinc-400">Aprenda a usar a plataforma e extraia o máximo de cada recurso</p>
          </div>

          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            {guides.map((guide, index) => (
              <motion.button
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedGuide(guide.id)}
                className="bg-white/5 rounded-xl p-4 md:p-6 text-left hover:bg-white/10 transition-all group"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <guide.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">{guide.title}</h3>
                <p className="text-xs md:text-sm text-zinc-400 mb-3 md:mb-4 line-clamp-2">{guide.description}</p>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {guide.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {guide.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {guide.steps.length} passos
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => setSelectedGuide(null)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-4 md:mb-6 transition-colors text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar aos guias
          </button>

          {selectedGuideData && (
            <>
              {/* Guide Header - Mobile */}
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 mb-6 md:mb-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${selectedGuideData.color} flex items-center justify-center flex-shrink-0`}>
                  <selectedGuideData.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-2xl font-bold text-white mb-1">{selectedGuideData.title}</h2>
                  <p className="text-sm md:text-base text-zinc-400">{selectedGuideData.description}</p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-zinc-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 md:w-4 md:h-4" />
                      {selectedGuideData.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      {selectedGuideData.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 md:space-y-4">
                {selectedGuideData.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 md:p-5 flex gap-3 md:gap-4"
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${selectedGuideData.color} flex items-center justify-center flex-shrink-0 text-white font-bold text-sm md:text-base`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 md:mb-2 text-sm md:text-base">{step.title}</h4>
                      <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{step.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pro Tip */}
              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                  <h4 className="font-bold text-white text-sm md:text-base">Dica Pro</h4>
                </div>
                <p className="text-zinc-300 text-xs md:text-sm">
                  Salve este guia nos favoritos do navegador para consultar sempre que precisar. 
                  E não esqueça de explorar os outros guias para aproveitar ao máximo a plataforma!
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );

  const renderStatus = () => (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 md:p-6 border border-green-500/20">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base md:text-xl font-bold text-white truncate">Todos os sistemas operacionais</h2>
            <p className="text-green-400 text-xs md:text-sm">Última atualização: agora mesmo</p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Serviços</h3>
        <div className="space-y-2">
          {systemServices.map((service) => (
            <div
              key={service.name}
              className="bg-white/5 rounded-xl p-3 md:p-4"
            >
              {/* Mobile Layout */}
              <div className="flex flex-col gap-2 md:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {service.status === 'operational' ? (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : service.status === 'degraded' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <span className="text-white text-sm truncate">{service.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    service.status === 'operational'
                      ? 'bg-green-500/20 text-green-400'
                      : service.status === 'degraded'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {service.status === 'operational' ? 'OK' : 
                     service.status === 'degraded' ? 'Lento' : 'Off'}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-6">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mr-3">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${service.uptime}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400">{service.uptime}%</span>
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {service.status === 'operational' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : service.status === 'degraded' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">{service.uptime}% uptime</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    service.status === 'operational'
                      ? 'bg-green-500/20 text-green-400'
                      : service.status === 'degraded'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {service.status === 'operational' ? 'Operacional' : 
                     service.status === 'degraded' ? 'Degradado' : 'Fora do ar'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uptime Chart (simplified) */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Uptime últimos 30 dias</h3>
        <div className="bg-white/5 rounded-xl p-4 md:p-6">
          <div className="flex items-end gap-0.5 md:gap-1 h-16 md:h-20">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = 80 + Math.random() * 20;
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t transition-all hover:from-green-400 hover:to-emerald-300 min-w-[4px]"
                  style={{ height: `${height}%` }}
                  title={`Dia ${i + 1}: ${(99 + Math.random()).toFixed(2)}%`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>30 dias atrás</span>
            <span>Hoje</span>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Incidentes Recentes</h3>
        <div className="space-y-3 md:space-y-4">
          {recentIncidents.map((incident, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-0 mb-2">
                <div className="flex items-center gap-2">
                  {incident.status === 'resolved' ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span className="font-medium text-white text-sm md:text-base">{incident.title}</span>
                </div>
                <span className="text-xs text-zinc-500 ml-6 md:ml-0">{incident.date}</span>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 mb-2 ml-6 md:ml-0">{incident.description}</p>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-zinc-500 ml-6 md:ml-0">
                <span>Duração: {incident.duration}</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  incident.status === 'resolved'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {incident.status === 'resolved' ? 'Resolvido' : 'Em andamento'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe to updates */}
      <div className="bg-white/5 rounded-xl p-4 md:p-6">
        <h4 className="font-semibold text-white mb-2 text-sm md:text-base">Receba atualizações de status</h4>
        <p className="text-xs md:text-sm text-zinc-400 mb-4">
          Siga nosso Instagram para receber notificações sobre manutenções programadas e incidentes.
        </p>
        <a
          href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Instagram className="w-4 h-4" />
          Seguir no Instagram
        </a>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full md:max-w-5xl h-[95vh] md:h-auto md:max-h-[90vh] bg-zinc-900 md:bg-zinc-900/95 md:rounded-2xl border-t md:border border-white/10 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/10 bg-zinc-900">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base md:text-lg font-bold text-white truncate">Central de Recursos</h2>
                  <p className="text-xs md:text-sm text-zinc-400 hidden sm:block">Ajuda, documentação e mais</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto bg-zinc-900/50 scrollbar-hide">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2.5 md:py-3 border-b-2 transition-all whitespace-nowrap text-sm md:text-base flex-1 md:flex-none justify-center md:justify-start ${
                    currentPage === page.id
                      ? 'border-indigo-500 text-white bg-white/5'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <page.icon className={`w-4 h-4 ${currentPage === page.id ? page.color : ''}`} />
                  <span className="hidden sm:inline">{page.name}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {currentPage === 'help' && renderHelpCenter()}
                  {currentPage === 'docs' && renderDocumentation()}
                  {currentPage === 'guides' && renderGuides()}
                  {currentPage === 'status' && renderStatus()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
