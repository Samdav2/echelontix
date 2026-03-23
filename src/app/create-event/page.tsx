'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Calendar,
    Clock,
    MapPin,
    AlignLeft,
    Image as ImageIcon,
    DollarSign,
    Users,
    Plus,
    Trash2,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Ticket
} from 'lucide-react';
import { Donut } from "progressive-shapes";

// --- Helper Components ---
const Alert: React.FC<{ message: string; type: 'success' | 'error' | 'info' }> = ({ message, type }) => {
    if (!message) return null;
    const alertStyles = {
        success: 'bg-green-500/10 text-green-400 border border-green-500/20',
        error: 'bg-red-500/10 text-red-400 border border-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    };
    return (
        <div className={`p-4 rounded-xl text-center font-medium ${alertStyles[type]} mb-6`}>
            {message}
        </div>
    );
};

// --- Type Definitions ---
interface CustomTicket {
    name: string;
    price: string;
    capacity: string;
}

interface EventDetails {
    brand_name: string;
    eventName: string;
    date: string;
    timeIn: string;
    timeOut: string;
    eventAddress: string;
    summary: string;
    picture: File | null;
    category: string;
    account_name: string;
    account_number: string;
    bank: string;
    // Legacy fields for API compatibility if needed, though we prefer dynamic tickets
    vip: string;
    vvip: string;
    price: string;
    vvvip_price: string;
}




// --- Bank List ---
const bankCodeMapping: { [key: string]: string } = {
    '9MOBILE 9PAYMENT SERVICE BANK': '120001', 'ABBEY MORTGAGE BANK': '801', 'ABOVE ONLY MFB': '51204',
    'ABULESORO MFB': '51312', 'ACCESS BANK': '044', 'ACCESS BANK (DIAMOND)': '063', 'AIRTEL SMARTCASH PSB': '120004',
    'ALAT BY WEMA': '035A', 'AMJU UNIQUE MFB': '50926', 'ARAMOKO MFB': '50083', 'ASO SAVINGS AND LOANS': '401',
    'ASTRAPOLARIS MFB LTD': 'MFB50094', 'BAINESCREDIT MFB': '51229', 'BOWEN MICROFINANCE BANK': '50931',
    'CARBON': '565', 'CEMCS MICROFINANCE BANK': '50823', 'CHANELLE MICROFINANCE BANK LIMITED': '50171',
    'CITIBANK NIGERIA': '023', 'CORESTEP MFB': '50204', 'CORONATION MERCHANT BANK': '559', 'CRESCENT MFB': '51297',
    'ECOBANK NIGERIA': '050', 'EKIMOGUN MFB': '50263', 'EKONDO MICROFINANCE BANK': '562', 'EYOWO': '50126',
    'FIDELITY BANK': '070', 'FIRMUS MFB': '51314', 'FIRST BANK OF NIGERIA': '011', 'FIRST CITY MONUMENT BANK': '214',
    'FSDH MERCHANT BANK LIMITED': '501', 'GATEWAY MORTGAGE BANK LTD': '812', 'GLOBUS BANK': '00103',
    'GOMONEY': '100022', 'GUARANTY TRUST BANK': '058', 'HACKMAN MICROFINANCE BANK': '51251',
    'HASAL MICROFINANCE BANK': '50383', 'HERITAGE BANK': '030', 'HOPEPSB': '120002', 'IBILE MICROFINANCE BANK': '51244',
    'IKOYI OSUN MFB': '50439', 'INFINITY MFB': '50457', 'JAIZ BANK': '301', 'KADPOLY MFB': '50502',
    'KEYSTONE BANK': '082', 'KREDI MONEY MFB LTD': '50200', 'KUDA BANK': '50211', 'LAGOS BUILDING INVESTMENT COMPANY PLC.': '90052',
    'LINKS MFB': '50549', 'LIVING TRUST MORTGAGE BANK': '031', 'LOTUS BANK': '303', 'MAYFAIR MFB': '50563',
    'MINT MFB': '50304', 'MTN MOMO PSB': '120003', 'OPAY': '999992', 'PAGA': '100002', 'PALMPAY': '999991',
    'PARALLEX BANK': '104', 'PARKWAY - READYCASH': '311', 'PAYCOM': '999992', 'PETRA MIRCOFINANCE BANK PLC': '50746',
    'POLARIS BANK': '076', 'POLYUNWANA MFB': '50864', 'PREMIUMTRUST BANK': '105', 'PROVIDUS BANK': '101',
    'QUICKFUND MFB': '51293', 'RAND MERCHANT BANK': '502', 'REFUGE MORTGAGE BANK': '90067', 'RUBIES MFB': '125',
    'SAFE HAVEN MFB': '51113', 'SOLID ROCK MFB': '50800', 'SPARKLE MICROFINANCE BANK': '51310',
    'STANBIC IBTC BANK': '221', 'STANDARD CHARTERED BANK': '068', 'STELLAS MFB': '51253', 'STERLING BANK': '232',
    'SUNTUST BANK': '100', 'TAJ BANK': '302', 'TANGERINE MONEY': '51269', 'TCF MFB': '51211', 'TITAN BANK': '102',
    'TITAN PAYSTACK': '100039', 'UNICAL MFB': '50871', 'UNION BANK OF NIGERIA': '032', 'UNITED BANK FOR AFRICA': '033',
    'UNITY BANK': '215', 'VFD MICROFINANCE BANK LIMITED': '566', 'WEMA BANK': '035', 'ZENITH BANK': '057'
};
const bankList = Object.keys(bankCodeMapping);

const CreateEventPage: React.FC = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isFree, setIsFree] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isClient, setIsClient] = useState(false);

    const [eventDetails, setEventDetails] = useState<EventDetails>({
        brand_name: "", eventName: "", date: "", timeIn: "", timeOut: "", eventAddress: "", summary: "",
        picture: null, category: "", account_name: "", account_number: "", bank: "",
        vip: "0", vvip: "0", price: "0", vvvip_price: "0"
    });

    const [tickets, setTickets] = useState<CustomTicket[]>([
        { name: 'Regular', price: '', capacity: '100' }
    ]);

    useEffect(() => {
        setIsClient(true);
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedData = JSON.parse(storedUserData);
            if (parsedData && parsedData.brandname) {
                setEventDetails(prev => ({ ...prev, brand_name: parsedData.brandname }));
            }
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEventDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setFeedback({ message: 'File size exceeds 5MB.', type: 'error' });
                return;
            }
            setEventDetails(prev => ({ ...prev, picture: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- Ticket Management ---
    const addTicket = () => {
        setTickets([...tickets, { name: '', price: '', capacity: '100' }]);
    };

    const removeTicket = (index: number) => {
        if (tickets.length > 1) {
            const newTickets = tickets.filter((_, i) => i !== index);
            setTickets(newTickets);
        }
    };

    const handleTicketChange = (index: number, field: keyof CustomTicket, value: string) => {
        const newTickets = [...tickets];
        newTickets[index] = { ...newTickets[index], [field]: value };
        setTickets(newTickets);
    };

    const handleFreeEventToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setIsFree(e.target.checked);
        if (e.target.checked) {
            setTickets([{ name: 'Free Entry', price: '0', capacity: '100' }]);
        } else {
            setTickets([{ name: 'Regular', price: '', capacity: '100' }]);
        }
    };

    // --- Navigation ---
    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    // --- Submission ---
    const handleSubaccountSetup = async () => {
        setFeedback({ message: "Verifying payout details with Paystack...", type: 'info' });
        const bankCode = bankCodeMapping[eventDetails.bank.toUpperCase()];
        if (!bankCode) throw new Error("Selected bank is not valid.");

        try {
            const subaccountSetupUrl = process.env.NEXT_PUBLIC_SETUP_SUBACCOUNT_URL!;
            await axios.post(subaccountSetupUrl, {
                business_name: eventDetails.account_name,
                settlement_bank: bankCode,
                account_number: eventDetails.account_number,
                percentage_charge: 20
            });
            setFeedback(null);
            return true;
        } catch (error) {
            console.error("Subaccount setup failed:", error);
            throw new Error("Could not verify or create payout account. Please check details and try again.");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        try {
            if (!isFree) {
                await handleSubaccountSetup();
            }

            // Map tickets to legacy fields for API compatibility if needed
            // We'll use the first ticket as 'price' (Regular), and others as tables or special categories
            // For now, we'll send the tickets as 'tables' to the table creation endpoint as requested

            // 1. Create Event FIRST
            setFeedback({ message: "Creating event...", type: 'info' });
            const formDataToSend = new FormData();

            // Map the first ticket price to the main price field for display purposes
            const mainPrice = tickets.length > 0 ? tickets[0].price : "0";

            const payload = {
                ...eventDetails,
                price: mainPrice,
                vip: "0", // Deprecated in favor of dynamic tickets
                vvip: "0",
                vvvip_price: "0"
            };

            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null) {
                    let finalKey = key;
                    if (key === 'eventName') finalKey = 'event_name';
                    else if (key === 'eventAddress') finalKey = 'event_address';
                    else if (key === 'timeIn') finalKey = 'time_in';
                    else if (key === 'timeOut') finalKey = 'time_out';
                    else if (key === 'picture') finalKey = 'file';
                    else if (key === 'vip') finalKey = 'vip_price';
                    else if (key === 'vvip') finalKey = 'vvip_price';

                    formDataToSend.append(finalKey, value as string | Blob);
                }
            });

            const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
            const eventResponse = await axios.post(`${url}/event/event`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Get the event_id from the response
            const eventId = eventResponse.data?.id || eventResponse.data?.event_id;
            console.log('Event created with ID:', eventId);

            // 2. Create Tables (Tickets) AFTER event is created
            if (tickets.length > 0 && eventId) {
                setFeedback({ message: "Creating ticket types...", type: 'info' });
                const tablesPayload = tickets.map(ticket => ({
                    tableName: ticket.name,
                    tablePrice: parseInt(ticket.price, 10) || 0,
                    tableCapacity: parseInt(ticket.capacity, 10) || 0,
                }));

                const tableApiPayload = {
                    event_id: eventId,
                    tables: tablesPayload
                };

                try {
                    await axios.post(`${url}/event/tableCreation`, tableApiPayload, {
                        headers: { "Content-Type": "application/json" },
                    });
                    console.log('Tables created successfully');
                } catch (tableErr: any) {
                    console.error('Failed to create tables:', tableErr);
                    // Don't fail the whole operation if tables fail
                }
            }

            setFeedback({ message: "Event created successfully! Redirecting...", type: 'success' });
            setTimeout(() => router.push('/dashboard/creator'), 2000);

        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || (error as Error).message || "An error occurred.";
            setFeedback({ message: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isClient) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-yellow-500/30 py-8">
            {/* Form Card with Donut */}
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8 md:p-12">
                    {/* Header with Donut Progress */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Create Event</h1>

                        {/* Donut Progress Indicator */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <Donut
                                    currentStep={currentStep}
                                    totalSteps={3}
                                    size={100}
                                    backgroundColor="#27272a"
                                    progressColor="#facc15"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{currentStep}</div>
                                        <div className="text-xs text-zinc-500">of 3</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

                        {/* --- STEP 1: EVENT DETAILS --- */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-2">Event Details</h2>
                                    <p className="text-zinc-400">Tell us about your upcoming event.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                            <AlignLeft size={16} /> Event Name
                                        </label>
                                        <input
                                            type="text" name="eventName" value={eventDetails.eventName} onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Summer Vibes 2025"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                            <Calendar size={16} /> Date
                                        </label>
                                        <input
                                            type="date" name="date" value={eventDetails.date} onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                            <Clock size={16} /> Start Time
                                        </label>
                                        <input
                                            type="time" name="timeIn" value={eventDetails.timeIn} onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                            <Clock size={16} /> End Time
                                        </label>
                                        <input
                                            type="time" name="timeOut" value={eventDetails.timeOut} onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                        <MapPin size={16} /> Location
                                    </label>
                                    <input
                                        type="text" name="eventAddress" value={eventDetails.eventAddress} onChange={handleChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                        placeholder="Full address of the venue"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Description</label>
                                    <textarea
                                        name="summary" value={eventDetails.summary} onChange={handleChange} rows={4} maxLength={300}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="What's this event about?"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Category</label>
                                        <select
                                            name="category" value={eventDetails.category} onChange={handleChange}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Music">Music</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Tech">Tech</option>
                                            <option value="Art">Art</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                            <ImageIcon size={16} /> Cover Image
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file" accept="image/*" onChange={handleImageChange}
                                                className="hidden" id="imageUpload"
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-full bg-zinc-900 border border-dashed border-zinc-700 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-zinc-800 transition-all h-[58px]"
                                            >
                                                {eventDetails.picture ? (
                                                    <span className="text-yellow-400 font-medium truncate px-4">{eventDetails.picture.name}</span>
                                                ) : (
                                                    <span className="text-zinc-500">Click to upload image</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="relative h-48 w-full rounded-xl overflow-hidden border border-zinc-800">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- STEP 2: TICKET DETAILS --- */}
                        {currentStep === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-2">Ticket Setup</h2>
                                    <p className="text-zinc-400">Define your ticket types and pricing.</p>
                                </div>

                                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox" checked={isFree} onChange={handleFreeEventToggle}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                                        </div>
                                        <span className="font-medium text-white">This is a free event</span>
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    {tickets.map((ticket, index) => (
                                        <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group hover:border-yellow-400/30 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    <Ticket size={18} className="text-yellow-400" />
                                                    Ticket Type {index + 1}
                                                </h3>
                                                {tickets.length > 1 && (
                                                    <button
                                                        onClick={() => removeTicket(index)}
                                                        className="text-zinc-500 hover:text-red-500 transition-colors p-2"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-zinc-400 uppercase">Ticket Name</label>
                                                    <input
                                                        type="text"
                                                        value={ticket.name}
                                                        onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                                                        placeholder="e.g. Regular, VIP"
                                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:ring-1 focus:ring-yellow-400 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-zinc-400 uppercase">Price (₦)</label>
                                                    <input
                                                        type="number"
                                                        value={ticket.price}
                                                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                                                        disabled={isFree}
                                                        placeholder="0.00"
                                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:ring-1 focus:ring-yellow-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-zinc-400 uppercase">Capacity</label>
                                                    <input
                                                        type="number"
                                                        value={ticket.capacity}
                                                        onChange={(e) => handleTicketChange(index, 'capacity', e.target.value)}
                                                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:ring-1 focus:ring-yellow-400 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {!isFree && (
                                        <button
                                            onClick={addTicket}
                                            className="w-full py-4 border border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400/5 transition-all flex items-center justify-center gap-2 font-medium"
                                        >
                                            <Plus size={20} /> Add Another Ticket Type
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- STEP 3: PAYOUT & REVIEW --- */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-2">Finalize</h2>
                                    <p className="text-zinc-400">Set up payouts and launch your event.</p>
                                </div>

                                {!isFree ? (
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                                        <div className="flex items-center gap-3 text-yellow-400 mb-2">
                                            <CreditCard size={24} />
                                            <h3 className="text-xl font-bold">Payout Details</h3>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            Where should we send your ticket sales earnings?
                                        </p>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">Bank Name</label>
                                                <select
                                                    name="bank" value={eventDetails.bank} onChange={handleChange}
                                                    className="w-full bg-black border border-zinc-700 rounded-lg p-4 focus:ring-1 focus:ring-yellow-400 outline-none"
                                                >
                                                    <option value="">Select Bank</option>
                                                    {bankList.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">Account Number</label>
                                                <input
                                                    type="text" name="account_number" value={eventDetails.account_number} onChange={handleChange}
                                                    placeholder="0123456789" maxLength={10}
                                                    className="w-full bg-black border border-zinc-700 rounded-lg p-4 focus:ring-1 focus:ring-yellow-400 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">Account Name</label>
                                                <input
                                                    type="text" name="account_name" value={eventDetails.account_name} onChange={handleChange}
                                                    placeholder="Account Holder Name"
                                                    className="w-full bg-black border border-zinc-700 rounded-lg p-4 focus:ring-1 focus:ring-yellow-400 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={32} className="text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Free Event</h3>
                                        <p className="text-zinc-400">
                                            No payout details required. You're ready to launch!
                                        </p>
                                    </div>
                                )}

                                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                                    <h3 className="font-bold text-white mb-4">Summary</h3>
                                    <div className="space-y-2 text-sm text-zinc-400">
                                        <div className="flex justify-between">
                                            <span>Event</span>
                                            <span className="text-white">{eventDetails.eventName || 'Untitled'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date</span>
                                            <span className="text-white">{eventDetails.date || 'Not set'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tickets</span>
                                            <span className="text-white">{tickets.length} types</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- FEEDBACK ALERT --- */}
                        {feedback && <Alert message={feedback.message} type={feedback.type} />}

                        {/* --- NAVIGATION BUTTONS --- */}
                        <div className="flex items-center gap-4 pt-4">
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="flex-1 py-4 rounded-xl border border-zinc-700 font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft size={20} /> Back
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex-1 bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                                >
                                    Next Step <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Launching..." : "Launch Event"}
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPage;
