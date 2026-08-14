import React, { useEffect, useState } from 'react';
import { EchelontixTicketData } from '../../types/ticket';
import { generateGmailEmailHtml } from '../../services/emailService';
import { generateTicketQRCodeDataUrl } from '../../services/qrService';
import { Copy, Download, Mail, Check, Code, Smartphone, Monitor } from 'lucide-react';

interface GmailEmailPreviewProps {
  ticketData: EchelontixTicketData;
}

export const GmailEmailPreview: React.FC<GmailEmailPreviewProps> = ({ ticketData }) => {
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  useEffect(() => {
    let isMounted = true;
    generateTicketQRCodeDataUrl(ticketData, {
      darkColor: '#080808',
      lightColor: '#FFFFFF',
      width: 200,
    }).then((qrUrl) => {
      if (isMounted) {
        const html = generateGmailEmailHtml(ticketData, qrUrl);
        setEmailHtml(html);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [ticketData]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([emailHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Echelontix-Gmail-Ticket-${ticketData.ticket.ticketId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="p-4 rounded-xl bg-[#141414] border border-[#282828] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#C8A96B]/10 text-[#C8A96B]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-serif-display">
              Responsive Gmail Confirmation Email
            </h3>
            <p className="text-xs text-[#A6A6A6]">
              Table-based inline CSS rendering compatible with Gmail iOS, Android & Desktop.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#080808] p-1 rounded-lg border border-[#282828] text-xs">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'mobile' ? 'bg-[#222222] text-[#E3C98A] font-semibold' : 'text-[#A6A6A6]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'desktop' ? 'bg-[#222222] text-[#E3C98A] font-semibold' : 'text-[#A6A6A6]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <div className="flex items-center bg-[#080808] p-1 rounded-lg border border-[#282828] text-xs">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'preview' ? 'bg-[#C8A96B] text-black font-bold' : 'text-[#A6A6A6]'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'code' ? 'bg-[#C8A96B] text-black font-bold' : 'text-[#A6A6A6]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#222] hover:bg-[#333] text-white text-xs font-semibold rounded-lg border border-white/10 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#C8A96B]" />}
            <span>{copied ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#C8A96B] hover:bg-[#E3C98A] text-black text-xs font-bold rounded-lg transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .HTML</span>
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="flex justify-center bg-[#050505] p-6 rounded-2xl border border-[#222222] min-h-[600px] overflow-auto">
          <div
            className={`transition-all duration-300 ${
              viewMode === 'mobile' ? 'w-[380px]' : 'w-[600px]'
            } bg-[#080808] rounded-xl shadow-2xl border border-[#282828] overflow-hidden`}
          >
            <div className="bg-[#1A1A1A] px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs text-[#A6A6A6]">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-gray-300 truncate">
                  Subject: Your Access Credential: {ticketData.event.name}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:inline">
                Gmail Sandbox
              </span>
            </div>

            <iframe
              title="Gmail Ticket Preview"
              srcDoc={emailHtml}
              className="w-full h-[700px] border-0"
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0A0C] p-4 rounded-xl border border-[#222222] relative">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-xs text-[#A6A6A6]">
            <span>Raw Table-Based HTML Email Template</span>
            <span className="font-mono text-[#C8A96B]">{emailHtml.length} bytes</span>
          </div>
          <pre className="p-4 bg-[#050505] rounded-lg text-xs font-mono text-gray-300 overflow-x-auto max-h-[600px] leading-relaxed select-all">
            {emailHtml}
          </pre>
        </div>
      )}
    </div>
  );
};
