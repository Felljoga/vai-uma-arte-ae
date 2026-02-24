import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, Cookie, Scale, ChevronRight, Mail, Instagram } from 'lucide-react';

interface LegalPageProps {
  isOpen: boolean;
  onClose: () => void;
  page: 'privacy' | 'terms' | 'cookies' | 'licenses';
}

export function LegalPages({ isOpen, onClose, page }: LegalPageProps) {
  const pages = {
    privacy: {
      title: 'Política de Privacidade',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      content: <PrivacyPolicy />
    },
    terms: {
      title: 'Termos de Uso',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
      content: <TermsOfUse />
    },
    cookies: {
      title: 'Política de Cookies',
      icon: Cookie,
      color: 'from-amber-500 to-orange-500',
      content: <CookiePolicy />
    },
    licenses: {
      title: 'Licenças',
      icon: Scale,
      color: 'from-purple-500 to-pink-500',
      content: <Licenses />
    }
  };

  const currentPage = pages[page];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-4xl my-8 glass rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${currentPage.color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <currentPage.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentPage.title}</h2>
                    <p className="text-white/80 text-sm">VAI UMA ARTE AÊ?!</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {currentPage.content}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-zinc-400">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:contato@vaiumaarteae.com.br"
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contato
                  </a>
                  <a
                    href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Seção com título
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <ChevronRight className="w-5 h-5 text-indigo-400" />
        {title}
      </h3>
      <div className="text-zinc-300 space-y-3 pl-7">
        {children}
      </div>
    </div>
  );
}

