import React from 'react';
import { TicketTier } from '../../types/ticket';

interface TierBadgeProps {
  tier: TicketTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const tierConfig = {
    REGULAR: {
      label: 'REGULAR',
      icon: '✦',
      bgGradientStyle: 'linear-gradient(135deg, #242428 0%, #1A1A1E 50%, #121214 100%)',
      borderGradient: 'linear-gradient(135deg, #4B4B52 0%, #D4D4DC 50%, #1F1F23 100%)',
      borderWidth: '1px',
      textColor: 'text-[#D0D0D5]',
      glowShadow: '0 2px 10px rgba(113, 113, 122, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      shimmerColor: 'rgba(212, 212, 220, 0.25)',
    },
    VIP: {
      label: 'VIP',
      icon: '✦',
      bgGradientStyle: 'linear-gradient(135deg, #2E2415 0%, #1E170C 50%, #120D06 100%)',
      borderGradient: 'linear-gradient(135deg, #0D0A06 0%, #E3C98A 50%, #1A140E 100%)',
      borderWidth: '1px',
      textColor: 'text-[#E3C98A]',
      glowShadow: '0 3px 14px rgba(200, 169, 107, 0.28), inset 0 1px 0 rgba(227, 201, 138, 0.25)',
      shimmerColor: 'rgba(227, 201, 138, 0.28)',
    },
    VVIP: {
      label: 'VVIP',
      icon: '✦',
      bgGradientStyle: 'linear-gradient(135deg, #3D2F18 0%, #261D0D 50%, #110B03 100%)',
      borderGradient: 'linear-gradient(135deg, #0A0703 0%, #F5E6B3 45%, #C8A96B 75%, #0D0803 100%)',
      borderWidth: '1px',
      textColor: 'text-[#F5E6B3]',
      glowShadow: '0 4px 20px rgba(227, 201, 138, 0.42), 0 0 8px rgba(227, 201, 138, 0.2), inset 0 1px 0 rgba(255, 250, 220, 0.35)',
      shimmerColor: 'rgba(245, 230, 179, 0.35)',
    },
    TABLE: {
      label: 'TABLE',
      icon: '✦',
      bgGradientStyle: 'linear-gradient(135deg, #443314 0%, #2A1E09 50%, #140D02 100%)',
      borderGradient: 'radial-gradient(ellipse at center, #FFEBB2 0%, #E3C98A 35%, #9E7D3B 70%, #241805 100%)',
      borderWidth: '1.5px',
      textColor: 'text-[#F0D59A]',
      glowShadow: '0 4px 24px rgba(240, 213, 154, 0.5), 0 0 10px rgba(212, 179, 115, 0.3), inset 0 1px 0 rgba(255, 235, 180, 0.4)',
      shimmerColor: 'rgba(255, 235, 178, 0.4)',
    },
  }[tier] || {
    label: tier,
    icon: '✦',
    bgGradientStyle: 'linear-gradient(135deg, #2E2415 0%, #1E170C 50%, #120D06 100%)',
    borderGradient: 'linear-gradient(135deg, #0D0A06 0%, #E3C98A 50%, #1A140E 100%)',
    borderWidth: '1px',
    textColor: 'text-[#E3C98A]',
    glowShadow: '0 3px 14px rgba(200, 169, 107, 0.28)',
    shimmerColor: 'rgba(227, 201, 138, 0.25)',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[8.5px] gap-1 rounded-md tracking-[0.16em]',
    md: 'px-3 py-1 text-[10px] gap-1.5 rounded-lg tracking-[0.2em]',
    lg: 'px-4 py-1.5 text-xs gap-2 rounded-xl tracking-[0.22em]',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold font-mono uppercase select-none overflow-hidden transition-all duration-300 ${tierConfig.textColor} ${sizeClasses} ${className}`}
      style={{
        background: `${tierConfig.bgGradientStyle} padding-box, ${tierConfig.borderGradient} border-box`,
        border: `${tierConfig.borderWidth} solid transparent`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: tierConfig.glowShadow,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-80 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${tierConfig.shimmerColor}, transparent)` }}
      />
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${tierConfig.shimmerColor} 0%, transparent 60%)`,
        }}
      />
      {showIcon && (
        <span className="text-[0.85em] opacity-90 leading-none">
          {tierConfig.icon}
        </span>
      )}
      <span className="relative z-10 leading-none">{tierConfig.label}</span>
    </div>
  );
};
