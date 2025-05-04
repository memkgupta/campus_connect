"use client"
import { useToast } from '@/components/ui/use-toast'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'

const Page = () => {
    const {toast} = useToast();
    const [loading,setLoading] = useState(true);
    const fetchRegistrations = async()=>{
        try {
            const res = await axios.get(`/api/events/get-my-registrations`);
            const data = res.data;
            return data.registrations;
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
    const {data:registrations} = useQuery({
        queryKey:[],
        queryFn:fetchRegistrations,
        refetchOnWindowFocus:false,
        retry:false
    });
  return (
    <div>
        
    </div>
  )
}

export default Page