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
import { useEventContext } from "@/context/EventContext";

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();


  const { toast } = useToast();
  const { id } = params;
  const {data,setData} = useEventContext()
  // const {isAuthenticated} = useSession()


 

 

  return (
    <>
  
    <EventDetails registered={data?.registered||"null"}  event={data}/>
      
    </>
  );
};

export default Page;
