// MonetaryDetailsSection.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

const MonetaryDetailsSection = ({ monetaryDetails }: { monetaryDetails: any }) => {
  const { ticketDetails, prizes, sponsors } = monetaryDetails || {};

  return (
    <div className="bg-[#111] text-white p-6 space-y-6 rounded-md border border-[#333]">
      {ticketDetails?.tickets?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Tickets</h2>
          <p className="text-sm text-gray-300 mb-4">{ticketDetails.description}</p>
          <ul className="space-y-2">
            {ticketDetails.tickets.map((ticket: any, idx: number) => (
              <li key={idx} className="border border-gray-700 p-3 rounded-md bg-[#1a1a1a]">
                <div className="font-semibold text-white">{ticket.title} - ₹{ticket.price}</div>
                <p className="text-sm text-gray-400">{ticket.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {prizes?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Prizes</h2>
          <ul className="space-y-2">
            {prizes.map((prize: any, idx: number) => (
              <li key={idx} className="bg-[#1a1a1a] p-3 rounded-md border border-gray-700">
                <div className="font-semibold text-white">{prize.title}</div>
                <p className="text-sm text-gray-400">{prize.description}</p>
                <Badge className="mt-1">{prize.type}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sponsors?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Sponsors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sponsors.map((sponsor: any, idx: number) => (
              <div key={idx} className="bg-[#1a1a1a] p-3 rounded-md border border-gray-700">
                <img src={sponsor.logo} alt={sponsor.name} className="h-20 w-full object-contain mb-2" />
                <div className="font-semibold text-white">{sponsor.name}</div>
                <p className="text-sm text-gray-400">{sponsor.description}</p>
                <Badge className="mt-1">{sponsor.level}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonetaryDetailsSection;
