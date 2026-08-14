import React, { useEffect, useState } from 'react';
import { EchelontixTicketData } from '../../types/ticket';
import { getTicketTheme } from '../../services/themeService';
import { generateTicketQRCodeDataUrl } from '../../services/qrService';
import { AuthenticationSeal } from './AuthenticationSeal';
import { TierBadge } from './TierBadge';
import { GoldFoilOverlay } from './GoldFoilOverlay';
import { downloadEventArtwork } from '../../services/artworkService';
import { ShieldCheck, Sparkles, QrCode, Maximize2, Copy, Check, ExternalLink, X, Image as ImageIcon, Download } from 'lucide-react';

interface MobileTicketViewProps {
  ticketData: EchelontixTicketData;
  elementId?: string;
  isPdfExporting?: boolean;
}

export const MobileTicketView: React.FC<MobileTicketViewProps> = ({
  ticketData,
  elementId = 'mobile-ticket-credential',
  isPdfExporting = false,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showArtworkModal, setShowArtworkModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const theme = getTicketTheme(ticketData.ticket.tier);

  useEffect(() => {
    let isMounted = true;
    generateTicketQRCodeDataUrl(ticketData, {
      darkColor: '#080808',
      lightColor: '#FFFFFF',
      width: 240,
    }).then((url) => {
      if (isMounted) setQrCodeUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [ticketData]);

  const handleCopyArtworkLink = () => {
    navigator.clipboard.writeText(ticketData.event.artwork);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadArtwork = () => {
    const filename = `${ticketData.event.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-artwork.jpg`;
    downloadEventArtwork(ticketData.event.artwork, filename);
  };

  return (
    <div
      id={elementId}
      className={`relative w-full max-w-[390px] mx-auto bg-gradient-to-b ${theme.bgGradient} text-[#F5F3EE] rounded-2xl overflow-hidden shadow-2xl border font-sans-interface select-none transition-all duration-300`}
      style={{
        borderColor: theme.borderColor,
        boxShadow: `0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px ${theme.glowColor}, inset 0 0 0 1px rgba(200, 169, 107, 0.15)`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        {theme.patternType === 'crystal' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,100 M100,0 L0,100 M50,0 L50,100 M0,50 L100,50" stroke={theme.metallicColor} strokeWidth="0.15" fill="none" />
            <circle cx="50" cy="50" r="35" stroke={theme.metallicColor} strokeWidth="0.2" fill="none" />
            <circle cx="50" cy="50" r="25" stroke={theme.metallicColor} strokeWidth="0.15" strokeDasharray="1 1" fill="none" />
          </svg>
        )}
        {theme.patternType === 'concentric' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="30" r="60" stroke={theme.metallicColor} strokeWidth="0.2" fill="none" />
            <circle cx="50" cy="30" r="45" stroke={theme.metallicColor} strokeWidth="0.15" fill="none" />
            <circle cx="50" cy="30" r="30" stroke={theme.metallicColor} strokeWidth="0.1" fill="none" />
          </svg>
        )}
        {theme.patternType === 'grid' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="ticket-grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={theme.metallicColor} strokeWidth="0.2" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#ticket-grid-pattern)" />
          </svg>
        )}
        {theme.patternType === 'club' && (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="5" y="5" width="90" height="90" stroke={theme.accentColor} strokeWidth="0.2" fill="none" />
            <rect x="10" y="10" width="80" height="80" stroke={theme.accentColor} strokeWidth="0.1" fill="none" />
          </svg>
        )}
      </div>

      <div className="relative px-5 pt-5 pb-3.5 border-b border-white/10 flex items-center justify-between z-10 bg-[#080808]/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#C8A96B] text-[10px]">✦</span>
            <span className="font-bold tracking-[0.35em] text-xs text-[#F5F3EE] font-serif-display uppercase">
              ECHELONTIX
            </span>
          </div>
          <div className="text-[8.5px] text-[#A6A6A6] mt-0.5 tracking-[0.28em] font-mono uppercase">
            DIGITAL ACCESS PASS
          </div>
        </div>

        <TierBadge tier={ticketData.ticket.tier} size="md" />
      </div>

      <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#C8A96B]/50 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-[#C8A96B]/50 pointer-events-none" />

      <div className="relative w-full h-60 overflow-hidden bg-[#080808] group">
        <img
          src={ticketData.event.artwork}
          alt={ticketData.event.name}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23121214"/><text x="50%" y="50%" fill="%23C8A96B" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">ECHELONTIX ACCESS</text></svg>';
          }}
          className="w-full h-full object-cover object-center filter brightness-105 contrast-100 transition-transform duration-700 group-hover:scale-105"
        />

        <GoldFoilOverlay />

        {!isPdfExporting && (
          <button
            onClick={() => setShowArtworkModal(true)}
            title="Inspect & Pull Artwork Image"
            className="absolute top-3.5 left-3.5 z-20 opacity-90 hover:opacity-100 bg-black/75 backdrop-blur-md hover:bg-[#C8A96B] hover:text-black text-white p-2 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-lg group-hover:scale-105"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[9.5px] tracking-wider uppercase font-sans-interface">Pull Image</span>
          </button>
        )}

        <div className="absolute top-3.5 right-3.5 z-20">
          <AuthenticationSeal tier={ticketData.ticket.tier} size="md" />
        </div>

        <div className="absolute bottom-4 left-5 right-5 z-20">
          <div className="text-[9.5px] text-[#E3C98A] mb-1 tracking-[0.25em] font-mono uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#C8A96B]" />
            <span>✦ EXCLUSIVE EVENT</span>
          </div>
          <h1 className="text-2xl font-bold font-serif-display text-[#F5F3EE] tracking-wide leading-tight drop-shadow-lg">
            {ticketData.event.name}
          </h1>
          {ticketData.event.tagline && (
            <p className="text-[11px] text-[#C8A96B] font-semibold tracking-wider uppercase mt-1">
              {ticketData.event.tagline}
            </p>
          )}
        </div>
      </div>

      <div className="relative px-5 py-5 space-y-4 z-10">
        <div className="relative grid grid-cols-3 gap-1.5 bg-[#121214]/95 p-4 rounded-xl border border-[#C8A96B]/45 text-center backdrop-blur-md shadow-[0_4px_20px_rgba(200,169,107,0.12),inset_0_1px_0_rgba(227,201,138,0.2)] overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#E3C98A]/50 to-transparent pointer-events-none" />

          <div className="flex flex-col items-center justify-start border-r border-[#C8A96B]/20 px-1.5 py-0.5">
            <div className="p-1.5 rounded-full bg-gradient-to-b from-[#C8A96B]/15 to-[#C8A96B]/05 border border-[#C8A96B]/30 mb-1.5 flex items-center justify-center shadow-[0_2px_8px_rgba(200,169,107,0.15)]">
              <svg className="w-3.5 h-3.5 text-[#E3C98A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
                <line x1="16" y1="2.5" x2="16" y2="6.5" />
                <line x1="8" y1="2.5" x2="8" y2="6.5" />
                <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
              </svg>
            </div>
            <span className="text-[8.5px] text-[#A6A6A6] tracking-[0.2em] font-mono uppercase font-semibold">DATE</span>
            <span className="text-[12px] font-bold text-[#F5F3EE] mt-0.5 tracking-wide font-serif-display">
              {ticketData.event.date}
            </span>
          </div>

          <div className="flex flex-col items-center justify-start border-r border-[#C8A96B]/20 px-1.5 py-0.5">
            <div className="p-1.5 rounded-full bg-gradient-to-b from-[#C8A96B]/15 to-[#C8A96B]/05 border border-[#C8A96B]/30 mb-1.5 flex items-center justify-center shadow-[0_2px_8px_rgba(200,169,107,0.15)]">
              <svg className="w-3.5 h-3.5 text-[#E3C98A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 6.5 12 12 15.5 14" />
              </svg>
            </div>
            <span className="text-[8.5px] text-[#A6A6A6] tracking-[0.2em] font-mono uppercase font-semibold">TIME</span>
            <span className="text-[12px] font-bold text-[#F5F3EE] mt-0.5 tracking-wide font-serif-display">
              {ticketData.event.time}
            </span>
          </div>

          <div className="flex flex-col items-center justify-start px-1.5 py-0.5">
            <div className="p-1.5 rounded-full bg-gradient-to-b from-[#C8A96B]/15 to-[#C8A96B]/05 border border-[#C8A96B]/30 mb-1.5 flex items-center justify-center shadow-[0_2px_8px_rgba(200,169,107,0.15)]">
              <svg className="w-3.5 h-3.5 text-[#E3C98A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.5C12 21.5 19.5 15.2 19.5 9.5C19.5 5.35786 16.1421 2 12 2C7.85786 2 4.5 5.35786 4.5 9.5C4.5 15.2 12 21.5 12 21.5Z" />
                <circle cx="12" cy="9.5" r="2.2" strokeWidth="1.0" />
              </svg>
            </div>
            <span className="text-[8.5px] text-[#A6A6A6] tracking-[0.2em] font-mono uppercase font-semibold">VENUE</span>
            <span className="text-[12px] font-bold text-[#F5F3EE] mt-0.5 leading-tight break-words font-serif-display">
              {ticketData.event.venue}
            </span>
            <span className="text-[9px] text-[#C8A96B]/90 leading-tight break-words mt-0.5 font-mono">
              {ticketData.event.location}
            </span>
          </div>
        </div>

        <div className="relative p-4 rounded-xl bg-[#141414] border border-[#C8A96B]/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div>
              <span className="text-[9px] text-[#A6A6A6] tracking-widest font-mono uppercase block">ATTENDEE</span>
              <span className="text-base font-bold text-white tracking-wider font-serif-display mt-0.5 block">
                {ticketData.attendee.name}
              </span>
            </div>
            {ticketData.attendee.seatNumber && (
              <div className="text-right">
                <span className="text-[9px] text-[#A6A6A6] tracking-widest font-mono uppercase block">SEAT / TABLE</span>
                <span className="text-xs font-semibold text-[#E3C98A] font-mono">
                  {ticketData.attendee.seatNumber}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
            <div>
              <span className="text-[9px] text-[#A6A6A6] tracking-widest font-mono uppercase block">TICKET ID</span>
              <span className="font-mono font-bold text-[#C8A96B] tracking-wider text-xs">
                {ticketData.ticket.ticketId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#A6A6A6] tracking-widest font-mono uppercase block">SECURITY CODE</span>
              <span className="font-mono font-bold text-[#E3C98A] tracking-wider text-xs">
                {ticketData.ticket.securityCode}
              </span>
            </div>
          </div>
        </div>

        <div className="relative bg-[#F8F7F4] text-black rounded-xl p-3.5 flex flex-col items-center justify-center text-center shadow-xl border border-[#C8A96B]/60">
          <div className="flex items-center gap-1.5 text-[#080808] mb-1.5">
            <QrCode className="w-3.5 h-3.5 text-[#080808]" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#080808] uppercase font-mono">
              YOUR ENTRY PASS
            </span>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 shadow-inner my-1">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Entry QR Code"
                className="w-36 h-36 object-contain block mx-auto"
              />
            ) : (
              <div className="w-36 h-36 bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-mono">
                Generating Pass...
              </div>
            )}
          </div>

          <span className="text-[9.5px] font-semibold text-gray-500 tracking-wider uppercase mt-1 font-mono">
            SCAN AT ENTRANCE FOR VERIFIED ACCESS
          </span>

          <div className="mt-1 px-3 py-0.5 bg-gray-200/80 rounded-full text-[10px] font-mono font-bold text-gray-900 tracking-widest">
            ETX • {ticketData.ticket.securityCode}
          </div>
        </div>

        <div className="pt-2 text-center border-t border-white/10 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#C8A96B] font-semibold tracking-[0.2em] uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>VERIFIED DIGITAL CREDENTIAL</span>
          </div>
          <p className="text-[8.5px] text-[#A6A6A6] tracking-[0.2em] font-mono uppercase">
            THIS TICKET IS UNIQUE & NON-TRANSFERABLE
          </p>
          <div className="text-[8px] text-[#666666] tracking-[0.25em] font-mono uppercase">
            ECHELONTIX • www.echelontix.com
          </div>
        </div>
      </div>

      <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-[#C8A96B]/50 pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#C8A96B]/50 pointer-events-none" />

      {showArtworkModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#121214] border border-[#282828] rounded-3xl p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#C8A96B]/20 rounded-xl text-[#C8A96B]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif-display">
                    Pulled Event Artwork
                  </h3>
                  <p className="text-xs text-[#A6A6A6]">{ticketData.event.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowArtworkModal(false)}
                className="p-2 hover:bg-white/10 rounded-full text-[#A6A6A6] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#080808] aspect-video flex items-center justify-center group">
              <img
                src={ticketData.event.artwork}
                alt={ticketData.event.name}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadArtwork}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold text-xs rounded-xl shadow-lg hover:opacity-95 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </button>

              <button
                onClick={handleCopyArtworkLink}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#222] hover:bg-[#333] border border-white/10 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied Link</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C8A96B]" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={ticketData.event.artwork}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#18181A] hover:bg-[#252528] border border-white/10 text-white font-semibold text-xs rounded-xl transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#C8A96B]" />
                <span>Open Direct</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
