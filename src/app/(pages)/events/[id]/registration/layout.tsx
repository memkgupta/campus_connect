"use client"
import { BACKEND_URL_V2 } from '@/constants';
import { EventRegistrationContextProvider, useEventRegistration } from '@/context/event_registration/EventRegistrationContext'
import { useEventContext } from '@/context/EventContext';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { ReactNode,useEffect } from 'react'
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
const EventRegistrationLayout = ({children}:{children:ReactNode}) => {
  const router = useRouter()
      const eventContext = useEventContext();
      const eventRegistrationContext = useEventRegistration()
      if(!eventContext || !eventContext.data)
      {
        router.back()
        return;
      }

   const fetchRegistrationDetails = async()=>{
  try{
  const registrationId = eventContext.data?.registered
  if(registrationId == null){
    return Promise.reject("Registration id is null");
  }

   if(
registrationId
   )
  {
    const req = await axios.get(`${BACKEND_URL_V2}/events/registrations/status`,{
      params:{
        regId:registrationId
      },
      headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }
    })
    eventRegistrationContext.setData({
      ...eventRegistrationContext.data,registrationDetails:req.data.registration
    });
    return req.data.registration
  }

  }
  catch(error:any)
  {
    const aError = error as AxiosError<any>
    const message = aError.response?.data.message || "Some error occured";
    toast({
        title:message,
        variant:"destructive"
      })
  }
 }
 const {data,isFetching} = useQuery({
  queryKey:[eventContext.data.registered],
  queryFn:fetchRegistrationDetails,
  refetchOnWindowFocus:false,
  retry:false
 })
  return (
   
<>
{isFetching ? <Loader/>:children}
</>
        

  )
}

export default EventRegistrationLayout