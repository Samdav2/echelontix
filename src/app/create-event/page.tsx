'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- Helper Components ---
const Alert: React.FC<{ message: string; type: 'success' | 'error' | 'info' }> = ({ message, type }) => {
    if (!message) return null;
    const alertStyles = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
    };
    return (
        <div className={`p-4 rounded-md text-center font-medium ${alertStyles[type]}`}>
            {message}
        </div>
    );
};

// --- Type Definitions ---
interface Table {
    tableName: string;
    tablePrice: string;
    tableCapacity: string;
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
    vip: string;
    vvip: string;
    price: string;
    category: string;
    account_name: string;
    account_number: string;
    bank: string;
    vvvip_price: string;
}

// --- Bank List and Code Mapping Constants ---
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


// --- Main Page Component ---
const CreateEventPage: React.FC = () => {
    const router = useRouter();
    const [isFree, setIsFree] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isClient, setIsClient] = useState(false);

    const [eventDetails, setEventDetails] = useState<EventDetails>({
        brand_name: "", eventName: "", date: "", timeIn: "", timeOut: "", eventAddress: "", summary: "",
        picture: null, vip: "0", vvip: "0", price: "0", category: "", account_name: "",
        account_number: "", bank: "", vvvip_price: "0"
    });

    const [tables, setTables] = useState<Table[]>([]);

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

    const handleFreeEventToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setIsFree(isChecked);
        if (isChecked) {
            setEventDetails(prev => ({ ...prev, price: "0", vip: "0", vvip: "0", vvvip_price: "0" }));
            setTables([]);
        }
    };

    // --- Table Management Functions ---
    const addTable = () => {
        setTables([...tables, { tableName: '', tablePrice: '', tableCapacity: '' }]);
    };

    const removeTable = (index: number) => {
        const newTables = tables.filter((_, i) => i !== index);
        setTables(newTables);
    };

    const handleTableChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newTables = [...tables];
        newTables[index] = { ...newTables[index], [name]: value };
        setTables(newTables);
    };
    // --- End Table Management ---


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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);

        try {
            // Step 1: Handle subaccount setup if the event is not free
            if (!isFree) {
                await handleSubaccountSetup();
            }

            // Step 2: Create the tables via the new, separate API endpoint, if any tables exist
            if (!isFree && tables.length > 0) {
                setFeedback({ message: "Creating event tables...", type: 'info' });
                const tablesPayload = tables.map(table => ({
                    tableName: table.tableName,
                    tablePrice: parseInt(table.tablePrice, 10) || 0,
                    tableCapacity: parseInt(table.tableCapacity, 10) || 0,
                }));

                const tableApiPayload = {
                    event_name: eventDetails.eventName,
                    tables: tablesPayload
                };

                const url = process.env.NEXT_PUBLIC_API_URL
                const createTablesUrl = `${url}event/tableCreation`
                await axios.post(createTablesUrl, tableApiPayload, {
                    headers: { "Content-Type": "application/json" },
                });
            }

            // Step 3: Create the main event
            setFeedback({ message: "Creating your event...", type: 'info' });
            const formDataToSend = new FormData();

            // Append all eventDetails. The 'tables' data is no longer part of this form.
            Object.entries(eventDetails).forEach(([key, value]) => {
                if (value !== null) {
                    formDataToSend.append(key, value);
                }
            });
            const url = process.env.NEXT_PUBLIC_API_URL
            const createEventUrl = `${url}event/event`
            await axios.post(createEventUrl, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Step 4: Final feedback and redirection
            setFeedback({ message: "Event and tables created successfully! Redirecting...", type: 'success' });
            setTimeout(() => router.push('/dashboard/creator'), 2000);

        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || (error as Error).message || "An error occurred during event creation.";
            setFeedback({ message: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isClient) {
        return (
             <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

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
                             <h4 className="text-yellow-400 text-lg font-semibold">Regular</h4>
                             <input type="number" name="price" value={eventDetails.price} onChange={handleChange} placeholder="Regular Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <h4 className="text-yellow-400 text-lg font-semibold">VIP</h4>
                             <input type="number" name="vip" value={eventDetails.vip} onChange={handleChange} placeholder="VIP Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <h4 className="text-yellow-400 text-lg font-semibold">VVIP</h4>
                             <input type="number" name="vvip" value={eventDetails.vvip} onChange={handleChange} placeholder="VVIP Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                             <h4 className="text-yellow-400 text-lg font-semibold">VVVIP</h4>
                             <input type="number" name="vvvip_price" value={eventDetails.vvvip_price} onChange={handleChange} placeholder="VVVIP Price (₦)" min="0" className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400" />

                             {/* --- Dynamic Table Section --- */}
                            <div className="border-t border-gray-700 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-yellow-400 text-lg font-semibold">Table Details</h3>
                                    <button type="button" onClick={addTable} className="bg-yellow-400 text-black font-bold py-1 px-3 rounded hover:bg-yellow-500 transition text-sm">
                                        + Add Table
                                    </button>
                                </div>
                                {tables.map((table, index) => (
                                    <div key={index} className="p-3 bg-gray-900 rounded-md mb-3 border border-gray-700 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-300">Table {index + 1}</p>
                                            <button type="button" onClick={() => removeTable(index)} className="text-red-500 hover:text-red-400 font-bold text-xl">&times;</button>
                                        </div>
                                        <input
                                            type="text"
                                            name="tableName"
                                            value={table.tableName}
                                            onChange={(e) => handleTableChange(index, e)}
                                            placeholder="Table Name (e.g., Gold Table)"
                                            required
                                            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="number"
                                                name="tablePrice"
                                                value={table.tablePrice}
                                                onChange={(e) => handleTableChange(index, e)}
                                                placeholder="Price (₦)"
                                                min="0"
                                                required
                                                className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500"
                                            />
                                            <input
                                                type="number"
                                                name="tableCapacity"
                                                value={table.tableCapacity}
                                                onChange={(e) => handleTableChange(index, e)}
                                                placeholder="Capacity"
                                                min="1"
                                                required
                                                className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                             {/* --- End Dynamic Table Section --- */}
                        </div>
                    )}

                    {/* Payout Details */}
                    {!isFree && (
                        <div className="pt-4 border-t border-gray-700">
                            <h4 className="text-yellow-400 font-semibold mb-2">Payout Account Details</h4>
                            <small className="text-xs text-gray-400 block mb-2">Earnings will be sent here after the event.</small>
                            <input type="text" name="account_name" value={eventDetails.account_name} onChange={handleChange} placeholder="Account Name" required={!isFree} className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                            <input type="text" name="account_number" value={eventDetails.account_number} onChange={handleChange} placeholder="Account Number" required={!isFree} pattern="\d{10}" title="Enter a valid 10-digit account number" className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400" />
                            <select name="bank" value={eventDetails.bank} onChange={handleChange} required={!isFree} className="w-full mb-3 p-3 rounded bg-gray-800 text-white">
                                <option value="">Select Bank</option>
                                {bankList.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-yellow-400 mb-2">Upload Event Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-white file:bg-yellow-400 file:text-black file:font-semibold file:rounded file:px-3 file:py-2 file:border-0 bg-gray-800 rounded" />
                        {imagePreview && <img src={imagePreview} alt="Event Preview" className="mt-3 rounded-lg border border-gray-600 max-h-64 object-cover w-full" />}
                    </div>

                    {feedback && <div className="mt-4"><Alert message={feedback.message} type={feedback.type} /></div>}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                        {isSubmitting ? "Processing..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;
