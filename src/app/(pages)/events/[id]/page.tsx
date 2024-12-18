'use client'
import Loader from '@/components/Loader'

import { useToast } from '@/components/ui/use-toast'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import {Button} from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, BuildingIcon, FlagIcon, UserPlusIcon, ClipboardIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


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
        // setIsRegistered(data.registered)
        return {data:data}
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
// const handleParticipantRegister = async()=>{
// setIsSubmitting(true)
// try {
//     const res = await axios.post(`/api/events/register-for-event`,{
// note:note,eventId:id,registrationType:"participant"
//     });
//     const data = res.data;
//     if(!data.success){
//       toast({
//         title:data.message,
//         variant:'destructive'
//       })
//     }
//     else{
//       toast({
//         title:"Registered successfully waiting for approval",
        
//       });
//       setIsDialogOpen(false);
//       router.replace(`/account/events/${data.id}`);

//       // return {data:data.event,isRegistered:data.registered}
//     }
// } catch (error) {
//     const axiosError = error as AxiosError<any>
//     if(axiosError.response?.status!=500){
//       toast({
//         title:axiosError.response?.data.message,
//         variant:"destructive"
        
//       });
//     }else{
//       toast({
//         title:"Some error occured",
//         variant:"destructive"
        
//       });
//     }
// }
// finally{
// setIsSubmitting(false);
// }
// }
    const {data:_data,isSuccess} = useQuery<any>({
        queryKey:[id],
        queryFn:fetchEvent,
        refetchOnWindowFocus:false,
        retry:false,
    })
//    useEffect(()=>{},[id])
    return (
   <>
    {
        isLoading || !data ? <Loader/>
        :(<div className="max-w-4xl mx-auto p-6">
          <div className="relative w-full h-64 mb-6">
            <Image
              src={data.banner}
              alt={data.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
    
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <div className="space-x-2">
                {data.isTeamEvent && (
                  <Badge variant="secondary">Team Event</Badge>
                )}
            
              </div>
            </div>
    
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(data.dateTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(data.dateTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{data.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FlagIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{data.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Max Capacity: {data.maxCapacity}</span>
                </div>
                {data.participantsFromOutsideAllowed && (
                  <div className="flex items-center space-x-2">
                    <UserPlusIcon className="h-5 w-5 text-muted-foreground" />
                    <span>Open to outside participants</span>
                  </div>
                )}
                {data.isAcceptingVolunteerRegistrations && (
                  <div className="flex items-center space-x-2">
                    <ClipboardIcon className="h-5 w-5 text-muted-foreground" />
                    <span>Accepting volunteer registrations</span>
                  </div>
                )}
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data.description}</p>
              </CardContent>
            </Card>
    
            {data.forms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.forms.map((form:any, index:number) => (
                      <li key={index}>
                        <a href={form.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {form.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
    
           
          </div>
        </div>)
    }
   </>
  )
}

export default Page