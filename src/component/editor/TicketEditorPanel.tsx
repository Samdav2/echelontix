import React, { useState } from 'react';
import { EchelontixTicketData, TicketTier } from '../../types/ticket';
import { SAMPLE_TICKETS } from '../../data/sampleEvents';
import { TierBadge } from '../ticket/TierBadge';
import { pullBackendEventArtworks, downloadEventArtwork, EventArtwork } from '../../services/artworkService';
import { Sliders, Sparkles, Upload, Download, RefreshCw, Check, Copy, Grid, X } from 'lucide-react';

interface TicketEditorPanelProps {
  ticketData: EchelontixTicketData;
  onChange: (newData: EchelontixTicketData) => void;
}

export const TicketEditorPanel: React.FC<TicketEditorPanelProps> = ({
  ticketData,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'tier' | 'event' | 'attendee'>('presets');
  const [showArtworkPuller, setShowArtworkPuller] = useState<boolean>(false);
  const [backendArtworks, setBackendArtworks] = useState<EventArtwork[]>([]);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncToBackend = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch('/api/ticket/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (res.ok) {
        setSyncStatus('Synced to Backend');
        setTimeout(() => setSyncStatus(null), 3000);
      } else {
        setSyncStatus('Sync Failed');
        setTimeout(() => setSyncStatus(null), 3000);
      }
    } catch (err) {
      setSyncStatus('Local Mode');
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenArtworkPuller = async () => {
    setShowArtworkPuller(true);
    setIsLoadingArtworks(true);
    try {
      const list = await pullBackendEventArtworks();
      setBackendArtworks(list);
    } catch (err) {
      console.error('Failed to pull backend artworks:', err);
    } finally {
      setIsLoadingArtworks(false);
    }
  };

  const handleSelectPulledArtwork = (art: EventArtwork) => {
    onChange({
      ...ticketData,
      event: {
        ...ticketData.event,
        artwork: art.artwork,
        name: ticketData.event.name || art.eventName,
        tagline: ticketData.event.tagline || art.tagline,
      },
    });
    setShowArtworkPuller(false);
  };

  const handlePresetSelect = (key: string) => {
    if (SAMPLE_TICKETS[key]) {
      onChange(SAMPLE_TICKETS[key]);
    }
  };

  const handleTierChange = (tier: TicketTier) => {
    onChange({
      ...ticketData,
      ticket: {
        ...ticketData.ticket,
        tier,
        ticketId: `ETX-${tier}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });
  };

  const handleEventChange = (field: keyof EchelontixTicketData['event'], value: string) => {
    onChange({
      ...ticketData,
      event: {
        ...ticketData.event,
        [field]: value,
      },
    });
  };

  const handleAttendeeChange = (field: keyof EchelontixTicketData['attendee'], value: string) => {
    onChange({
      ...ticketData,
      attendee: {
        ...ticketData.attendee,
        [field]: value,
      },
    });
  };

  const handleTicketChange = (field: keyof EchelontixTicketData['ticket'], value: string) => {
    onChange({
      ...ticketData,
      ticket: {
        ...ticketData.ticket,
        [field]: value,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleEventChange('artwork', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#282828] rounded-2xl p-5 space-y-5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#C8A96B]" />
          <h3 className="font-bold text-white text-base font-serif-display">
            Live Ticket Customizer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncToBackend}
            disabled={isSyncing}
            className="px-2.5 py-1 bg-[#C8A96B]/10 hover:bg-[#C8A96B]/20 border border-[#C8A96B]/30 rounded-full text-xs font-semibold text-[#E3C98A] flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-[#C8A96B] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : syncStatus || 'Sync to Backend'}</span>
          </button>
          <span className="text-[10px] font-mono text-[#A6A6A6] bg-[#080808] px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
            REALTIME PREVIEW
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 bg-[#080808] p-1 rounded-xl border border-[#282828] text-xs">
        <button
          onClick={() => setActiveTab('presets')}
          className={`py-2 rounded-lg font-medium transition-all ${
            activeTab === 'presets' ? 'bg-[#C8A96B] text-black font-bold' : 'text-[#A6A6A6] hover:text-white'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('tier')}
          className={`py-2 rounded-lg font-medium transition-all ${
            activeTab === 'tier' ? 'bg-[#C8A96B] text-black font-bold' : 'text-[#A6A6A6] hover:text-white'
          }`}
        >
          Material Tier
        </button>
        <button
          onClick={() => setActiveTab('event')}
          className={`py-2 rounded-lg font-medium transition-all ${
            activeTab === 'event' ? 'bg-[#C8A96B] text-black font-bold' : 'text-[#A6A6A6] hover:text-white'
          }`}
        >
          Event Data
        </button>
        <button
          onClick={() => setActiveTab('attendee')}
          className={`py-2 rounded-lg font-medium transition-all ${
            activeTab === 'attendee' ? 'bg-[#C8A96B] text-black font-bold' : 'text-[#A6A6A6] hover:text-white'
          }`}
        >
          Attendee
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#A6A6A6] uppercase tracking-wider block">
            Select Echelontix Presets
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { key: 'grandAffair', label: 'Echelontix Classic', sub: 'Obsidian + Gold', detail: 'The Grand Affair (VVIP)' },
              { key: 'techSummit', label: 'Echelontix Silver', sub: 'Graphite + Silver', detail: 'Executive AI Summit (Regular)' },
              { key: 'monacoYacht', label: 'Echelontix Noir', sub: 'Deep Black + Minimal Gold', detail: 'Monaco Yacht Lounge (VIP)' },
              { key: 'metGalaAuction', label: 'Echelontix Crystal', sub: 'Black + Gold + Crystal', detail: 'Metropolitan Gala (Table)' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => handlePresetSelect(p.key)}
                className="p-3 bg-[#0A0A0A] hover:bg-[#18181A] border border-white/10 hover:border-[#C8A96B]/60 rounded-xl text-left transition-all group shadow-sm"
              >
                <div className="font-bold text-white text-xs group-hover:text-[#E3C98A] transition-colors">
                  {p.label}
                </div>
                <div className="text-[10px] text-[#C8A96B] font-medium mt-0.5">{p.sub}</div>
                <div className="text-[9px] text-[#A6A6A6] mt-0.5 truncate">{p.detail}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tier' && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#A6A6A6] uppercase tracking-wider block">
            Select Credential Material Identity
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'REGULAR', name: 'REGULAR', desc: 'Graphite / Brushed Silver', border: 'border-gray-500' },
              { id: 'VIP', name: 'VIP', desc: 'Champagne Gold Foil', border: 'border-[#C8A96B]' },
              { id: 'VVIP', name: 'VVIP', desc: 'Obsidian / Gold / Crystal', border: 'border-[#E3C98A]' },
              { id: 'TABLE', name: 'TABLE', desc: 'Private Club Suite', border: 'border-[#D4B373]' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleTierChange(t.id as TicketTier)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  ticketData.ticket.tier === t.id
                    ? `${t.border} bg-[#221C12] text-white shadow-lg`
                    : 'border-white/10 bg-[#080808] text-[#A6A6A6] hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <TierBadge tier={t.id as TicketTier} size="sm" />
                  {ticketData.ticket.tier === t.id && (
                    <Sparkles className="w-3.5 h-3.5 text-[#E3C98A]" />
                  )}
                </div>
                <div className="text-[10px] text-[#A6A6A6] mt-2 font-medium">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'event' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#A6A6A6] block mb-1">Event Name</label>
            <input
              type="text"
              value={ticketData.event.name}
              onChange={(e) => handleEventChange('name', e.target.value)}
              className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#A6A6A6] block mb-1">Tagline</label>
            <input
              type="text"
              value={ticketData.event.tagline}
              onChange={(e) => handleEventChange('tagline', e.target.value)}
              className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[#A6A6A6] block mb-1">Date</label>
              <input
                type="text"
                value={ticketData.event.date}
                onChange={(e) => handleEventChange('date', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#A6A6A6] block mb-1">Time</label>
              <input
                type="text"
                value={ticketData.event.time}
                onChange={(e) => handleEventChange('time', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#A6A6A6] block mb-1">Venue & Location</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={ticketData.event.venue}
                onChange={(e) => handleEventChange('venue', e.target.value)}
                placeholder="Venue"
                className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
              />
              <input
                type="text"
                value={ticketData.event.location}
                onChange={(e) => handleEventChange('location', e.target.value)}
                placeholder="Location"
                className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#A6A6A6] block mb-1">Event Artwork Image</label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ticketData.event.artwork}
                  onChange={(e) => handleEventChange('artwork', e.target.value)}
                  placeholder="Image URL"
                  className="flex-1 bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none truncate"
                />
                <label className="px-3 py-2 bg-[#222] hover:bg-[#333] border border-white/10 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 text-white">
                  <Upload className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenArtworkPuller}
                  className="px-3 py-1.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B]/20 border border-[#C8A96B]/40 text-[#E3C98A] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>Pull Image from Backend</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadEventArtwork(ticketData.event.artwork, `${ticketData.event.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-artwork.jpg`)}
                  className="px-3 py-1.5 bg-[#18181A] hover:bg-[#252528] border border-white/10 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>Download Artwork</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ticketData.event.artwork);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-[#18181A] hover:bg-[#252528] border border-white/10 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">URL Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#A6A6A6]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showArtworkPuller && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#121214] border border-[#282828] rounded-3xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#C8A96B]" />
                <h3 className="font-bold text-white text-base font-serif-display">
                  Pull Artwork from Backend Data
                </h3>
              </div>
              <button
                onClick={() => setShowArtworkPuller(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-[#A6A6A6] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#A6A6A6]">
              Select an event artwork pulled directly from Echelontix backend data API to apply it to your current ticket credential.
            </p>

            {isLoadingArtworks ? (
              <div className="py-12 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-[#C8A96B] animate-spin mx-auto" />
                <p className="text-xs text-[#A6A6A6]">Pulling artwork data from backend server...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
                {backendArtworks.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => handleSelectPulledArtwork(art)}
                    className={`group relative rounded-xl overflow-hidden border text-left transition-all bg-[#080808] hover:border-[#C8A96B] ${
                      ticketData.event.artwork === art.artwork
                        ? 'border-[#C8A96B] ring-2 ring-[#C8A96B]/50'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-black/40">
                      <img
                        src={art.artwork}
                        alt={art.eventName}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <div className="text-[10px] font-bold text-[#C8A96B] uppercase tracking-wider">
                        {art.category}
                      </div>
                      <div className="text-xs font-bold text-white font-serif-display truncate">
                        {art.eventName}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowArtworkPuller(false)}
                className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white font-semibold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendee' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#A6A6A6] block mb-1">Attendee Name</label>
            <input
              type="text"
              value={ticketData.attendee.name}
              onChange={(e) => handleAttendeeChange('name', e.target.value)}
              className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#A6A6A6] block mb-1">Seat / Table Assignment</label>
            <input
              type="text"
              value={ticketData.attendee.seatNumber || ''}
              onChange={(e) => handleAttendeeChange('seatNumber', e.target.value)}
              placeholder="e.g. VVIP Table 4 - Seat 2"
              className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[#A6A6A6] block mb-1">Ticket ID</label>
              <input
                type="text"
                value={ticketData.ticket.ticketId}
                onChange={(e) => handleTicketChange('ticketId', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-[#A6A6A6] block mb-1">Security Code</label>
              <input
                type="text"
                value={ticketData.ticket.securityCode}
                onChange={(e) => handleTicketChange('securityCode', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#C8A96B] outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
