"use client";
import Loader from "@/components/Loader";

import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  BuildingIcon,
  FlagIcon,
  UserPlusIcon,
  ClipboardIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BACKEND_URL } from "@/constants";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import Cookies from "js-cookie";

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  // const [isLoading,setIsLoading]=useState(true)
  const [isRegistered, setIsRegistered] = useState(null);
  const { isAuthenticated } = useSession();
  const [data, setData] = useState<any>();
  const { toast } = useToast();
  const { id } = params;
  const fetchEvent = async () => {
    try {
      // setIsLoading(true)
      const res = await axios.get(`${BACKEND_URL}/events/${id}`);
      const reqData = res.data;
      setData(reqData.data);
      setIsRegistered(data.registered);
      return reqData.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        if (axiosError.status !== 500) {
          toast({
            title: axiosError.response.data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Some error occured",
            variant: "destructive",
          });
        }
      }

      return Promise.reject(error);
    }
  };
  const fetchRegistrationStatus = async () => {
    if (isAuthenticated) {
      try {
        const res = await axios.get(`${BACKEND_URL}/events/registration/is-registered`, {
          params: {
            eid: id,
          },
          headers: {
            Authorization: `Bearer ${Cookies.get("access-token")}`,
          },
        });
        return res.data.registration;
      } catch (error) {
        toast({
          title: "Some error occured",
          variant: "destructive",
        });
        return { status: "not-registered", rid: null };
      }
    }
  };
  const registerNow = async()=>{
    if(!isAuthenticated){
      toast({
        title:"Please sign in ",
        color:"#FFFF00"
      })
      return ;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/events/register`,{event_id:id},{
        headers:{
          Authorization:`Bearer ${Cookies.get('access-token')}`
        }
      });
      router.push(`/events/register?rid=${res.data.id}`)
    } catch (error) {
      const axiosError = error as AxiosError<any>
      const message = axiosError.response?.data.message || "Some error occured"
      toast({
        title:message,
        variant:"destructive"
      })
    }
  }
  const {
    data: _data,
    isSuccess,
    isFetching,
  } = useQuery<any>({
    queryKey: [id],
    queryFn: fetchEvent,
    refetchOnWindowFocus: false,
    retry: (count, error) => {
      const axiosError = error as AxiosError<any>;
      if (
        axiosError.status === 500 ||
        axiosError.status === 401 ||
        axiosError.status === 404
      ) {
        return false;
      }
      if (count > 3) {
        return false;
      } else {
        return true;
      }
    },
  });
  const { data: registrationStatus, isLoading: loadingRegistrationStatus } =
    useQuery({
      queryKey: [id, "event-registration"],
      queryFn: fetchRegistrationStatus,
      retry: false,
      refetchOnWindowFocus: false,
      enabled:!!_data
    });
  //    useEffect(()=>{},[id])
  return (
    <>
      {isFetching ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="relative w-full h-64 mb-6">
            <Image
              src={_data.banner}
              alt={data.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{data.name}</h1>

              <div className="space-x-2">
                {data.isTeamEvent && (
                  <Badge variant="secondary">Team Event</Badge>
                )}
              </div>
            </div>
            <div>
              {!loadingRegistrationStatus &&
                (!registrationStatus || !registrationStatus.rid ? (
                  <Button
                  onClick={registerNow}
                    className="bg-yellow-300 p-2 rounded-md text-black"
                  >
                    Register Now
                  </Button>
                ) : registrationStatus.status == "pending" ? (
                  <Link
                    href={`/events/register?rid=${registrationStatus.rid}`}
                    className="bg-yellow-300 p-2 rounded-md text-black"
                  >
                    Complete Registration
                  </Link>
                ) : (
                  <Link
                    href={`/events/registration/${registrationStatus.rid}`}
                    className="bg-yellow-300 p-2 rounded-md text-black"
                  >
                    View Registration
                  </Link>
                ))}
              {}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(data.dateTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(data.dateTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{data.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FlagIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{data.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Max Capacity: {data.maxCapacity}</span>
                </div>
                {data.participantsFromOutsideAllowed && (
                  <div className="flex items-center space-x-2">
                    <UserPlusIcon className="h-5 w-5 text-muted-foreground" />
                    <span>Open to outside participants</span>
                  </div>
                )}
                {data.isAcceptingVolunteerRegistrations && (
                  <div className="flex items-center space-x-2">
                    <ClipboardIcon className="h-5 w-5 text-muted-foreground" />
                    <span>Accepting volunteer registrations</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data.description}</p>
              </CardContent>
            </Card>

            {data.external_forms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.external_forms.map((form: any, index: number) => (
                      <li key={index}>
                        <a
                          href={form.link}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {form.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
