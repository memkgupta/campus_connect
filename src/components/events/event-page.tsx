import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import CustomImage from "../ui/image";

interface EventProps {
  event: any;
  registered:any // Ideally define a full interface from schema
}

const EventDetails: React.FC<EventProps> = ({ registered,event }) => {
  return (
    <div className="bg-slate-950 text-white min-h-screen p-6 space-y-6">
      <div className="flex flex-col md:flex-row lg:flex-row lg:items-start lg:gap-6">
       <div className="grid gap-1">
       {event.banner&& <CustomImage className="w-full" src={event.banner}></CustomImage>}
       <div className="flex-1 md:max-w-3xl">
          <Card className="bg-[#030311] border border-[#333]">
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">{event.basicDetails.title}</div>
              <p className="text-sm text-gray-400 break-words whitespace-pre-wrap">{event.basicDetails.description}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>{event.type}</Badge>
                {event.basicDetails.isOnline && <Badge variant="secondary">Online</Badge>}
                {event.basicDetails.isTeamEvent && <Badge variant="secondary">Team Event</Badge>}
                {event.basicDetails.isFree ? <Badge variant="outline">Free</Badge> : <Badge variant="destructive">Paid</Badge>}
                <Badge variant="secondary">{event.basicDetails.category}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-gray-400">Start:</span> {new Date(event.basicDetails.startDate).toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-400">End:</span> {new Date(event.basicDetails.endDate).toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-400">Venue:</span> {event.basicDetails.venue}
                </div>
                <div>
                  <span className="text-gray-400">Max Participants:</span> {event.basicDetails.maxParticipants ?? "Unlimited"}
                </div>
                <div>
                  <span className="text-gray-400">Registration Deadline:</span> {new Date(event.basicDetails.registrationDeadline).toLocaleDateString()}
                </div>
              </div>

              {/* Tickets */}
              {event.monetaryDetails?.ticketDetails?.tickets?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mt-6">Tickets</h3>
                  <ul className="space-y-2 mt-2">
                    {event.monetaryDetails.ticketDetails.tickets.map((ticket: any, idx: number) => (
                      <li key={idx} className="border border-gray-600 p-2 rounded-md">
                        <div className="font-medium">{ticket.title} - ₹{ticket.price}</div>
                        <p className="text-sm text-gray-400">{ticket.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Guests, Speakers, Mentors, Judges */}
              {["guests", "speakers", "mentors", "judges"].map((role) => (
                event.eventStructure?.[role]?.length > 0 && (
                  <div key={role}>
                    <h3 className="text-lg font-semibold mt-6">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                      {event.eventStructure[role].map((person: any, idx: number) => (
                        <div key={idx} className="bg-[#222] rounded-xl overflow-hidden shadow-md p-3">
                          <img src={person.image} alt={person.name} className="h-32 w-full object-cover rounded-md mb-2" />
                          <div className="font-medium">{person.name}</div>
                          <p className="text-xs text-gray-400">{person.about}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        </div>
       </div>

        {/* Registration Card - Positioned side on large screens, bottom on small */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <Card className="bg-slate-950 border border-[#444]">
            <CardContent className="p-4 space-y-3">
              <div className="text-lg font-semibold">Register for this Event</div>
              <div className="text-sm text-gray-400">
                Registration closes on: {new Date(event.basicDetails.registrationDeadline).toLocaleString()}
              </div>
              {!registered?<Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                Register Now
              </Button>:<Link href={`/account/registrations/${registered._id}`} className="bg-green-600 hover:bg-green-700 text-white w-full p-1 text-center">Registered</Link>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
