import { TicketTheme, TicketTier } from '../types/ticket';
import { ECHELONTIX_COLORS } from '../config/designTokens';

/**
 * Returns material theme specification for each ticket tier.
 */
export function getTicketTheme(tier: TicketTier): TicketTheme {
  switch (tier) {
    case 'REGULAR':
      return {
        tier: 'REGULAR',
        name: 'Graphite Access Pass',
        subtitle: 'Clean, sophisticated, and accessible entry credential.',
        bgGradient: 'from-[#141416] via-[#18181C] to-[#0A0A0C]',
        cardBg: '#18181A',
        accentColor: ECHELONTIX_COLORS.silverAccent,
        metallicColor: '#D0D0D4',
        borderColor: 'rgba(192, 192, 196, 0.25)',
        glowColor: 'rgba(192, 192, 196, 0.08)',
        textColorPrimary: '#F0F0F2',
        textColorSecondary: '#9A9A9E',
        sealColor: '#B0B0B5',
        sealText: 'STANDARD ACCESS • VERIFIED',
        badgeStyle: 'bg-[#222226] text-[#D0D0D4] border border-[#3A3A40]',
        patternType: 'grid',
        description: 'Graphite / Brushed Silver material with clean precision rules.',
      };

    case 'VIP':
      return {
        tier: 'VIP',
        name: 'Champagne Gold Pass',
        subtitle: 'Elegant, premium, and exclusive privilege access.',
        bgGradient: 'from-[#12100C] via-[#1A1610] to-[#090806]',
        cardBg: '#14120F',
        accentColor: ECHELONTIX_COLORS.champagneGold,
        metallicColor: ECHELONTIX_COLORS.softGold,
        borderColor: 'rgba(200, 169, 107, 0.35)',
        glowColor: 'rgba(200, 169, 107, 0.12)',
        textColorPrimary: ECHELONTIX_COLORS.warmWhite,
        textColorSecondary: ECHELONTIX_COLORS.mutedGrey,
        sealColor: ECHELONTIX_COLORS.champagneGold,
        sealText: 'VIP ACCESS • PRIORITY VERIFIED',
        badgeStyle: 'bg-[#221C12] text-[#E3C98A] border border-[#C8A96B]/50',
        patternType: 'concentric',
        description: 'Champagne Gold foil effect with warm metallic depth.',
      };

    case 'VVIP':
      return {
        tier: 'VVIP',
        name: 'Obsidian Crystal Credential',
        subtitle: 'Private club & luxury credential with crystal geometry.',
        bgGradient: 'from-[#0A0A0A] via-[#14120D] to-[#050505]',
        cardBg: '#080808',
        accentColor: ECHELONTIX_COLORS.champagneGold,
        metallicColor: ECHELONTIX_COLORS.softGold,
        borderColor: 'rgba(227, 201, 138, 0.5)',
        glowColor: 'rgba(227, 201, 138, 0.2)',
        textColorPrimary: '#FFFFFF',
        textColorSecondary: '#B8B8B8',
        sealColor: ECHELONTIX_COLORS.softGold,
        sealText: 'ECHELONTIX • VVIP AUTHENTICATED ACCESS',
        badgeStyle: 'bg-gradient-to-r from-[#2A2214] to-[#1A150C] text-[#F3E5AB] border border-[#E3C98A]',
        patternType: 'crystal',
        description: 'Obsidian, Champagne Gold & fine crystal geometry linework.',
      };

    case 'TABLE':
      return {
        tier: 'TABLE',
        name: 'Obsidian Private Club Suite',
        subtitle: 'Exclusive private table reservation & host credential.',
        bgGradient: 'from-[#060606] via-[#100E0A] to-[#030303]',
        cardBg: '#050505',
        accentColor: '#D4B373',
        metallicColor: '#F0D59A',
        borderColor: 'rgba(212, 179, 115, 0.6)',
        glowColor: 'rgba(212, 179, 115, 0.25)',
        textColorPrimary: '#FFFFFF',
        textColorSecondary: '#C2C2C2',
        sealColor: '#F0D59A',
        sealText: 'PRIVATE SUITE • TABLE ACCESS VERIFIED',
        badgeStyle: 'bg-[#1F190E] text-[#F0D59A] border-2 border-[#D4B373]',
        patternType: 'club',
        description: 'Heavy gold identification elements with private club presence.',
      };

    default:
      return getTicketTheme('VVIP');
  }
}
