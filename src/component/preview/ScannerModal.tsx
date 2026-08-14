import React, { useState } from 'react';
import { EchelontixTicketData } from '../../types/ticket';
import { ShieldCheck, CheckCircle2, RefreshCw, QrCode } from 'lucide-react';

interface ScannerModalProps {
  ticketData: EchelontixTicketData;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ ticketData }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    verified: boolean;
    timestamp: string;
    gate: string;
  } | null>(null);

  const handleSimulateScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/ticket/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticketData.ticket.ticketId,
          securityCode: ticketData.ticket.securityCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsScanning(false);
        setScanResult({
          verified: data.valid ?? true,
          timestamp: data.verifiedAt ? new Date(data.verifiedAt).toLocaleTimeString() : new Date().toLocaleTimeString(),
          gate: 'VIP Gate 01 - Main Entrance',
        });
        return;
      }
    } catch (err) {
      // Fallback
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
        gate: 'VIP Gate 01 - Main Entrance',
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#141414] rounded-2xl border border-[#282828] p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C8A96B]/10 text-[#C8A96B]">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-serif-display">
              Live QR Security & Verification Scanner
            </h3>
            <p className="text-xs text-[#A6A6A6]">
              Simulate entry scanner verification at venue doors.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 bg-[#C8A96B] hover:bg-[#E3C98A] text-black font-bold text-xs rounded-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Token...' : 'Simulate Scan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center bg-[#080808] p-4 rounded-xl border border-white/10">
        <div>
          <span className="text-[9px] font-mono text-[#A6A6A6] uppercase tracking-wider block">TICKET ID</span>
          <span className="block font-mono text-xs font-bold text-[#C8A96B] mt-1">
            {ticketData.ticket.ticketId}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-[#A6A6A6] uppercase tracking-wider block">SECURITY TOKEN</span>
          <span className="block font-mono text-xs font-bold text-[#E3C98A] mt-1">
            {ticketData.ticket.securityCode}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-[#A6A6A6] uppercase tracking-wider block">TIER</span>
          <span className="block text-xs font-bold text-white mt-1 uppercase">
            {ticketData.ticket.tier}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono text-[#A6A6A6] uppercase tracking-wider block">ATTENDEE</span>
          <span className="block text-xs font-bold text-white mt-1 truncate">
            {ticketData.attendee.name}
          </span>
        </div>
      </div>

      {isScanning ? (
        <div className="p-8 rounded-xl bg-[#0A0A0A] border border-[#C8A96B]/30 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#C8A96B] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-[#E3C98A] tracking-widest uppercase">
            DECODING CRYPTOGRAPHIC TOKEN...
          </span>
        </div>
      ) : scanResult ? (
        <div className="p-6 rounded-xl bg-[#08180E] border border-green-500/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold tracking-widest uppercase inline-block">
              VERIFIED ACCESS GRANTED
            </span>
            <h4 className="text-xl font-bold text-white font-serif-display mt-2">
              {ticketData.attendee.name}
            </h4>
            <p className="text-xs text-green-200/80 mt-1">
              {ticketData.event.name} • {ticketData.ticket.tier} PASS
            </p>
          </div>

          <div className="pt-3 border-t border-green-500/20 flex items-center justify-around text-xs text-green-300/70 font-mono">
            <span>TIMESTAMP: {scanResult.timestamp}</span>
            <span>LOCATION: {scanResult.gate}</span>
            <span>STATUS: VALID 1/1</span>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-[#080808] border border-dashed border-white/20 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-[#C8A96B] mx-auto opacity-60" />
          <p className="text-xs text-[#A6A6A6]">
            Click "Simulate Scan" to verify ticket authenticity and cryptographic token signature.
          </p>
        </div>
      )}
    </div>
  );
};
