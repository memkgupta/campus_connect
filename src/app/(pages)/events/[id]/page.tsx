'use client'
import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

const Page = ({params}:{params:{id:string}}) => {
  const router = useRouter()
    const [isLoading,setIsLoading]=useState(true)
    const [note,setNote] = useState('')
    const[isDialogOpen,setIsDialogOpen]=useState(false);
    const [isRegistered,setIsRegistered] = useState(false)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [data,setData] = useState<any>()
    const {toast} = useToast();
    const {id} = params
const fetchEvent = async()=>{
    try {
        setIsLoading(true)
        const res = await axios.get(`/api/events/${id}`);
        const data = res.data;
        setData(data.event)
        setIsRegistered(data.registered)
        return {data:data,isRegistered:data.isRegistered,rid:data.registration_id}
    } catch (error) {
        const axiosError = error as AxiosError<any>
        if(axiosError.response){
        if(axiosError.status!==500){
            toast({
                title: axiosError.response.data.message,
                variant: "destructive",
              });
        }
        else{
            toast({
                title: "Some error occured",
                variant: "destructive",
              });
        }
        }
        
          return Promise.reject("Some error occured")
    }
    finally{
        setIsLoading(false)
    }
}
const handleParticipantRegister = async()=>{
setIsSubmitting(true)
try {
    const res = await axios.post(`/api/events/register-for-event`,{
note:note,eventId:id,registrationType:"participant"
    });
    const data = res.data;
    if(!data.success){
      toast({
        title:data.message,
        variant:'destructive'
      })
    }
    else{
      toast({
        title:"Registered successfully waiting for approval",
        
      });
      setIsDialogOpen(false);
      router.replace(`/account/events/${data.id}`);

      // return {data:data.event,isRegistered:data.registered}
    }
} catch (error) {
    const axiosError = error as AxiosError<any>
    if(axiosError.response?.status!=500){
      toast({
        title:axiosError.response?.data.message,
        variant:"destructive"
        
      });
    }else{
      toast({
        title:"Some error occured",
        variant:"destructive"
        
      });
    }
}
finally{
setIsSubmitting(false);
}
}
    const {data:eventData,isSuccess} = useQuery<any>({
        queryKey:[id],
        queryFn:fetchEvent,
        refetchOnWindowFocus:false
    })
//    useEffect(()=>{},[id])
    return (
   <>
    {
        isLoading ? <Loader/>
        :(<div className='w-full flex justify-center'>
{data && <div className='grid w-3/4'>
<div className="w-full h-auto lg:h-[500px] p-12 mt-5">
        <img className="object-cover w-full h-full " src={data.banner} alt={data.name} />
      </div>
      <div className="p-4 text-white flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className=" font-bold text-xl mb-2">{data.name}</div>
          <p className=" text-base">{data.description}</p>
        </div>
        <div className="mb-8">
          <div className="flex items-center">
            <img className="w-10 h-10 rounded-full mr-4" src={data.clubDetails.clubLogo} alt={data.clubDetails.clubName} />
            <div className="text-sm">
              <p className=" leading-none">{data.clubDetails.clubName}</p>
            </div>
          </div>
          <p className="text-gray-600">{data.location}</p>
          <p className="text-gray-600">{new Date(data.dateTime).toLocaleString()}</p>
          <p className="text-gray-600">Category: {data.category}</p>
        </div>
        <div className="flex items-center">
          <p className={`text-sm ${data.isFull ? 'text-red-500' : 'text-green-500'}`}>
            {data.isFull ? 'Full' : 'Available'}
          </p>
          <p className="text-sm text-gray-600 ml-4">Registrations: {data.totalRegistrations}/{data.maxCapacity}</p>
          <div className='ml-4'>
          {!data.isFull && (!isRegistered?(
           <>
           {(eventData.category==="hackathon"||eventData.category==="competition")?(
<Link className='bg-yellow-300 hover:bg-yellow-400 text-black p-2 rounded-md' href={`/event/register?hid=${eventData._id}`}>
Register Now
</Link>
           ):(
            <AlertDialog >
           <AlertDialogTrigger disabled={isSubmitting} className='bg-yellow-300 hover:bg-yellow-400 text-black p-2 rounded-md'>{isSubmitting?(<div className='flex gap-2 items-center justify-center'>
            <p>Please wait</p> <Loader2 className='animate-spin text-white' size={20}/>
           </div>):"Register"}</AlertDialogTrigger>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>Do you want to register for this event?</AlertDialogTitle>
               <AlertDialogDescription>
                 Your registration request will be sent to the event admin and once the request is accepted RSVP mail will be sent to you
                 <Textarea className='mt-2' maxLength={300} placeholder='Any note you would like to give to the event organiser'  onChange={(e)=>{setNote(e.target.value)}}/>
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <Button disabled={isSubmitting} onClick={handleParticipantRegister}>Continue</Button>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
          
           )}
           </>
          ):(<Link href={`/account/registrations/${id}`} className='bg-green-300 rounded-md hover:bg-green-400 text-white'>Status</Link>))}
          </div>
        </div>
      </div>
</div>}
        </div>)
    }
   </>
  )
}

export default Page