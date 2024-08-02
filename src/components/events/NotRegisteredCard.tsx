import Link from 'next/link';
import React from 'react';

interface NotRegisteredCardProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventId: string;
}

const NotRegisteredCard: React.FC<NotRegisteredCardProps> = ({
  eventName,
  eventDate,
  eventLocation,
  eventDescription,
  eventId,
}) => {
  return (
    <div className="max-w-sm w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{eventName}</h2>
        <p className="text-gray-600 mb-1">
          <strong>Date:</strong> {eventDate}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Location:</strong> {eventLocation}
        </p>
        <p className="text-gray-700 mb-4">{eventDescription}</p>

        <div className="flex items-center justify-between">
          <p className="font-semibold text-red-500">Not Registered</p>
          <Link
            href={`/events/${eventId}`}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotRegisteredCard;
