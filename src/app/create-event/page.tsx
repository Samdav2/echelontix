'use client';

import React, { useState, ChangeEvent } from "react";

const CreateEventPage: React.FC = () => {
  const [tableEntries, setTableEntries] = useState<{ label: string; price: number }[]>([]);

  const addTableEntry = () => {
    setTableEntries([...tableEntries, { label: "", price: 0 }]);
  };

  const updateTableEntry = (index: number, field: "label" | "price", value: string | number) => {
    const updated = [...tableEntries];
    updated[index] = {
      ...updated[index],
      [field]: field === "price" ? Number(value) : String(value),
    };
    setTableEntries(updated);
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-4 md:p-10"
      style={{ backgroundImage: "url('/party.jpeg')" }}
    >
      <div className="max-w-2xl mx-auto bg-black bg-opacity-85 p-6 rounded-lg border border-yellow-400 shadow-lg">
        <h2 className="text-center text-yellow-400 text-2xl font-bold mb-6">Create Event</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Brand Name"
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Event Name"
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="date"
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <div>
            <label className="text-sm mb-1 block">Time-in</label>
            <input
              type="time"
              required
              className="w-full p-3 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="text-sm mb-1 block">Time-out</label>
            <input
              type="time"
              required
              className="w-full p-3 rounded bg-gray-800 text-white"
            />
          </div>
          <input
            type="text"
            placeholder="Event Location"
            required
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <textarea
            rows={3}
            placeholder="Event Summary"
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Category / Organizer"
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <h3 className="text-yellow-400 text-lg font-semibold mt-6">Ticket Prices</h3>
          <input
            type="number"
            placeholder="Regular Price (₦)"
            min="0"
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="number"
            placeholder="VIP Price (₦)"
            min="0"
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <div className="mt-6">
            <h4 className="text-yellow-400 font-semibold mb-2">Table Options</h4>
            <small className="text-xs text-gray-400 block mb-2">Add labeled table options with prices</small>
            <button
              type="button"
              onClick={addTableEntry}
              className="mb-4 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1 rounded"
            >
              + Add Table
            </button>

            {tableEntries.map((entry, index) => (
              <div key={index} className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={`Label (e.g., Table for 5)`}
                  value={entry.label}
                  onChange={(e) => updateTableEntry(index, "label", e.target.value)}
                  className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
                />
                <input
                  type="number"
                  placeholder="Price (₦)"
                  
                  onChange={(e) => updateTableEntry(index, "price", e.target.value)}
                  min="0"
                  className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            ))}
          </div>

          {/*Add Bank*/}
          <div className="mt-8">
            <h4 className="text-yellow-400 font-semibold mb-2">Payout Account Details</h4>
            <small className="text-xs text-gray-400 block mb-2">
             These details will be used to send your earnings after the event.
           </small>

           <input
             type="text"
             placeholder="Account Name"
             required
             className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
            />

            <input
              type="text"
              placeholder="Account Number"
              required
              pattern="\d{10}"
              title="Enter a valid 10-digit account number"
              className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
            />

            <select
              required
               className="w-full mb-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
              >
              <option value="">Select Bank</option>
              <option value="access">Access Bank</option>
              <option value="fidelity">Fidelity Bank</option>
              <option value="fcmb">FCMB</option>
              <option value="gtbank">GTBank</option>
              <option value="firstbank">First Bank</option>
              <option value="kuda">Kuda</option>
              <option value="moniepoint">Moniepoint</option>
              <option value="opay">Opay</option>
              <option value="uba">UBA</option>
              <option value="wema">Wema Bank</option>
              <option value="zenith">Zenith Bank</option>
             {/* Add or remove banks as needed */}
           </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-2">Upload Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-white file:bg-blue-500 text-black-500 file:text-black file:rounded file:px-3 file:py-2 file:border-0 bg-gray-800 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event Preview"
                className="mt-3 rounded-lg border border-gray-600 max-h-64 object-cover w-full"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
