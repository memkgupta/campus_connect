"use client";
//@ts-ignore
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
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BACKEND_URL } from "@/constants";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import Cookies from "js-cookie";
import EventDetails from "@/components/events/event-page";

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const { isAuthenticated } = useSession();
  const [data, setData] = useState<any>();
  const { toast } = useToast();
  const { id } = params;

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/events/${id}`);
      const reqData = res.data;
      setData(reqData.data);
      setIsRegistered(reqData.registered!=null)
      return reqData.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast({
        title: axiosError.response?.data.message || "Some error occurred",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const fetchRegistrationStatus = async () => {
    if (isAuthenticated) {
      try {
        const res = await axios.get(`${BACKEND_URL}/events/registration/is-registered`, {
          params: { eid: id },
          headers: {
            Authorization: `Bearer ${Cookies.get("access-token")}`,
          },
        });
        return res.data.registration;
      } catch (error) {
        toast({
          title: "Some error occurred",
          variant: "destructive",
        });
        return { status: "not-registered", rid: null };
      }
    }
  };

  const registerNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/events/register`,
        { event_id: id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access-token")}`,
          },
        }
      );
      router.push(`/events/register?rid=${res.data.id}`);
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data.message || "Some error occurred";
      toast({ title: message, variant: "destructive" });
    }
  };

  const { data: _data, isSuccess, isFetching } = useQuery({
    queryKey: [id],
    queryFn: fetchEvent,
    refetchOnWindowFocus: false,
    retry: (count, error) => {
      const axiosError = error as AxiosError<any>;
      return !(axiosError?.status === 500 || axiosError?.status === 401 || axiosError?.status === 404 || count > 3);
    },
  });

 

 

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : (
    <EventDetails registered={isRegistered}  event={_data}/>
      )}
    </>
  );
};

export default Page;
