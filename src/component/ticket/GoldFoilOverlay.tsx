import React from 'react';

interface GoldFoilOverlayProps {
  className?: string;
  opacity?: number;
}

export const GoldFoilOverlay: React.FC<GoldFoilOverlayProps> = ({
  className = '',
  opacity = 0.12,
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-10 ${className}`}>
      {/* Subtle Gold Foil Noise Texture */}
      <div
        className="absolute inset-0 mix-blend-overlay pointer-events-none"
        style={{
          opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='goldFoilNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23goldFoilNoise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Light Gold Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(227, 201, 138, 0.12) 0%, rgba(200, 169, 107, 0.04) 50%, rgba(8, 8, 8, 0.35) 100%)',
        }}
      />

      {/* Soft Vignette Edge */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(8,8,8,0.40)_100%)] pointer-events-none" />

      {/* Subtle Bottom Gradient for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/25 via-40% to-transparent pointer-events-none" />

      {/* Soft Top Dark Shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Gold Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E3C98A]/50 to-transparent pointer-events-none" />
    </div>
  );
};
