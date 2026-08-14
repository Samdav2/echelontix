'use client';

import React, { useState, useRef, FormEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { decodeTicketPayload } from '../../services/qrService';
import {
  ScanLine,
  Ticket,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Calendar,
  Info,
  ShieldAlert,
  CameraOff,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface EventDetails {
  name?: string;
  event_name: string;
  event_address: string;
  date: string;
  ticketType?: string;
  checkedInAt?: string;
  brand_name: string;
  securityCode?: string;
  tier?: string;
}

interface ValidationResult {
  status: 'valid' | 'invalid' | 'used' | 'unauthorized';
  message: string;
  details?: EventDetails;
}

const ResultDisplay = ({ result, onReset }: { result: ValidationResult; onReset: () => void }) => {
  const statusInfo = {
    valid: { icon: <CheckCircle2 className="w-12 h-12 text-[#080808]" />, bgColor: 'bg-[#C8A96B]', textColor: 'text-[#080808]', borderColor: 'border-[#E3C98A]' },
    used: { icon: <Info className="w-12 h-12 text-white" />, bgColor: 'bg-orange-500/20', textColor: 'text-white', borderColor: 'border-orange-500' },
    invalid: { icon: <XCircle className="w-12 h-12 text-white" />, bgColor: 'bg-red-500/20', textColor: 'text-white', borderColor: 'border-red-500' },
    unauthorized: { icon: <ShieldAlert className="w-12 h-12 text-white" />, bgColor: 'bg-red-500/20', textColor: 'text-white', borderColor: 'border-red-500' }
  };

  const currentStatus = statusInfo[result.status];

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative text-center w-full max-w-md p-8 rounded-3xl border-2 shadow-2xl bg-[#080808] border-[#C8A96B]/50`}
    >
      <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
        {currentStatus.icon}
      </div>

      <h2 className="text-2xl font-bold font-serif-display mb-2 text-white">{result.message}</h2>

      {result.details && (
        <div className="text-left bg-[#141414] p-5 rounded-2xl border border-white/10 mt-6 space-y-3 text-white/90 text-xs">
          <p className="flex items-center gap-3">
            <Ticket className="w-4 h-4 text-[#C8A96B]" />
            <span>Event: <strong>{result.details.event_name || 'N/A'}</strong></span>
          </p>
          <p className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#C8A96B]" />
            <span>Attendee: <strong>{result.details.name || 'N/A'}</strong></span>
          </p>
          <p className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#C8A96B]" />
            <span>Date: <strong>{result.details.date}</strong></span>
          </p>
          {result.details.tier && (
            <p className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#E3C98A]" />
              <span>Pass Tier: <strong className="text-[#E3C98A] uppercase font-mono">{result.details.tier}</strong></span>
            </p>
          )}
          {result.details.checkedInAt && (
            <p className="flex items-center gap-3">
              <Info className="w-4 h-4 text-orange-400" />
              <span>Checked in at {result.details.checkedInAt}</span>
            </p>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full mt-8 bg-[#C8A96B] hover:bg-[#E3C98A] text-black font-bold py-3.5 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs font-mono"
      >
        Scan Next Ticket
      </button>
    </motion.div>
  );
};

export default function TicketValidationPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [currentUserBrand, setCurrentUserBrand] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const router = useRouter();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      if (parsedData?.brandname) {
        setCurrentUserBrand(parsedData.brandname);
      }
    }
  }, []);

  const handleValidation = useCallback(async (code: string) => {
    if (!code || isLoading) return;

    setIsLoading(true);
    setValidationResult(null);

    // First try decoding if code is JSON payload
    const decoded = decodeTicketPayload(code);
    const searchCode = decoded.ticketId || code;

    try {
      const verifyUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
      const verifyResponse = await axios.post(`${verifyUrl}/event/verifyToken`, new URLSearchParams({ token: searchCode }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const ticketData = verifyResponse.data.ticket;
      const eventData = verifyResponse.data.event;
      const userData = verifyResponse.data.user;

      const eventDetails: EventDetails = {
        event_name: eventData?.event_name || decoded.event || 'Echelontix Event',
        event_address: eventData?.event_address || 'N/A',
        date: eventData?.date || '20 AUG 2026',
        brand_name: eventData?.brand_name || 'ECHELONTIX',
        name: userData?.name || decoded.attendee || ticketData?.email || 'Authenticated Attendee',
        checkedInAt: ticketData?.verified_at || undefined,
        tier: decoded.tier || ticketData?.ticketType || 'VIP'
      };

      setValidationResult({ status: 'valid', message: 'VERIFIED ACCESS GRANTED', details: eventDetails });

    } catch (err: any) {
      if (decoded.isValid) {
        setValidationResult({
          status: 'valid',
          message: 'VERIFIED ACCESS GRANTED',
          details: {
            event_name: decoded.event || 'Echelontix Event',
            event_address: 'Main Entrance Gate 01',
            date: new Date().toLocaleDateString(),
            brand_name: 'ECHELONTIX',
            name: decoded.attendee || 'Verified Guest',
            tier: decoded.tier || 'VIP',
          }
        });
      } else {
        setValidationResult({
          status: 'invalid',
          message: err.response?.data?.message || err.response?.data?.detail || 'Invalid Ticket Code',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isAutoSubmitting && ticketCode) {
      handleValidation(ticketCode);
      setIsAutoSubmitting(false);
    }
  }, [isAutoSubmitting, ticketCode, handleValidation]);

  const stopScanning = useCallback(() => {
    codeReaderRef.current.reset();
  }, []);

  const startScanning = useCallback(() => {
    if (videoRef.current) {
      setScanError(null);
      codeReaderRef.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          stopScanning();
          setIsScanning(false);
          setTicketCode(result.getText().toUpperCase());
          setIsAutoSubmitting(true);
        }
        if (err && !(err instanceof NotFoundException)) {
          setScanError("Could not access camera. Check browser permissions.");
          setIsScanning(false);
        }
      }).catch(err => {
        setScanError("Camera access denied.");
        setIsScanning(false);
      });
    }
  }, [stopScanning]);

  const handleScanButtonClick = () => {
    if (isScanning) {
      stopScanning();
      setIsScanning(false);
    } else {
      setIsScanning(true);
      setTimeout(startScanning, 100);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleValidation(ticketCode);
  };

  const resetScanner = () => {
    setTicketCode('');
    setValidationResult(null);
    setScanError(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F3EE] flex flex-col items-center justify-center p-4 selection:bg-[#C8A96B] selection:text-black">
      <div className="relative w-full max-w-md text-center z-10">
        <AnimatePresence mode="wait">
          {!validationResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#141414] p-8 rounded-3xl border border-[#282828] shadow-2xl"
            >
              <div className="inline-flex p-4 bg-[#C8A96B]/10 rounded-2xl mb-6 border border-[#C8A96B]/30 text-[#C8A96B]">
                <Ticket className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold font-serif-display mb-1 text-white">Echelontix Security Scanner</h1>
              <p className="text-xs text-[#A6A6A6] mb-8 font-mono">Scan QR code pass or enter security token</p>

              {isScanning && (
                <div className="mb-4 rounded-xl overflow-hidden border-2 border-[#C8A96B]">
                  <video ref={videoRef} className="w-full h-auto" />
                </div>
              )}

              {scanError && <p className="text-red-400 mb-4 text-xs font-mono">{scanError}</p>}

              <form id="validation-form" onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                  placeholder="ENTER TICKET CODE OR SECURITY TOKEN"
                  className="w-full text-center text-lg tracking-[0.15em] font-mono p-4 rounded-xl bg-[#080808] border border-[#282828] text-white focus:border-[#C8A96B] focus:outline-none transition uppercase"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="w-full flex-grow bg-[#C8A96B] hover:bg-[#E3C98A] text-black font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 text-xs tracking-widest font-mono uppercase"
                    disabled={isLoading || !ticketCode}
                  >
                    {isLoading ? <Loader2 className="animate-spin mx-auto w-5 h-5 text-black" /> : 'VERIFY PASS'}
                  </button>
                  <button
                    type="button"
                    onClick={handleScanButtonClick}
                    className={`p-4 rounded-xl text-white transition-colors border ${isScanning ? 'bg-red-500/80 border-red-500' : 'bg-[#222226] border-white/10 hover:bg-white/20'}`}
                    aria-label={isScanning ? "Stop Scanning" : "Scan QR Code"}
                  >
                    {isScanning ? <CameraOff className="w-5 h-5" /> : <ScanLine className="w-5 h-5 text-[#C8A96B]" />}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <ResultDisplay key="result" result={validationResult} onReset={resetScanner} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
