import { motion } from 'framer-motion';
import { Sparkles, Twitter, Instagram, Linkedin, Youtube, Heart, ArrowUp, Shield, FileText, Cookie, Scale } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenCookies: () => void;
  onOpenLicenses: () => void;
  onOpenHelp: () => void;
  onOpenDocs: () => void;
  onOpenGuides: () => void;
  onOpenStatus: () => void;
  onOpenAbout: () => void;
  onOpenBlog: () => void;
  onOpenCareers: () => void;
  onOpenPartners: () => void;
  onOpenFeatures: () => void;
  onOpenPricing: () => void;
  onOpenCommunity: () => void;
  onOpenEducational: () => void;
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ==', primary: true },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export function Footer({ 
  onOpenPrivacy, onOpenTerms, onOpenCookies, onOpenLicenses, 
  onOpenHelp, onOpenDocs, onOpenGuides, onOpenStatus,
  onOpenAbout, onOpenBlog, onOpenCareers, onOpenPartners,
  onOpenFeatures, onOpenPricing, onOpenCommunity, onOpenEducational
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    produto: [
      { name: 'Recursos', href: '#', onClick: onOpenFeatures },
      { name: 'Preços', href: '#', onClick: onOpenPricing },
      { name: 'Comunidade', href: '#', onClick: onOpenCommunity },
      { name: 'Educacional', href: '#', onClick: onOpenEducational },
    ],
    empresa: [
      { name: 'Sobre nós', href: '#', onClick: onOpenAbout },
      { name: 'Blog', href: '#', onClick: onOpenBlog },
      { name: 'Parceiros', href: '#parceiros', onClick: onOpenPartners },
      { name: 'Carreiras', href: '#', onClick: onOpenCareers },
    ],
    recursos: [
      { name: 'Central de Ajuda', href: '#', onClick: onOpenHelp },
      { name: 'Documentação', href: '#', onClick: onOpenDocs },
      { name: 'Guias', href: '#', onClick: onOpenGuides },
      { name: 'Status', href: '#', onClick: onOpenStatus },
    ],
  };

  const legalLinks = [
    { name: 'Privacidade', icon: Shield, onClick: onOpenPrivacy, color: 'text-green-400' },
    { name: 'Termos de Uso', icon: FileText, onClick: onOpenTerms, color: 'text-blue-400' },
    { name: 'Cookies', icon: Cookie, onClick: onOpenCookies, color: 'text-amber-400' },
    { name: 'Licenças', icon: Scale, onClick: onOpenLicenses, color: 'text-purple-400' },
  ];

  return (
    <footer className="relative pt-24 pb-8 border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 mb-16 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Fique por dentro das novidades
          </h3>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Receba dicas exclusivas, ofertas especiais e atualizações da plataforma diretamente no seu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="input-modern flex-1"
            />
            <motion.button
              className="btn-primary whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Inscrever-se
            </motion.button>
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            Ao se inscrever, você concorda com nossa{' '}
            <button onClick={onOpenPrivacy} className="text-indigo-400 hover:underline">
              política de privacidade
            </button>.
          </p>
        </motion.div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">VAI UMA ARTE</span>
                <span className="text-lg font-bold text-white"> AÊ?!</span>
              </div>
            </a>
            <p className="text-sm text-zinc-400 mb-4">
              A plataforma mais moderna de design sob demanda do Brasil.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    social.primary 
                      ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90' 
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            
            {/* Instagram CTA */}
            <motion.a
              href="https://www.instagram.com/vaiumaarteaeofc?igsh=MXVtM3pjN3dtYWJyOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-4 h-4" />
              Siga-nos no Instagram
            </motion.a>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.name}>
                  {link.onClick ? (
                    <button 
                      onClick={link.onClick}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  {link.onClick ? (
                    <button 
                      onClick={link.onClick}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={link.onClick}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={link.onClick}
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <link.icon className={`w-4 h-4 ${link.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <motion.button
            onClick={onOpenPrivacy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm hover:bg-green-500/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-4 h-4" />
            LGPD Compliant
          </motion.button>
          <motion.button
            onClick={onOpenCookies}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Cookie className="w-4 h-4" />
            Política de Cookies
          </motion.button>
          <motion.button
            onClick={onOpenTerms}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-4 h-4" />
            Termos de Uso
          </motion.button>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-sm text-zinc-500 flex items-center gap-1">
            © 2024 VAI UMA ARTE AÊ?! Feito com
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            no Brasil
          </p>
          <motion.button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
