/**
 * Echelontix Luxury Ticket Data Types & System Interfaces
 */

export type TicketTier = 'REGULAR' | 'VIP' | 'VVIP' | 'TABLE';

export interface EventData {
  name: string;
  tagline: string;
  artwork: string;
  logo?: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  organizer?: string;
}

export interface AttendeeData {
  name: string;
  email?: string;
  phone?: string;
  seatNumber?: string;
  tableNumber?: string;
  avatarUrl?: string;
}

export interface TicketMetadata {
  tier: TicketTier;
  ticketId: string;
  securityCode: string;
  issueDate?: string;
  serialNumber?: string;
  status: 'VALID' | 'USED' | 'SUSPENDED';
  validEntries?: number;
  perks?: string[];
}

export interface EchelontixTicketData {
  event: EventData;
  attendee: AttendeeData;
  ticket: TicketMetadata;
}

export interface TicketTheme {
  tier: TicketTier;
  name: string;
  subtitle: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  metallicColor: string;
  borderColor: string;
  glowColor: string;
  textColorPrimary: string;
  textColorSecondary: string;
  sealColor: string;
  sealText: string;
  badgeStyle: string;
  patternType: 'grid' | 'concentric' | 'crystal' | 'club';
  description: string;
}
