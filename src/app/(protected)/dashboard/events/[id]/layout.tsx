"use client"
import { useToast } from '@/components/ui/use-toast';
import { BACKEND_URL_V2 } from '@/constants';
import { useEventDashboard } from '@/context/dashboard/useContext';
import axios, { AxiosError } from 'axios';
import React from 'react'
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
const EventDashboardIdLayout = ({params,children}:{params:{id:string},children:React.ReactNode}) => {
    const event_id = params.id;
    const eventContext = useEventDashboard()!
      const {toast} = useToast()
     const fetchEvent = async () => {
         try {
           
           const res = await axios.get(
             `${BACKEND_URL_V2}/events/admin/dashboard/${event_id}`,
             {
               headers: {
                 Authorization: `Bearer ${Cookies.get("access-token")}`,
               },
               
             }
           );
           eventContext?.setData(res.data.data)
           return res.data.data;
       
           
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
   
           return Promise.reject("Some error occured");
         } 
       };
     
     const {data:eventData,isFetching} =  useQuery({
         queryKey: [event_id],
         queryFn: fetchEvent,
         retry: false,
         refetchOnWindowFocus: false,
       });
  return (
    <div>
        {isFetching ? <Loader/> : children}
    </div>
  )
}

export default EventDashboardIdLayout