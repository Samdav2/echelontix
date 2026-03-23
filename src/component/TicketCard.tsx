'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface TicketProps {
  eventName: string;
  eventTime: string;
  price: string;
  ticketType: string;
  attendeeName: string;
  venue: string;
  ticketId: string;
  seatInfo: {
    type: string;
    gate: string;
    row: string;
    seat: string;
  };
}

const TicketCard: React.FC<TicketProps> = ({ eventName, eventTime, price, seatInfo }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${eventName}_Ticket.pdf`);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div
        ref={ticketRef}
        className="flex w-full max-w-3xl h-64 rounded-lg shadow-lg overflow-hidden "
      >
        {/* Left Colored Side */}
        <div className="relative w-2/3 bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-400 text-black px-4 py-4 flex flex-col justify-between border-r-2 border-dashed border-black">
          {/* Inner border wrapper */}
          <div className="relative w-full h-full border border-black rounded-md p-4">
            {/* Top section: Logo and Event Time aligned */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/capo.svg"
                  alt="logo"
                  width={40}
                  height={40}
                  className="object-contain border border-black rounded-full"
                />
                <div className="text-lg font-bold">Echelontix</div>
              </div>
              <div className="bg-yellow-100 border border-black text-black text-xs px-3 py-1 rounded-md">
                Saturday, {eventTime}
              </div>
            </div>

            {/* Ticket Label - center */}
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-1xl font-extrabold text-center border border-black px-4 py-1">
                {seatInfo.type.toUpperCase()} TICKET
              </h1>
            </div>

            {/* Price */}
            <div className="mx-auto w-fit pt-6">
              <div className="bg-white px-4 py-2 rounded-full shadow font-bold text-lg border border-yellow-700">
                Price ${price}
              </div>
            </div>

            {/* QR Code vertical under logo */}
            <div className="max-auto absolute left-2 bottom-14">
              <Image
                src="/assets/barcode2.png"
                alt="barcode"
                width={120}
                height={70}
                className="object-contain rotate-90"
              />
            </div>
          </div>
        </div>

        {/* Right White Side */}
        <div className="w-1/3 bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-700">Event Name</h2>
            <h2 className="text-xl font-bold text-black leading-tight">{eventName}</h2>
          </div>

          <div className="text-sm mt-2 text-black">
            <p>Type: {seatInfo.type}</p>
            <p>Gate: {seatInfo.gate}</p>
            <p>Row: {seatInfo.row}</p>
            <p>Seat: {seatInfo.seat}</p>
          </div>

          <div className="mt-auto">
            <Image
              src="/assets/barcode.png"
              alt="barcode"
              width={120}
              height={70}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
      >
        Download Ticket
      </button>
    </div>
  );
};

export default TicketCard;
