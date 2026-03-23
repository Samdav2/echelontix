// src/app/design/page.tsx

import TicketCard from '../../component/TicketCard'; // <-- fixed path

export default function Page() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <TicketCard
        eventName="Echelontix Live"
        eventTime="8:00 PM"
        price="50"
        ticketType="VIP"
        attendeeName="Fredrick Mason"
        venue="The Grand Arena"
        ticketId="ECH123456789"
        seatInfo={{
          type: 'VIP',
          gate: 'A',
          row: '5',
          seat: '12'
        }}
      />
    </main>
  
  );
};