// Lista de itens
function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ===== POLÍTICA DE PRIVACIDADE =====
function PrivacyPolicy() {
  return (
    <div>
      <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <p className="text-green-300">
          <strong>Resumo:</strong> Nós respeitamos sua privacidade. Coletamos apenas os dados necessários para fornecer nossos serviços. 
          Nunca vendemos seus dados para terceiros. Você tem controle total sobre suas informações.
        </p>
      </div>

      <Section title="1. Introdução">
        <p>
          A <strong>VAI UMA ARTE AÊ?!</strong> ("nós", "nosso" ou "Plataforma") está comprometida em proteger a privacidade 
          dos usuários de nossos serviços. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e 
          protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
        </p>
      </Section>

      <Section title="2. Dados que Coletamos">
        <p className="mb-3">Coletamos os seguintes tipos de dados:</p>
        
        <h4 className="font-semibold text-white mb-2">2.1. Dados fornecidos por você:</h4>
        <List items={[
          'Nome completo e nome de usuário',
          'Endereço de e-mail',
          'Foto de perfil (opcional)',
          'Informações de perfil criativo (bio, estilo preferido)',
          'Conteúdo de mensagens e pedidos',
          'Informações de pagamento (processadas pelo Mercado Pago)'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">2.2. Dados coletados automaticamente:</h4>
        <List items={[
          'Endereço IP e localização aproximada',
          'Tipo de navegador e dispositivo',
          'Páginas visitadas e tempo de permanência',
          'Cookies e identificadores de sessão',
          'Dados de uso da plataforma'
        ]} />
      </Section>

      <Section title="3. Como Usamos seus Dados">
        <List items={[
          'Fornecer e melhorar nossos serviços de design sob demanda',
          'Processar seus pedidos e pagamentos',
          'Enviar comunicações sobre seus pedidos e a plataforma',
          'Personalizar sua experiência na plataforma',
          'Fornecer suporte ao cliente',
          'Garantir a segurança da plataforma',
          'Cumprir obrigações legais',
          'Enviar novidades e ofertas (com seu consentimento)'
        ]} />
      </Section>

      <Section title="4. Base Legal para Processamento">
        <List items={[
          'Execução de contrato: para fornecer nossos serviços',
          'Consentimento: para marketing e cookies não essenciais',
          'Interesses legítimos: para melhorar nossos serviços e segurança',
          'Obrigação legal: para cumprir leis e regulamentos'
        ]} />
      </Section>

      <Section title="5. Compartilhamento de Dados">
        <p className="mb-3">Podemos compartilhar seus dados apenas nas seguintes situações:</p>
        <List items={[
          'Com o Mercado Pago para processar pagamentos',
          'Com o Firebase/Google para armazenamento seguro de dados',
          'Com autoridades legais quando exigido por lei',
          'Com sua autorização expressa'
        ]} />
        <p className="mt-3 text-amber-300">
          <strong>⚠️ Importante:</strong> Nunca vendemos, alugamos ou comercializamos seus dados pessoais para terceiros.
        </p>
      </Section>

      <Section title="6. Armazenamento e Segurança">
        <p>
          Seus dados são armazenados em servidores seguros do Firebase (Google Cloud Platform), localizados nos Estados Unidos, 
          com criptografia em trânsito e em repouso. Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
        </p>
        <List items={[
          'Criptografia SSL/TLS para todas as comunicações',
          'Autenticação segura com Firebase Auth',
          'Regras de segurança rigorosas no banco de dados',
          'Acesso restrito a dados pessoais',
          'Monitoramento contínuo de segurança'
        ]} />
      </Section>

      <Section title="7. Retenção de Dados">
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer nossos serviços. 
          Após a exclusão da conta, seus dados serão removidos em até 30 dias, exceto quando houver obrigação legal de retenção.
        </p>
      </Section>

      <Section title="8. Seus Direitos (LGPD)">
        <p className="mb-3">De acordo com a LGPD, você tem os seguintes direitos:</p>
        <List items={[
          'Confirmação: saber se tratamos seus dados',
          'Acesso: obter cópia dos seus dados',
          'Correção: atualizar dados incorretos ou incompletos',
          'Anonimização: solicitar anonimização de dados desnecessários',
          'Portabilidade: transferir seus dados para outro serviço',
          'Eliminação: solicitar exclusão dos seus dados',
          'Informação: saber com quem compartilhamos seus dados',
          'Revogação: retirar seu consentimento a qualquer momento',
          'Oposição: opor-se ao tratamento de dados'
        ]} />
        <p className="mt-3">
          Para exercer seus direitos, entre em contato conosco através do Instagram 
          <a 
            href="https://www.instagram.com/vaiumaarteaeofc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline ml-1"
          >
            @vaiumaarteaeofc
          </a>.
        </p>
      </Section>

      <Section title="9. Dados de Menores">
        <p>
          Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente dados de menores. 
          Se você é pai ou responsável e acredita que seu filho nos forneceu dados, entre em contato conosco imediatamente.
        </p>
      </Section>

      <Section title="10. Alterações nesta Política">
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas 
          por e-mail ou através de um aviso na plataforma. Recomendamos revisar esta política regularmente.
        </p>
      </Section>

      <Section title="11. Contato">
        <p>Para dúvidas sobre esta política ou sobre seus dados pessoais:</p>
        <div className="mt-3 p-4 rounded-xl bg-white/5">
          <p><strong>VAI UMA ARTE AÊ?!</strong></p>
          <p className="flex items-center gap-2 mt-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <a 
              href="https://www.instagram.com/vaiumaarteaeofc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              @vaiumaarteaeofc
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}

// ===== TERMOS DE USO =====
function TermsOfUse() {
  return (
    <div>
      <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-blue-300">
          <strong>Resumo:</strong> Ao usar a VAI UMA ARTE AÊ?!, você concorda em usar a plataforma de forma responsável, 
          respeitar outros usuários e seguir nossas diretrizes. Nós nos comprometemos a fornecer um serviço de qualidade.
        </p>
      </div>

      <Section title="1. Aceitação dos Termos">
        <p>
          Ao acessar ou usar a plataforma <strong>VAI UMA ARTE AÊ?!</strong> ("Plataforma", "Serviço", "nós"), 
          você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer 
          parte destes termos, não poderá usar nossos serviços.
        </p>
      </Section>

      <Section title="2. Descrição do Serviço">
        <p>
          A VAI UMA ARTE AÊ?! é uma plataforma de design sob demanda que oferece:
        </p>
        <List items={[
          'Criação de artes personalizadas (logos, posts para redes sociais, ilustrações, UI design, branding, embalagens)',
          'Sistema de pedidos com acompanhamento em tempo real',
          'Chat integrado para comunicação cliente-equipe',
          'Comunidade criativa com fórum e interação',
          'Conteúdo educacional sobre design e criatividade',
          'Planos de assinatura com benefícios exclusivos',
          'Programa de parcerias'
        ]} />
      </Section>

      <Section title="3. Cadastro e Conta">
        <h4 className="font-semibold text-white mb-2">3.1. Requisitos:</h4>
        <List items={[
          'Ter pelo menos 18 anos de idade',
          'Fornecer informações verdadeiras e completas',
          'Manter suas informações atualizadas',
          'Ser responsável pela segurança da sua conta'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">3.2. Responsabilidades:</h4>
        <List items={[
          'Manter sua senha segura e confidencial',
          'Notificar imediatamente sobre uso não autorizado',
          'Não compartilhar sua conta com terceiros',
          'Todas as atividades na conta são de sua responsabilidade'
        ]} />
      </Section>

      <Section title="4. Pedidos e Pagamentos">
        <h4 className="font-semibold text-white mb-2">4.1. Processo de Pedido:</h4>
        <List items={[
          'Utilize o simulador de orçamento para estimar valores',
          'Descreva claramente suas necessidades no pedido',
          'Forneça referências e materiais necessários',
          'Acompanhe o status através do dashboard'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">4.2. Pagamentos:</h4>
        <List items={[
          'Pagamentos são processados pelo Mercado Pago',
          'Aceitamos PIX, cartão de crédito e boleto',
          'Os valores são em Reais (BRL)',
          'Planos de assinatura são cobrados mensalmente ou anualmente'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">4.3. Reembolsos:</h4>
        <List items={[
          'Reembolso integral se o trabalho não for iniciado',
          'Reembolso parcial proporcional ao trabalho não realizado',
          'Não há reembolso após aprovação final do trabalho',
          'Solicite reembolsos através do chat ou Instagram'
        ]} />
      </Section>

      <Section title="5. Revisões e Entregas">
        <List items={[
          'O número de revisões depende do plano ou opção escolhida',
          'Revisões devem ser solicitadas de forma clara e específica',
          'Mudanças no escopo original podem gerar custos adicionais',
          'Entregas são feitas em formato digital (PNG, JPG, PDF, etc.)',
          'Arquivos editáveis disponíveis mediante solicitação (pode haver custo adicional)'
        ]} />
      </Section>

      <Section title="6. Direitos Autorais e Propriedade Intelectual">
        <h4 className="font-semibold text-white mb-2">6.1. Trabalhos Entregues:</h4>
        <List items={[
          'Após pagamento completo, você recebe licença de uso da arte',
          'Uso comercial requer seleção da opção correspondente no pedido',
          'Podemos usar trabalhos em nosso portfólio (salvo acordo em contrário)',
          'Você não pode revender as artes como templates ou produtos digitais'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">6.2. Conteúdo do Usuário:</h4>
        <List items={[
          'Você mantém os direitos sobre materiais que nos fornece',
          'Garante ter direito de uso sobre referências enviadas',
          'Concede licença para usar materiais na criação do trabalho'
        ]} />
      </Section>

      <Section title="7. Conduta do Usuário">
        <p className="mb-3">Você concorda em NÃO:</p>
        <List items={[
          'Usar a plataforma para fins ilegais ou não autorizados',
          'Assediar, ameaçar ou discriminar outros usuários',
          'Enviar conteúdo ofensivo, violento ou pornográfico',
          'Tentar acessar contas ou dados de outros usuários',
          'Usar bots, scripts ou automações não autorizadas',
          'Manipular avaliações, likes ou métricas da plataforma',
          'Solicitar trabalhos que violem direitos de terceiros',
          'Fazer spam ou enviar conteúdo não solicitado'
        ]} />
      </Section>

      <Section title="8. Comunidade e Fórum">
        <List items={[
          'Respeite todos os membros da comunidade',
          'Não faça spam ou autopromoção excessiva',
          'Conteúdo publicado pode ser moderado ou removido',
          'Reincidência em violações pode resultar em banimento',
          'Moderadores e admins têm autoridade para aplicar as regras'
        ]} />
      </Section>

      <Section title="9. Planos de Assinatura">
        <h4 className="font-semibold text-white mb-2">9.1. Planos Disponíveis:</h4>
        <List items={[
          'Grátis: acesso básico à plataforma',
          'Pro: benefícios adicionais e descontos',
          'Studio: recursos avançados e prioridade',
          'Empresa: recursos completos e atendimento VIP'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">9.2. Cancelamento:</h4>
        <List items={[
          'Você pode cancelar sua assinatura a qualquer momento',
          'O acesso continua até o fim do período pago',
          'Não há reembolso proporcional ao período não utilizado',
          'Recursos do plano são removidos após expiração'
        ]} />
      </Section>

      <Section title="10. Programa de Parcerias">
        <List items={[
          'Parcerias são aprovadas a critério exclusivo da plataforma',
          'Parceiros devem manter conduta exemplar',
          'Benefícios de parceria podem ser alterados ou removidos',
          'A parceria pode ser encerrada por qualquer parte'
        ]} />
      </Section>

      <Section title="11. Limitação de Responsabilidade">
        <p>
          A plataforma é fornecida "como está". Não garantimos que o serviço será ininterrupto ou livre de erros. 
          Na extensão máxima permitida por lei, não somos responsáveis por:
        </p>
        <List items={[
          'Danos indiretos, incidentais ou consequenciais',
          'Perda de dados, lucros ou oportunidades de negócio',
          'Conteúdo de terceiros ou links externos',
          'Ações de outros usuários da plataforma'
        ]} />
      </Section>

      <Section title="12. Modificações dos Termos">
        <p>
          Podemos modificar estes Termos a qualquer momento. Mudanças significativas serão comunicadas por e-mail 
          ou através de aviso na plataforma. O uso continuado após as mudanças constitui aceitação dos novos termos.
        </p>
      </Section>

      <Section title="13. Encerramento">
        <p>
          Podemos suspender ou encerrar sua conta por violação destes termos ou por qualquer motivo, a nosso critério. 
          Você pode encerrar sua conta a qualquer momento através das configurações do perfil ou entrando em contato conosco.
        </p>
      </Section>

      <Section title="14. Lei Aplicável">
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida 
          nos tribunais brasileiros competentes.
        </p>
      </Section>

      <Section title="15. Contato">
        <p>Para dúvidas sobre estes Termos:</p>
        <div className="mt-3 p-4 rounded-xl bg-white/5">
          <p><strong>VAI UMA ARTE AÊ?!</strong></p>
          <p className="flex items-center gap-2 mt-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <a 
              href="https://www.instagram.com/vaiumaarteaeofc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              @vaiumaarteaeofc
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}

// ===== POLÍTICA DE COOKIES =====
function CookiePolicy() {
  return (
    <div>
      <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-amber-300">
          <strong>Resumo:</strong> Usamos cookies para melhorar sua experiência, lembrar suas preferências e manter 
          você logado. Você pode controlar os cookies nas configurações do seu navegador.
        </p>
      </div>

      <Section title="1. O que são Cookies?">
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. 
          Eles ajudam a lembrar suas preferências, manter você logado e entender como você usa a plataforma.
        </p>
      </Section>

      <Section title="2. Tipos de Cookies que Usamos">
        <h4 className="font-semibold text-white mb-2">2.1. Cookies Essenciais (Necessários)</h4>
        <p className="mb-2">
          Estes cookies são necessários para o funcionamento da plataforma. Sem eles, alguns recursos não funcionariam.
        </p>
        <List items={[
          'Autenticação e sessão de login',
          'Preferências de segurança',
          'Carrinho de compras e checkout',
          'Balanceamento de carga do servidor'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">2.2. Cookies de Preferências</h4>
        <p className="mb-2">
          Estes cookies lembram suas escolhas e preferências.
        </p>
        <List items={[
          'Idioma preferido',
          'Tema (claro/escuro)',
          'Preferências de áudio',
          'Configurações de notificação',
          'Preferências de cookies'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">2.3. Cookies de Desempenho</h4>
        <p className="mb-2">
          Estes cookies nos ajudam a entender como você usa a plataforma.
        </p>
        <List items={[
          'Páginas mais visitadas',
          'Erros encontrados',
          'Tempo de carregamento',
          'Origem do tráfego'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">2.4. Cookies de Marketing (Opcionais)</h4>
        <p className="mb-2">
          Estes cookies são usados para mostrar anúncios relevantes. São opcionais e requerem seu consentimento.
        </p>
        <List items={[
          'Anúncios personalizados',
          'Remarketing',
          'Medição de campanhas'
        ]} />
      </Section>

      <Section title="3. Cookies de Terceiros">
        <p className="mb-3">Utilizamos serviços de terceiros que podem definir cookies:</p>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-white/5">
            <h5 className="font-semibold text-white">Firebase (Google)</h5>
            <p className="text-sm text-zinc-400 mt-1">
              Autenticação, banco de dados e análises. 
              <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">
                Política de Privacidade
              </a>
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-white/5">
            <h5 className="font-semibold text-white">Mercado Pago</h5>
            <p className="text-sm text-zinc-400 mt-1">
              Processamento de pagamentos. 
              <a href="https://www.mercadopago.com.br/privacidade" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </Section>

      <Section title="4. Armazenamento Local (LocalStorage)">
        <p>
          Além de cookies, usamos o LocalStorage do navegador para armazenar:
        </p>
        <List items={[
          'Preferências de áudio (volume, música ambiente)',
          'Consentimento de cookies',
          'Configurações de interface',
          'Cache de dados para melhor performance'
        ]} />
      </Section>

      <Section title="5. Como Gerenciar Cookies">
        <h4 className="font-semibold text-white mb-2">5.1. Pelo Navegador:</h4>
        <p className="mb-2">
          Você pode configurar seu navegador para bloquear ou alertar sobre cookies:
        </p>
        <List items={[
          'Chrome: Configurações → Privacidade e segurança → Cookies',
          'Firefox: Configurações → Privacidade e Segurança',
          'Safari: Preferências → Privacidade',
          'Edge: Configurações → Cookies e permissões do site'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">5.2. Pelo Banner de Cookies:</h4>
        <p>
          Ao visitar nosso site pela primeira vez, você verá um banner de cookies onde pode aceitar ou personalizar 
          suas preferências. Você pode alterar suas escolhas a qualquer momento nas configurações.
        </p>
      </Section>

      <Section title="6. Impacto de Desativar Cookies">
        <p>
          Se você desativar cookies essenciais, alguns recursos podem não funcionar corretamente:
        </p>
        <List items={[
          'Não será possível manter o login',
          'Preferências não serão salvas',
          'Checkout pode não funcionar',
          'Experiência será degradada'
        ]} />
      </Section>

      <Section title="7. Período de Retenção">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white">Tipo</th>
                <th className="text-left py-2 text-white">Duração</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-white/5">
                <td className="py-2">Cookies de sessão</td>
                <td className="py-2">Até fechar o navegador</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Cookies de autenticação</td>
                <td className="py-2">30 dias</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Cookies de preferências</td>
                <td className="py-2">1 ano</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Cookies de análise</td>
                <td className="py-2">2 anos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="8. Atualizações desta Política">
        <p>
          Esta Política de Cookies pode ser atualizada periodicamente. Recomendamos revisá-la regularmente. 
          Mudanças significativas serão comunicadas através de aviso na plataforma.
        </p>
      </Section>

      <Section title="9. Contato">
        <p>Para dúvidas sobre cookies:</p>
        <div className="mt-3 p-4 rounded-xl bg-white/5">
          <p><strong>VAI UMA ARTE AÊ?!</strong></p>
          <p className="flex items-center gap-2 mt-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <a 
              href="https://www.instagram.com/vaiumaarteaeofc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              @vaiumaarteaeofc
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}

// ===== LICENÇAS =====
function Licenses() {
  return (
    <div>
      <div className="mb-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <p className="text-purple-300">
          <strong>Resumo:</strong> Esta página lista as licenças de software de código aberto utilizadas na plataforma 
          e explica os termos de licenciamento das artes criadas.
        </p>
      </div>

      <Section title="1. Licença das Artes Criadas">
        <h4 className="font-semibold text-white mb-2">1.1. Licença de Uso Pessoal</h4>
        <p className="mb-2">
          Para artes criadas sem a opção "Uso Comercial":
        </p>
        <List items={[
          'Uso pessoal ilimitado',
          'Redes sociais pessoais',
          'Impressão para uso próprio',
          'NÃO inclui: uso comercial, revenda, sublicenciamento'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">1.2. Licença de Uso Comercial</h4>
        <p className="mb-2">
          Para artes criadas com a opção "Uso Comercial":
        </p>
        <List items={[
          'Todos os direitos de uso pessoal',
          'Uso em materiais comerciais e publicitários',
          'Uso em produtos para venda',
          'Uso em identidade visual de empresas',
          'NÃO inclui: revenda da arte como produto digital, sublicenciamento'
        ]} />

        <h4 className="font-semibold text-white mt-4 mb-2">1.3. Arquivos Editáveis</h4>
        <p>
          Arquivos fonte (PSD, AI, Figma, etc.) podem ser solicitados mediante pagamento adicional. 
          A licença para arquivos editáveis segue as mesmas regras da arte original.
        </p>
      </Section>

      <Section title="2. Software de Código Aberto">
        <p className="mb-4">
          A plataforma VAI UMA ARTE AÊ?! utiliza os seguintes softwares de código aberto:
        </p>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">React</h5>
                <p className="text-sm text-zinc-400">Biblioteca para construção de interfaces</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">MIT</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">TypeScript</h5>
                <p className="text-sm text-zinc-400">Superset tipado de JavaScript</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">Apache 2.0</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">Tailwind CSS</h5>
                <p className="text-sm text-zinc-400">Framework CSS utilitário</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">MIT</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">Framer Motion</h5>
                <p className="text-sm text-zinc-400">Biblioteca de animações</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">MIT</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">Lucide React</h5>
                <p className="text-sm text-zinc-400">Biblioteca de ícones</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">ISC</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">Firebase SDK</h5>
                <p className="text-sm text-zinc-400">SDK para serviços Firebase</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">Apache 2.0</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-white">Vite</h5>
                <p className="text-sm text-zinc-400">Ferramenta de build</p>
              </div>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">MIT</span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="3. Fontes e Tipografia">
        <div className="p-3 rounded-lg bg-white/5">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-semibold text-white">Inter</h5>
              <p className="text-sm text-zinc-400">Fonte principal da plataforma</p>
            </div>
            <span className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-300">SIL OFL 1.1</span>
          </div>
        </div>
      </Section>

      <Section title="4. Ícones e Gráficos">
        <p>
          Os ícones utilizados são da biblioteca Lucide Icons, licenciada sob ISC License. 
          Gráficos e ilustrações próprias são de propriedade exclusiva da VAI UMA ARTE AÊ?!
        </p>
      </Section>

      <Section title="5. Atribuições">
        <p>
          Agradecemos a todos os contribuidores de projetos de código aberto que tornam possível 
          a construção de plataformas como esta. Se você é mantenedor de algum projeto listado e 
          deseja atribuição adicional, entre em contato conosco.
        </p>
      </Section>

      <Section title="6. Contato">
        <p>Para dúvidas sobre licenças:</p>
        <div className="mt-3 p-4 rounded-xl bg-white/5">
          <p><strong>VAI UMA ARTE AÊ?!</strong></p>
          <p className="flex items-center gap-2 mt-2">
            <Instagram className="w-4 h-4 text-pink-400" />
            <a 
              href="https://www.instagram.com/vaiumaarteaeofc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              @vaiumaarteaeofc
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}
