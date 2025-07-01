'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- Helper Components ---
const Alert: React.FC<{ message: string; type: 'success' | 'error' }> = ({ message, type }) => {
    if (!message) return null;
    const alertClasses = type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    return (
        <div className={`p-4 rounded-md text-center font-medium ${alertClasses}`}>
            {message}
        </div>
    );
};

// --- Type Definitions ---
interface EventDetails {
    brand_name: string;
    eventName: string;
    date: string;
    timeIn: string;
    timeOut: string;
    eventAddress: string;
    summary: string;
    picture: File | null;
    vip: string;
    vvip: string;
    price: string;
    category: string;
    account_name: string;
    account_number: string;
    bank: string;
    vvvip_price: string;
    table_price: string;
}

// --- Bank List Constant ---
const bankList = [
    '9MOBILE 9PAYMENT SERVICE BANK', 'ABBEY MORTGAGE BANK', 'ABOVE ONLY MFB', 'ABULESORO MFB', 'ACCESS BANK',
    'ACCESS BANK (DIAMOND)', 'AIRTEL SMARTCASH PSB', 'ALAT BY WEMA', 'AMJU UNIQUE MFB', 'ARAMOKO MFB',
    'ASO SAVINGS AND LOANS', 'ASTRAPOLARIS MFB LTD', 'BAINESCREDIT MFB', 'BOWEN MICROFINANCE BANK', 'CARBON',
    'CEMCS MICROFINANCE BANK', 'CHANELLE MICROFINANCE BANK LIMITED', 'CITIBANK NIGERIA', 'CORESTEP MFB',
    'CORONATION MERCHANT BANK', 'CRESCENT MFB', 'ECOBANK NIGERIA', 'EKIMOGUN MFB', 'EKONDO MICROFINANCE BANK',
    'EYOWO', 'FIDELITY BANK', 'FIRMUS MFB', 'FIRST BANK OF NIGERIA', 'FIRST CITY MONUMENT BANK',
    'FSDH MERCHANT BANK LIMITED', 'GATEWAY MORTGAGE BANK LTD', 'GLOBUS BANK', 'GOMONEY', 'GUARANTY TRUST BANK',
    'HACKMAN MICROFINANCE BANK', 'HASAL MICROFINANCE BANK', 'HERITAGE BANK', 'HOPEPSB', 'IBILE MICROFINANCE BANK',
    'IKOYI OSUN MFB', 'INFINITY MFB', 'JAIZ BANK', 'KADPOLY MFB', 'KEYSTONE BANK', 'KREDI MONEY MFB LTD',
    'KUDA BANK', 'LAGOS BUILDING INVESTMENT COMPANY PLC.', 'LINKS MFB', 'LIVING TRUST MORTGAGE BANK',
    'LOTUS BANK', 'MAYFAIR MFB', 'MINT MFB', 'MTN MOMO PSB', 'OPAY', 'PAGA', 'PALMPAY', 'PARALLEX BANK',
    'PARKWAY - READYCASH', 'PAYCOM', 'PETRA MIRCOFINANCE BANK PLC', 'POLARIS BANK', 'POLYUNWANA MFB',
    'PREMIUMTRUST BANK', 'PROVIDUS BANK', 'QUICKFUND MFB', 'RAND MERCHANT BANK', 'REFUGE MORTGAGE BANK',
    'RUBIES MFB', 'SAFE HAVEN MFB', 'SOLID ROCK MFB', 'SPARKLE MICROFINANCE BANK', 'STANBIC IBTC BANK',
    'STANDARD CHARTERED BANK', 'STELLAS MFB', 'STERLING BANK', 'SUNTUST BANK', 'TAJ BANK', 'TANGERINE MONEY',
    'TCF MFB', 'TITAN BANK', 'TITAN PAYSTACK', 'UNICAL MFB', 'UNION BANK OF NIGERIA', 'UNITED BANK FOR AFRICA',
    'UNITY BANK', 'VFD MICROFINANCE BANK LIMITED', 'WEMA BANK', 'ZENITH BANK'
];


