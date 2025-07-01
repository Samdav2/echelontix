'use client';

import React, { useState, useRef, FormEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import {
  ScanLine,
  Ticket,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Calendar,
  Info,
  ShieldAlert,
  CameraOff
} from "lucide-react";

// --- Type Definitions ---
interface EventDetails {
    name?: string;
    event_name: string;
    event_address: string;
    date: string;
    ticketType?: string;
    checkedInAt?: string;
    brand_name: string;
}

interface ValidationResult {
  status: 'valid' | 'invalid' | 'used' | 'unauthorized';
  message: string;
  details?: EventDetails;
}

// --- UI Sub-components ---

const ResultDisplay = ({ result, onReset }: { result: ValidationResult; onReset: () => void }) => {
  const statusInfo = {
    valid: { icon: <CheckCircle className="w-12 h-12 text-black" />, bgColor: 'bg-yellow-400', textColor: 'text-black', borderColor: 'border-yellow-400' },
    used: { icon: <Info className="w-12 h-12 text-white" />, bgColor: 'bg-orange-500/20', textColor: 'text-white', borderColor: 'border-orange-500' },
    invalid: { icon: <XCircle className="w-12 h-12 text-white" />, bgColor: 'bg-red-500/20', textColor: 'text-white', borderColor: 'border-red-500' },
    unauthorized: { icon: <ShieldAlert className="w-12 h-12 text-white" />, bgColor: 'bg-red-500/20', textColor: 'text-white', borderColor: 'border-red-500' }
  };

  const currentStatus = statusInfo[result.status];

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative text-center w-full max-w-md p-8 rounded-3xl border-2 shadow-2xl ${currentStatus.bgColor} ${currentStatus.borderColor}`}
    >
      <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 ${currentStatus.borderColor}`}>
        {currentStatus.icon}
      </div>

      <h2 className={`text-3xl font-bold mb-2 ${currentStatus.textColor}`}>{result.message}</h2>

      {result.details && (
        <div className="text-left bg-black/30 p-4 rounded-lg mt-6 space-y-3 text-white/80">
          <p className="flex items-center gap-3"><Ticket className="w-5 h-5 text-yellow-300" /> <strong>{result.details.event_name || 'N/A'}</strong></p>
          <p className="flex items-center gap-3"><User className="w-5 h-5 text-yellow-300" /> {result.details.name || 'N/A'}</p>
          <p className="flex items-center gap-3"><Calendar className="w-5 h-5 text-yellow-300" /> {new Date(result.details.date).toLocaleDateString()}</p>
          {result.details.checkedInAt && (
            <p className="flex items-center gap-3"><Info className="w-5 h-5 text-orange-400" /> Already checked in at {result.details.checkedInAt}</p>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full mt-8 bg-black text-yellow-400 font-bold py-3 rounded-full hover:bg-gray-800 transition-all duration-300"
      >
        Scan Next Ticket
      </button>
    </motion.div>
  );
};


// --- Main Page Component ---

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
  const codeReader = useRef(new BrowserMultiFormatReader());
  const router = useRouter();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      // Corrected: Check for profile.brandName to match login data structure
      if (parsedData.profile && parsedData.profile.brandName) {
        setCurrentUserBrand(parsedData.profile.brandName);
      } else {
        alert("You are not authorized to view this page.");
        router.push('/dashboard/creator');
      }
    } else {
      router.push('/auth/signin');
    }
  }, [router]);

  const handleValidation = useCallback(async () => {
    if (!ticketCode || isLoading) return;

    setIsLoading(true);
    setValidationResult(null);

    try {
      // Step 1: Verify the token and get event details
      const verifyUrl = process.env.NEXT_PUBLIC_VERIFY_TOKEN!;
      const verifyResponse = await axios.post(verifyUrl, { token: ticketCode });

      const eventDetails: EventDetails = verifyResponse.data.eventDetails;
      // Add user profile name to the details object if it exists
      if (verifyResponse.data.userProfile) {
        eventDetails.name = verifyResponse.data.userProfile.name;
      }

      // Step 2: Perform authorization check
      const authorizedBrands = ['Roman', 'Down'];
      if (eventDetails.brand_name !== currentUserBrand && !authorizedBrands.includes(currentUserBrand || '')) {
        setValidationResult({
          status: 'unauthorized',
          message: 'Authorization Failed',
          details: eventDetails
        });
        return;
      }

      // Step 3: Check if ticket has already been used
      if (verifyResponse.data.message === 'Token has already been used') {
        setValidationResult({
          status: 'used',
          message: 'Ticket Already Used',
          details: eventDetails
        });
        return;
      }

      // Step 4: If all checks pass, delete (check-in) the ticket
      const deleteUrl = process.env.NEXT_PUBLIC_DELETE_TICKET!;
      await axios.delete(deleteUrl, { data: { token: ticketCode } });

      // Step 5: Show the final success message with details from the verification step
      setValidationResult({
        status: 'valid',
        message: 'Ticket Validated!',
        details: eventDetails,
      });

    } catch (err: any) {
      setValidationResult({
        status: 'invalid',
        message: err.response?.data?.message || 'Invalid Ticket',
      });
    } finally {
      setIsLoading(false);
    }
  }, [ticketCode, isLoading, currentUserBrand, router]);

  useEffect(() => {
    if (isAutoSubmitting) {
        handleValidation();
        setIsAutoSubmitting(false);
    }
  }, [isAutoSubmitting, handleValidation]);

  const startScanning = useCallback(() => {
    setScanError(null);
    if(videoRef.current) {
        // Corrected: Pass null instead of undefined for the deviceId
        codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            stopScanning();
            setTicketCode(result.getText().toUpperCase());
            setIsAutoSubmitting(true);
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error('QR Scan Error:', err);
            setScanError("Could not start camera. Please check permissions.");
            setIsScanning(false);
          }
        }).catch(err => {
            console.error("Camera access error:", err);
            setScanError("Camera access denied. Please allow camera permissions in your browser settings.");
            setIsScanning(false);
        });
    }
  }, []);

  const stopScanning = useCallback(() => {
    codeReader.current.reset();
  }, []);

  const handleScanButtonClick = () => {
    if (isScanning) {
        stopScanning();
        setIsScanning(false);
    } else {
        setIsScanning(true);
        startScanning();
    }
  }

  useEffect(() => {
      return () => stopScanning();
  }, [stopScanning]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleValidation();
  };

  const resetScanner = () => {
    setTicketCode('');
    setValidationResult(null);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: "url('/assets/ba.jpg')"}}></div>
      <div className="relative w-full max-w-md text-center z-10">
        <AnimatePresence mode="wait">
          {!validationResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-block p-4 bg-yellow-400/10 rounded-full mb-6 border-2 border-yellow-400/20">
                <Ticket className="w-10 h-10 text-yellow-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Ticket Validator</h1>
              <p className="text-gray-400 mb-8">Enter the ticket code or use the camera to scan.</p>

              {isScanning && (
                <div className="mb-4 rounded-lg overflow-hidden border-2 border-yellow-400">
                    <video ref={videoRef} className="w-full h-auto" />
                </div>
              )}

              {scanError && <p className="text-red-400 mb-4 text-sm">{scanError}</p>}

              <form id="validation-form" onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                  placeholder="ENTER TICKET CODE"
                  className="w-full text-center text-2xl tracking-[0.2em] font-mono p-4 rounded-lg bg-black/30 border-2 border-white/20 focus:border-yellow-400 focus:ring-0 focus:outline-none transition"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="w-full flex-grow bg-yellow-400 text-black font-bold py-4 rounded-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-wait"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Validate'}
                  </button>
                  <button
                    type="button"
                    onClick={handleScanButtonClick}
                    className={`p-4 rounded-lg text-white transition-colors ${isScanning ? 'bg-red-500/80 hover:bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
                    aria-label={isScanning ? "Stop Scanning" : "Scan QR Code"}
                  >
                    {isScanning ? <CameraOff/> : <ScanLine />}
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
