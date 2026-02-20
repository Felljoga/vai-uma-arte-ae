// User Profile Component - VAI UMA ARTE AÊ?!
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProfileTab = 'overview' | 'edit' | 'security' | 'preferences';

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Edit form states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Security form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Preferences
  const [preferredStyle, setPreferredStyle] = useState('neon');

  const { user, profile, logout, updateProfile, updateDisplayName, updatePassword, resendVerification } = useAuth();

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setCompany(profile.company || '');
      setWebsite(profile.website || '');
      setInstagram(profile.instagram || '');
      setPhoneNumber(profile.phoneNumber || '');
      setPreferredStyle(profile.preferredStyle || 'neon');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    try {
      await updateDisplayName(displayName);
      await updateProfile({
        bio,
        company,
        website,
        instagram,
        phoneNumber
      });
      setSuccess('Perfil atualizado com sucesso! 🎉');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    if (newPassword !== confirmNewPassword) {
      setLocalError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setLocalError('A nova senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess('Senha atualizada com sucesso! 🔐');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    setIsLoading(true);
    setLocalError(null);

    try {
      await updateProfile({ preferredStyle });
      setSuccess('Preferências salvas! ✨');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setLocalError(null);

    try {
      await resendVerification();
      setSuccess('Email de verificação enviado!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '👤' },
    { id: 'edit', label: 'Editar', icon: '✏️' },
    { id: 'security', label: 'Segurança', icon: '🔐' },
    { id: 'preferences', label: 'Preferências', icon: '🎨' }
  ];

  const styles = [
    { id: 'minimal', name: 'Minimalista', color: 'from-gray-400 to-gray-600' },
    { id: 'neon', name: 'Neon Futurista', color: 'from-purple-500 to-pink-500' },
    { id: 'street', name: 'Street / Urbano', color: 'from-orange-500 to-red-500' },
    { id: 'luxury', name: 'Luxo / Premium', color: 'from-amber-400 to-yellow-600' },
    { id: 'cute', name: 'Cute / Pastel', color: 'from-pink-300 to-purple-300' }
  ];

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-purple-500/20 overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName || user.email || '?')[0].toUpperCase()
                  )}
                </div>
                {user.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {user.displayName || 'Usuário'}
                </h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                {!user.emailVerified && (
                  <button
                    onClick={handleResendVerification}
                    className="text-xs text-amber-400 hover:text-amber-300 mt-1 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Email não verificado - Clique para reenviar
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 px-6 overflow-x-auto custom-scroll">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scroll">
            {/* Messages */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center"
                >
                  {success}
                </motion.div>
              )}
              {localError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center"
                >
                  {localError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-3xl font-bold text-purple-400">{profile?.totalOrders || 0}</div>
                    <div className="text-gray-400 text-sm">Pedidos</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400">
                      {user.emailVerified ? '✓' : '✗'}
                    </div>
                    <div className="text-gray-400 text-sm">Email verificado</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 col-span-2 md:col-span-1">
                    <div className="text-lg font-bold text-pink-400">{profile?.memberSince || 'Hoje'}</div>
                    <div className="text-gray-400 text-sm">Membro desde</div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações do Perfil</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Nome</label>
                      <p className="text-white">{profile?.displayName || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                      <p className="text-white">{user.email || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">WhatsApp</label>
                      <p className="text-white">{profile?.phoneNumber || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Empresa</label>
                      <p className="text-white">{profile?.company || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Instagram</label>
                      <p className="text-white">{profile?.instagram ? `@${profile.instagram}` : '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Website</label>
                      <p className="text-white">{profile?.website || '-'}</p>
                    </div>
                  </div>

                  {profile?.bio && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Bio</label>
                      <p className="text-white">{profile.bio}</p>
                    </div>
                  )}
                </div>

                {/* Preferred Style */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Estilo Preferido</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${styles.find(s => s.id === profile?.preferredStyle)?.color || 'from-purple-500 to-pink-500'}`}>
                    <span className="text-white font-medium">
                      {styles.find(s => s.id === profile?.preferredStyle)?.name || 'Neon Futurista'}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair da conta
                </button>
              </motion.div>
            )}

            {/* Edit Tab */}
            {activeTab === 'edit' && (
              <motion.form
                onSubmit={handleUpdateProfile}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nome</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none h-24"
                    placeholder="Conte um pouco sobre você ou sua marca..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Empresa</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Instagram</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value.replace('@', ''))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="seuusuario"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="https://seusite.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    'Salvar alterações'
                  )}
                </button>
              </motion.form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.form
                onSubmit={handleUpdatePassword}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                  <p className="text-amber-400 text-sm">
                    ⚠️ Para alterar sua senha, você precisa informar a senha atual por segurança.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Senha atual</label>
                  <div className="relative">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPasswords ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nova senha</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirmar nova senha</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Repita a nova senha"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Atualizando...
                    </>
                  ) : (
                    '🔐 Alterar senha'
                  )}
                </button>
              </motion.form>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Estilo Preferido</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Escolha o estilo que mais combina com você. Isso nos ajuda a criar artes personalizadas!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setPreferredStyle(style.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          preferredStyle === style.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.color} mb-3`} />
                        <span className="text-white font-medium">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleUpdatePreferences}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    'Salvar preferências'
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfile;
