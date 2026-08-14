import React, { useState } from 'react';
import { EchelontixTicketData } from '../../types/ticket';
import { generateMobileTicketPdf } from '../../services/pdfService';
import { MobileTicketView } from '../ticket/MobileTicketView';
import { FileText, Download, Check, Sparkles } from 'lucide-react';

interface PdfPreviewModalProps {
  ticketData: EchelontixTicketData;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ ticketData }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setDownloaded(false);
    try {
      await generateMobileTicketPdf(
        'pdf-export-mobile-ticket',
        `Echelontix-${ticketData.ticket.tier}-${ticketData.ticket.ticketId}.pdf`
      );
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="p-4 rounded-xl bg-[#141414] border border-[#282828] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C8A96B]/10 text-[#C8A96B]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-serif-display">
              Mobile PDF Ticket Exporter
            </h3>
            <p className="text-xs text-[#A6A6A6]">
              Vector-quality 1-page portrait PDF optimized for mobile wallets & printing.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A96B] hover:bg-[#E3C98A] text-black font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-green-800" />
              <span>PDF Exported!</span>
            </>
          ) : (
            <>
              <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
              <span>{isGenerating ? 'Rendering High-DPI PDF...' : 'Download Mobile PDF'}</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-[#050505] p-8 rounded-2xl border border-[#222222] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono text-[#C8A96B] tracking-[0.25em] flex items-center justify-center gap-1.5 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTRAIT PDF LAYOUT</span>
          </span>
          <p className="text-xs text-[#A6A6A6] mt-1">
            Exact vector composition saved directly to device
          </p>
        </div>

        <div className="p-2 bg-[#000000] rounded-3xl shadow-2xl border border-[#333333]">
          <MobileTicketView
            ticketData={ticketData}
            elementId="pdf-export-mobile-ticket"
            isPdfExporting={true}
          />
        </div>
      </div>
    </div>
  );
};
