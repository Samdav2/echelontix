import React from 'react';
import { TicketTier } from '../../types/ticket';
import { getTicketTheme } from '../../services/themeService';

interface SealProps {
  tier: TicketTier;
  size?: 'sm' | 'md' | 'lg';
}

export const AuthenticationSeal: React.FC<SealProps> = ({ tier, size = 'md' }) => {
  const theme = getTicketTheme(tier);

  const dimensions = {
    sm: 'w-16 h-16 text-[8px]',
    md: 'w-[84px] h-[84px] text-[9px]',
    lg: 'w-28 h-28 text-[10px]',
  }[size];

  return (
    <div
      className={`relative ${dimensions} rounded-full flex items-center justify-center p-1 border shadow-2xl bg-[#080808]/95 backdrop-blur-md select-none group transition-transform duration-500 hover:scale-105`}
      style={{
        borderColor: theme.accentColor,
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.9), inset 0 0 12px ${theme.glowColor}`,
      }}
    >
      <div
        className="absolute inset-0.5 rounded-full border border-dashed opacity-60 animate-[spin_40s_linear_infinite]"
        style={{ borderColor: theme.metallicColor }}
      />
      
      <div className="absolute inset-1.5 rounded-full border border-white/10" />
      <div
        className="absolute inset-2.5 rounded-full border opacity-30"
        style={{ borderColor: theme.accentColor }}
      />

      <div className="relative w-full h-full rounded-full flex flex-col items-center justify-center text-center p-1.5 z-10">
        <span className="text-[6.5px] tracking-[0.25em] font-semibold text-[#A6A6A6] uppercase leading-none">
          ECHELONTIX
        </span>
        
        <span
          className="my-0.5 font-bold tracking-[0.18em] uppercase text-[10px] font-serif-display leading-tight"
          style={{ color: theme.metallicColor }}
        >
          {tier}
        </span>
        
        <span className="text-[5.5px] tracking-[0.22em] font-semibold text-[#C8A96B] uppercase leading-none">
          VERIFIED PASS
        </span>

        <div className="mt-0.5 flex items-center justify-center text-[#C8A96B] text-[7px]">
          ✦
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-full bg-radial from-white/10 via-transparent to-transparent pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)` }}
      />
    </div>
  );
};
