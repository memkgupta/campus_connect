"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, MapPin, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Cookies from "js-cookie";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { BACKEND_URL_V2 } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { format } from "date-fns";

type EventRegistration = {
  _id: string;
  event: {
    _id: string;
    basicDetails: {
      title: string;
      description: string;
      participantsFromOutsideAllowed: boolean;
      venue: string;
      startDate: string;
      endDate: string;
      isOnline: boolean;
      isTeamEvent: boolean;
      category: string;
      isFree: boolean;
      maxParticipants: number;
      registrationDeadline: string;
      multipleRounds: boolean;
    };
  };
  status: "completed" | "pending" | "cancelled";
  email: string;
  name: string;
};

export default function EventsPage() {
  const token = Cookies.get("access-token");
  const { toast } = useToast();
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    page: 1,
  });
  const debounced = useDebounceCallback(setFilters, 500);
  const handleFilterChange = (name: string, value: string) => {
    debounced((prev) => ({ ...prev, [name]: value }));
  };
  const handlePageChange = ({
    pageNumber,
    totalResults,
  }: {
    pageNumber: number;
    totalResults: number;
  }) => {
    debounced({ ...filters, page: pageNumber });
  };

  const fetchMyRegistration = async () => {
    try {
      const req = await axios.get(
        `${BACKEND_URL_V2}/events/registrations/my-registrations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filters,
        }
      );
      setTotal(req.data.total || 0);
      return req.data.registrations as EventRegistration[];
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message =
        axiosError.response?.data.message || "Some error occurred";
      toast({
        title: message,
        variant: "destructive",
      });
    }
  };

  const {
    data: registrations = [],
    isFetching,
  } = useQuery({
    queryKey: [{ ...filters }],
    queryFn: fetchMyRegistration,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
            <p className="text-slate-400">
              Manage your event registrations and tickets
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-slate-800 w-full md:w-auto">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 grid gap-4">
              {registrations.map((reg) => (
                <EventCard key={reg._id} registration={reg} />
              ))}
            </TabsContent>

            {["pending", "completed", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4 grid gap-4">
                {registrations
                  .filter((r) => r.status === tab)
                  .map((reg) => (
                    <EventCard key={reg._id} registration={reg} />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
}

function EventCard({ registration }: { registration: EventRegistration }) {
  const { event, status, name, email } = registration;
  const details = event.basicDetails;
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{details.title}</h3>
            
          </div>
          <Badge
            variant={
              status === "pending"
                ? "secondary"
                : status === "completed"
                ? "default"
                : "destructive"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarClock size={18} />
            <span>
              {format(new Date(details.startDate), "PPP")} →{" "}
              {format(new Date(details.endDate), "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>{details.venue || "Online"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{registration.name || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{registration.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
