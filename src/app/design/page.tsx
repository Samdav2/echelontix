'use client';

import React, { useState } from 'react';
import { SAMPLE_TICKETS } from '../../data/sampleEvents';
import { EchelontixTicketData } from '../../types/ticket';
import { MobileTicketView } from '../../component/ticket/MobileTicketView';
import { TicketEditorPanel } from '../../component/editor/TicketEditorPanel';
import { PdfPreviewModal } from '../../component/preview/PdfPreviewModal';
import { ScannerModal } from '../../component/preview/ScannerModal';
import { GmailEmailPreview } from '../../component/email/GmailEmailPreview';
import { DesignTokensViewer } from '../../component/editor/DesignTokensViewer';
import { Smartphone, FileText, Mail, QrCode, Sliders, Layers, Sparkles } from 'lucide-react';

export default function DesignPage() {
  const [ticketData, setTicketData] = useState<EchelontixTicketData>(SAMPLE_TICKETS.grandAffair);
  const [activeTab, setActiveTab] = useState<'editor' | 'pdf' | 'email' | 'scanner' | 'tokens'>('editor');

  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F3EE] font-sans-interface selection:bg-[#C8A96B] selection:text-black pb-24">
      {/* TOP LUXURY HEADER BAR */}
      <header className="border-b border-[#222222] bg-[#0C0C0E]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C8A96B] to-[#E3C98A] p-[1px] shadow-lg">
              <div className="w-full h-full bg-[#080808] rounded-[11px] flex items-center justify-center text-[#C8A96B] font-bold text-lg font-serif-display">
                ✦
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-[0.25em] font-serif-display uppercase text-white">
                  ECHELONTIX
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#C8A96B]/15 text-[#E3C98A] border border-[#C8A96B]/30 text-[9px] font-mono font-bold tracking-widest uppercase">
                  v2.0 PLATFORM
                </span>
              </div>
              <p className="text-[10px] text-[#A6A6A6] tracking-widest font-mono uppercase mt-0.5">
                AUTHENTICATED DIGITAL ACCESS PLATFORM & CREDENTIAL SUITE
              </p>
            </div>
          </div>

          {/* MAIN TAB CONTROLS */}
          <nav className="flex items-center bg-[#121214] p-1.5 rounded-2xl border border-[#282828] text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'editor'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold shadow-md'
                  : 'text-[#A6A6A6] hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Credential</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'pdf'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold shadow-md'
                  : 'text-[#A6A6A6] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Exporter</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold shadow-md'
                  : 'text-[#A6A6A6] hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Gmail Confirmation</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold shadow-md'
                  : 'text-[#A6A6A6] hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Security Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('tokens')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'tokens'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#E3C98A] text-black font-bold shadow-md'
                  : 'text-[#A6A6A6] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Design Tokens</span>
            </button>
          </nav>
        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* TAB 1: MOBILE TICKET CREDENTIAL & LIVE EDITOR */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-4">
              <span className="text-[10px] font-mono text-[#C8A96B] tracking-[0.3em] uppercase flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AUTHENTICATED PASS PREVIEW</span>
              </span>
              <h2 className="text-2xl font-bold font-serif-display text-white mt-1">
                Luxury Mobile Access Pass
              </h2>
              <p className="text-xs text-[#A6A6A6] mt-1">
                Customize tier materials, event metadata, artwork, and attendee identity in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: LIVE MOBILE TICKET DISPLAY */}
              <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-28">
                <MobileTicketView ticketData={ticketData} />
              </div>

              {/* RIGHT: LIVE EDITOR CONTROLS */}
              <div className="lg:col-span-7">
                <TicketEditorPanel ticketData={ticketData} onChange={setTicketData} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOBILE PDF TICKET EXPORTER */}
        {activeTab === 'pdf' && (
          <div className="pt-2">
            <PdfPreviewModal ticketData={ticketData} />
          </div>
        )}

        {/* TAB 3: RESPONSIVE GMAIL EMAIL PREVIEW */}
        {activeTab === 'email' && (
          <div className="pt-2">
            <GmailEmailPreview ticketData={ticketData} />
          </div>
        )}

        {/* TAB 4: LIVE QR SECURITY & VERIFICATION SCANNER */}
        {activeTab === 'scanner' && (
          <div className="pt-2">
            <ScannerModal ticketData={ticketData} />
          </div>
        )}

        {/* TAB 5: DESIGN TOKENS SPECIFICATION */}
        {activeTab === 'tokens' && (
          <div className="pt-2">
            <DesignTokensViewer />
          </div>
        )}

      </div>
    </main>
  );
}
