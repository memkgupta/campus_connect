"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Event {
  _id: string;
  name: string;
  dateTime: string;
  location: string;
  category: string;
}

interface EventsListProps {
  registeredEvents: Event[];
  upcomingEvents: Event[];
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
      <h3 className="font-semibold text-yellow-500">{event.name}</h3>
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Calendar className="w-4 h-4" />
        {format(new Date(event.dateTime), "PPp")}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <MapPin className="w-4 h-4" />
        {event.location}
      </div>
      <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500">
        {event.category}
      </span>
    </div>
  );
}

export default function EventsList({ registeredEvents, upcomingEvents }: EventsListProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-yellow-500">Registered Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {registeredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-yellow-500">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}