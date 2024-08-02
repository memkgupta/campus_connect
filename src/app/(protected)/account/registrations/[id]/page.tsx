import EventCard from '@/components/events/EventCard';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'


const Page = ({params}:{params:{id:string}}) => {
    const {id} = params;
    const {toast} = useToast(); 
    const [loading,setLoading] = useState(true);
    const fetchRegistrationData = async()=>{
    try {
      const res = await axios.get(`/api/${id}/get-my-registration`);
      const data = res.data;
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
    }
const {data:registrationData} = useQuery<any>({
  queryKey:[id],
  queryFn:fetchRegistrationData
})
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <EventCard data={registrationData.event}/>
    
  </div>
  )
}

export default Page