'use client';

import React from 'react';
import { MobileTicketView } from './ticket/MobileTicketView';
import { EchelontixTicketData, TicketTier } from '../types/ticket';
import { generateMobileTicketPdf } from '../services/pdfService';
import { Download, Sparkles } from 'lucide-react';

interface TicketProps {
  eventName?: string;
  eventTime?: string;
  price?: string;
  ticketType?: string;
  attendeeName?: string;
  venue?: string;
  ticketId?: string;
  seatInfo?: {
    type?: string;
    gate?: string;
    row?: string;
    seat?: string;
  };
  ticketData?: EchelontixTicketData;
}

const TicketCard: React.FC<TicketProps> = (props) => {
  const {
    eventName = 'THE GRAND AFFAIR',
    eventTime = '8:00 PM',
    price = '50',
    ticketType = 'VIP',
    attendeeName = 'Fredrick Mason',
    venue = 'The Grand Arena',
    ticketId = 'ETX-VIP-1234567',
    seatInfo = { type: 'VIP', gate: 'A', row: '5', seat: '12' },
    ticketData,
  } = props;

  const tier: TicketTier = (ticketData?.ticket.tier || ticketType?.toUpperCase() || 'VIP') as TicketTier;

  const data: EchelontixTicketData = ticketData || {
    event: {
      name: eventName,
      tagline: `Exclusive Admission • $${price}`,
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
      date: '20 AUG 2026',
      time: eventTime,
      venue: venue,
      location: `Gate ${seatInfo.gate || 'A'}, Row ${seatInfo.row || '1'}, Seat ${seatInfo.seat || '1'}`,
    },
    attendee: {
      name: attendeeName,
      seatNumber: `Gate ${seatInfo.gate || 'A'} • Seat ${seatInfo.seat || '12'}`,
    },
    ticket: {
      tier: tier,
      ticketId: ticketId,
      securityCode: `${ticketId.slice(-4)}-SEC9`,
      status: 'VALID',
    },
  };

  const handleDownload = async () => {
    try {
      await generateMobileTicketPdf(
        'echelontix-ticket-card-view',
        `${data.event.name.replace(/[^a-z0-9]/gi, '_')}_Ticket.pdf`
      );
    } catch (err) {
      console.error('Failed to generate ticket PDF:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div className="relative mb-4">
        <MobileTicketView ticketData={data} elementId="echelontix-ticket-card-view" />
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 bg-[#C8A96B] hover:bg-[#E3C98A] text-black font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest font-mono"
      >
        <Download className="w-4 h-4" />
        <span>Download Mobile Ticket PDF</span>
      </button>
    </div>
  );
};

export default TicketCard;
