import React from 'react';
import { ECHELONTIX_COLORS } from '../../config/designTokens';
import { Layers, Grid, Type, Palette } from 'lucide-react';

export const DesignTokensViewer: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#282828]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#C8A96B]/10 text-[#C8A96B]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-serif-display">
              Echelontix Design System & Material Identity Specification
            </h2>
            <p className="text-xs text-[#A6A6A6]">
              12-Column grid, luxury typography, material tier specifications & security micro-elements.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#141414] border border-[#282828] space-y-4">
        <div className="flex items-center gap-2 text-[#C8A96B] font-bold text-sm">
          <Grid className="w-4 h-4" />
          <h3 className="uppercase tracking-widest text-xs font-mono">1. Visual Composition Grid (60% / 25% / 15%)</h3>
        </div>

        <div className="grid grid-cols-12 gap-2 text-center text-[10px] font-mono">
          <div className="col-span-7 bg-[#C8A96B]/10 border border-[#C8A96B] p-3 rounded-lg text-[#E3C98A]">
            60% TYPOGRAPHY & ESSENTIAL TICKET DATA
          </div>
          <div className="col-span-3 bg-[#111111] border border-gray-700 p-3 rounded-lg text-gray-400">
            25% NEGATIVE SPACE
          </div>
          <div className="col-span-2 bg-[#221C12] border border-[#E3C98A]/40 p-3 rounded-lg text-[#C8A96B]">
            15% DECOR & SEAL
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#141414] border border-[#282828] space-y-4">
        <div className="flex items-center gap-2 text-[#C8A96B] font-bold text-sm">
          <Palette className="w-4 h-4" />
          <h3 className="uppercase tracking-widest text-xs font-mono">2. Primary Palette & Material System</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Obsidian Black', hex: ECHELONTIX_COLORS.obsidian, desc: 'Primary Canvas' },
            { name: 'Deep Charcoal', hex: ECHELONTIX_COLORS.charcoal, desc: 'Information Panels' },
            { name: 'Champagne Gold', hex: ECHELONTIX_COLORS.champagneGold, desc: 'Luxury Primary' },
            { name: 'Soft Gold', hex: ECHELONTIX_COLORS.softGold, desc: 'Highlights & Seals' },
            { name: 'Warm White', hex: ECHELONTIX_COLORS.warmWhite, desc: 'Primary Text' },
            { name: 'Muted Grey', hex: ECHELONTIX_COLORS.mutedGrey, desc: 'Labels & Microtext' },
          ].map((c) => (
            <div key={c.name} className="bg-[#080808] p-3 rounded-xl border border-white/10 text-center space-y-2">
              <div className="w-full h-10 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: c.hex }} />
              <div>
                <span className="block text-xs font-bold text-white">{c.name}</span>
                <span className="block text-[10px] font-mono text-[#C8A96B]">{c.hex}</span>
                <span className="block text-[9px] text-gray-400 mt-0.5">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#141414] border border-[#282828] space-y-4">
        <div className="flex items-center gap-2 text-[#C8A96B] font-bold text-sm">
          <Type className="w-4 h-4" />
          <h3 className="uppercase tracking-widest text-xs font-mono">3. Editorial Typography Hierarchy</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#080808] rounded-xl border border-white/10">
            <span className="text-[9px] font-mono text-[#C8A96B] uppercase tracking-wider block">DISPLAY TYPEFACE (SERIF)</span>
            <p className="text-2xl font-serif-display font-bold text-white mt-2">Playfair Display & Cormorant</p>
            <p className="text-xs text-[#A6A6A6] mt-2">
              Used for event titles, VVIP credentials, and major editorial statements.
            </p>
          </div>

          <div className="p-4 bg-[#080808] rounded-xl border border-white/10">
            <span className="text-[9px] font-mono text-[#C8A96B] uppercase tracking-wider block">INTERFACE TYPEFACE (SANS-SERIF)</span>
            <p className="text-xl font-sans-interface font-semibold text-white mt-2">Plus Jakarta Sans & Inter</p>
            <p className="text-xs text-[#A6A6A6] mt-2">
              Used for dates, venues, ticket IDs, attendee names, and mobile UI controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