// --- Main Page Component ---
const CreateEventPage: React.FC = () => {
    const router = useRouter();
    const [isFree, setIsFree] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [eventDetails, setEventDetails] = useState<EventDetails>({
        brand_name: "",
        eventName: "",
        date: "",
        timeIn: "",
        timeOut: "",
        eventAddress: "",
        summary: "",
        picture: null,
        vip: "0",
        vvip: "0",
        price: "0",
        category: "",
        account_name: "",
        account_number: "",
        bank: "",
        vvvip_price: "0",
        table_price: "0"
    });

    // Fetch creator's brand name from localStorage on component mount
    useEffect(() => {
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
            if (file.size > 5 * 1024 * 1024) { // 5MB size limit
                setFeedback({ message: 'File size exceeds 5MB. Please choose a smaller file.', type: 'error' });
                return;
            }
            setEventDetails(prev => ({ ...prev, picture: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFreeEventToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setIsFree(isChecked);
        if (isChecked) {
            // Reset all price fields if event is marked as free
            setEventDetails(prev => ({
                ...prev,
                price: "0",
                vip: "0",
                vvip: "0",
                vvvip_price: "0",
                table_price: "0"
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        const formDataToSend = new FormData();
        // Append all event details to the FormData object
        Object.entries(eventDetails).forEach(([key, value]) => {
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        try {
            const createEventUrl = process.env.NEXT_PUBLIC_API_URL!;
            const response = await axios.post(`${createEventUrl}event/event`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setFeedback({ message: "Event created successfully! Redirecting...", type: 'success' });
            setTimeout(() => {
                router.push('/dashboard/creator'); // Or a success page
            }, 2000);

        } catch (error) {
            console.error("Unable to create event", error);
            const errorMessage = (error as any).response?.data?.message || "Failed to create event. Please try again.";
            setFeedback({ message: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center text-white p-4 md:p-10" style={{ backgroundImage: "url('/party.jpeg')" }}>
            <div className="max-w-2xl mx-auto bg-black bg-opacity-85 p-6 rounded-lg border border-yellow-400 shadow-lg">
                <h2 className="text-center text-yellow-400 text-2xl font-bold mb-6">Create New Event</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Event Details */}
                    <input type="text" name="eventName" value={eventDetails.eventName} onChange={handleChange} placeholder="Event Name" required className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                    <input type="date" name="date" value={eventDetails.date} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm mb-1 block">Time-in</label><input type="time" name="timeIn" value={eventDetails.timeIn} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 text-white" /></div>
                        <div><label className="text-sm mb-1 block">Time-out</label><input type="time" name="timeOut" value={eventDetails.timeOut} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 text-white" /></div>
                    </div>
                    <input type="text" name="eventAddress" value={eventDetails.eventAddress} onChange={handleChange} placeholder="Event Location" required className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                    <textarea name="summary" value={eventDetails.summary} onChange={handleChange} rows={3} placeholder="Event Summary (max 300 chars)" maxLength={300} className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                    <select name="category" value={eventDetails.category} onChange={handleChange} required className="w-full p-3 rounded bg-gray-800 text-white">
                        <option value="">Select Category</option>
                        <option value="Music">Music</option><option value="Sports">Sports</option><option value="Tech">Tech</option><option value="Art">Art</option><option value="Other">Other</option>
                    </select>

                    {/* Pricing Section */}
                    <div className="border-t border-gray-700 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isFree} onChange={handleFreeEventToggle} className="form-checkbox accent-yellow-400 h-5 w-5 bg-gray-700 border-gray-600" /><span>Mark this event as FREE</span></label>
                    </div>

                    {!isFree && (
                        <div className="space-y-4 pt-2">
                             <h3 className="text-yellow-400 text-lg font-semibold">Ticket Prices</h3>
                             <input type="number" name="price" value={eventDetails.price} onChange={handleChange} placeholder="Regular Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <input type="number" name="vip" value={eventDetails.vip} onChange={handleChange} placeholder="VIP Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <input type="number" name="vvip" value={eventDetails.vvip} onChange={handleChange} placeholder="VVIP Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <input type="number" name="vvvip_price" value={eventDetails.vvvip_price} onChange={handleChange} placeholder="VVVIP Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <input type="number" name="table_price" value={eventDetails.table_price} onChange={handleChange} placeholder="Table Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                        </div>
                    )}

                    {/* Payout Details */}
                    <div className="pt-4 border-t border-gray-700">
                        <h4 className="text-yellow-400 font-semibold mb-2">Payout Account Details</h4>
                        <small className="text-xs text-gray-400 block mb-2">Earnings will be sent here after the event.</small>
                        <input type="text" name="account_name" value={eventDetails.account_name} onChange={handleChange} placeholder="Account Name" required className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                        <input type="text" name="account_number" value={eventDetails.account_number} onChange={handleChange} placeholder="Account Number" required pattern="\d{10}" title="Enter a valid 10-digit account number" className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                        <select name="bank" value={eventDetails.bank} onChange={handleChange} required className="w-full mb-3 p-3 rounded bg-gray-800 text-white">
                            <option value="">Select Bank</option>
                            {bankList.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-yellow-400 mb-2">Upload Event Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-white file:bg-yellow-400 file:text-black file:font-semibold file:rounded file:px-3 file:py-2 file:border-0 bg-gray-800 rounded" />
                        {imagePreview && <img src={imagePreview} alt="Event Preview" className="mt-3 rounded-lg border border-gray-600 max-h-64 object-cover w-full" />}
                    </div>

                    {feedback && <Alert message={feedback.message} type={feedback.type} />}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {isSubmitting ? "Creating Event..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;
