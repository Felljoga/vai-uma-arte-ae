import { motion } from 'framer-motion';
import { Crown, Shield, Sword, Check, User, Handshake } from 'lucide-react';
import { ROLE_CONFIG, type UserRole } from '@/services/admin';

interface UserBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const iconMap = {
  Crown,
  Shield,
  Sword,
  Check,
  User,
  Handshake,
};

export function UserBadge({ role, size = 'md', showLabel = true, className = '' }: UserBadgeProps) {
  const config = ROLE_CONFIG[role];
  const Icon = iconMap[config.icon as keyof typeof iconMap] || User;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.color} border ${config.borderColor} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.displayName}</span>}
    </motion.span>
  );
}

interface UserAvatarWithFrameProps {
  src?: string | null;
  name: string;
  role: UserRole;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  onClick?: () => void;
}

export function UserAvatarWithFrame({
  src,
  name,
  role,
  size = 'md',
  showBadge = true,
  onClick,
}: UserAvatarWithFrameProps) {
  const config = ROLE_CONFIG[role];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const frameSizes = {
    sm: 'p-0.5',
    md: 'p-0.5',
    lg: 'p-1',
    xl: 'p-1',
  };

  const badgeSizes = {
    sm: 'w-4 h-4 text-[8px] -bottom-0.5 -right-0.5',
    md: 'w-5 h-5 text-[10px] -bottom-0.5 -right-0.5',
    lg: 'w-6 h-6 text-xs -bottom-1 -right-1',
    xl: 'w-8 h-8 text-sm -bottom-1 -right-1',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';
  const isMod = role === 'moderator';
  const isPartner = role === 'partner';
  const hasGlow = isOwner || isAdmin || isMod || isPartner;

  return (
    <motion.div
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* Animated glow for special roles */}
      {hasGlow && (
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} blur-md opacity-50 animate-pulse`}
          style={{ transform: 'scale(1.2)' }}
        />
      )}
      
      {/* Partner special effect */}
      {isPartner && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 blur-lg opacity-30 animate-pulse"
          style={{ transform: 'scale(1.4)', animationDuration: '2s' }}
        />
      )}

      {/* Frame */}
      <div
        className={`relative rounded-full bg-gradient-to-br ${config.gradient} ${frameSizes[size]}`}
      >
        {/* Avatar */}
        <div
          className={`${sizeClasses[size]} rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden`}
        >
          {src ? (
            <img src={src} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className={`font-bold text-white ${textSizes[size]}`}>
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Badge */}
      {showBadge && (
        <span
          className={`absolute ${badgeSizes[size]} rounded-full flex items-center justify-center bg-gradient-to-br ${config.gradient} border-2 border-zinc-900`}
          title={config.displayName}
        >
          {config.badge}
        </span>
      )}

      {/* Crown animation for owner */}
      {isOwner && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

interface UserNameWithBadgeProps {
  name: string;
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showRoleBadge?: boolean;
  className?: string;
}

export function UserNameWithBadge({
  name,
  role,
  size = 'md',
  showRoleBadge = true,
  className = '',
}: UserNameWithBadgeProps) {
  const config = ROLE_CONFIG[role];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isOwner = role === 'owner';
  const isPartner = role === 'partner';
  const isSpecial = role === 'owner' || role === 'admin' || role === 'moderator' || role === 'partner';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`font-semibold ${textSizes[size]} ${isSpecial ? config.color : 'text-white'}`}
      >
        {name}
        {isOwner && <span className="ml-1">👑</span>}
        {isPartner && <span className="ml-1">🤝</span>}
      </span>
      {showRoleBadge && role !== 'member' && (
        <UserBadge role={role} size="sm" showLabel={false} />
      )}
    </span>
  );
}
