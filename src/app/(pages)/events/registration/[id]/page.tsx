'use client'
import Loader from '@/components/Loader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BACKEND_URL } from '@/constants'
import { format, getDate } from 'date-fns'
import { useSession } from '@/hooks/useSession'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CheckCircle2 } from 'lucide-react'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { toast } from '@/components/ui/use-toast'
const Page = ({params}:{params:{id:string}}) => {
const {isAuthenticated} = useSession();
    const fetchStatus = async()=>{
        if(!isAuthenticated){
   return;
        }
try 
{
    const res = await axios.get(`${BACKEND_URL}/events/registration/status?rid=${params.id}`,{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
    }});
    return res.data.registration

  
} catch (error) {
    toast({
        title:"Some error occured",
        variant:"destructive"
    })
    return Promise.reject("Some error occured")
}
    }
  const {data,isLoading} = useQuery({
    queryKey:[params.id,'registration-status'],
    queryFn:fetchStatus,
    retry:false,
    refetchOnWindowFocus:false
  })
  useEffect(()=>{
    if(!isAuthenticated){

    }
  },[isAuthenticated])
    return (
    <>
    {isLoading ?<Loader/> : (
        <>
         {
        (data && data.rid!=null) && (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 bg-slate-900 border-yellow-500">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-yellow-500">Registration Status</h1>
                <CheckCircle2 className="w-8 h-8 text-yellow-500" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  <span className="text-yellow-500 font-semibold">{data.status}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Registration ID</span>
                  <span className="text-yellow-500 font-semibold">{data.rid}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Date</span>
                  <span className="text-yellow-500 font-semibold">{format(data.createdAt,"dd/mm/yyyy")}</span>
                </div>
              </div>
            </Card>
          </div>
        )
    }
        </>
   
        
    )}
    </>
  )
}

export default Page