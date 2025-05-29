"use client"
import { BACKEND_URL } from '@/constants';
import { EventContextProvider, useEventContext } from '@/context/EventContext'
import axios, { AxiosError } from 'axios';
import React from 'react'
import Cookies from 'js-cookie';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { EventRegistrationContextProvider } from '@/context/event_registration/EventRegistrationContext';
const EventLayout = ({children,params}:{children:React.ReactNode,params:{id:string}}) => {
  const {data,setData} = useEventContext()
  const {toast} = useToast()
  const id = params.id
    const fetchEvent = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/events/${id}`,
        {
          headers:{
            "Authorization":`Bearer ${Cookies.get("access-token")}`
          }
        }
      );
      const reqData = res.data;
  
      
   setData({...reqData.data,registered:reqData.registered||"null",assignments:reqData.assignments})

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
    <div>
       <EventRegistrationContextProvider>
   {isFetching?<Loader/>:children}
       </EventRegistrationContextProvider>
     
      
    </div>
  )
}

export default EventLayout