"use client"
import EventCard, { dateToString } from '@/components/events/EventCard';
import NotRegisteredCard from '@/components/events/NotRegisteredCard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'


const Page = ({params}:{params:{id:string}}) => {
  const [registrationData,setRegistrationData] = useState<any>(null);
    const {id} = params;
    const {toast} = useToast(); 
    const [loading,setLoading] = useState(true);
    const fetchRegistrationData = async()=>{
    try {
      const res = await axios.get(`/api/events/get-my-registration/${id}`);
      const data = res.data;
      setLoading(false)
      setRegistrationData(data.registration);
      return data.registration;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      let message = "Some error occured"
      if(axiosError.response?.data){
        message = axiosError.response.data.message
      }
      toast({
title:message,
variant:"destructive"
      })
      return Promise.reject(message)
    }
    finally{
      setLoading(false);
    }
    }
   
    const [isSubmitting,setIsSubmitting] = useState(false);
    const handleRsvp = async()=>{
      try {
        setIsSubmitting(true);
        const data = {registration_id:registrationData._id}
        const res = await axios.post(`/api/events/rsvp`,data);
        toast({
          title:"RSVP'd Successfully see you at the event"
        });
        setRegistrationData({...registrationData,rsvp:[true]})
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        let message = "Some error occured"
        if(axiosError.response?.data){
          message = axiosError.response.data.message
        }
        toast({
  title:message,
  variant:"destructive"
        })
     
      }
      finally{
        setIsSubmitting(false);
      }
    }
const {data:rdata} = useQuery<any>({
  queryKey:[id],
  queryFn:fetchRegistrationData
})
  
  return (

    <>
    {loading?
    (<Loader/>)
  :(
    <>
    {registrationData?(
      <>
      <EventCard data={registrationData.event[0]}/>
       <div className=''>
        <p>Status {registrationData.status}</p>
        <div>{
          registrationData.rsvp[0] ? (<p>You have  RSVP'd see you at the event</p>):
          (registrationData.status=="accepted" && (<Button onClick={handleRsvp} disabled={isSubmitting} >{isSubmitting?(<p>Please wait <Loader2 className='animate-spin'></Loader2></p>):("RSVP now")}</Button>))
          }</div>
       </div>
    </>):(
      <NotRegisteredCard 
      eventName={registrationData.event[0].name}
        eventDate={dateToString(new Date(registrationData.event[0].dateTime))}
        eventLocation={registrationData.event[0].location}
        eventDescription={registrationData.event[0].description}
        eventId={id}/>
    
    )}
    </>
  )}
    </>
  )
}

export default Page