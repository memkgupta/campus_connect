'use client'
import Loader from '@/components/Loader'

import { useToast } from '@/components/ui/use-toast'

import axios, { AxiosError } from 'axios'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, BuildingIcon, FlagIcon, UserPlusIcon, ClipboardIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import UpdateEventForm from '@/components/component/update-event-form'
const EventPage = ({params}:{params:{id:string}}) => {
    const [data,setData] = useState<any>(null);
    const {toast} = useToast();
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const fetchEvent = async()=>{
        try {
            setIsLoading(true)
            const res = await axios.get(`/api/club/dashboard/events/${params.id}`);
            const data = res.data;
            setData(data.data)
            // setIsRegistered(data.registered)
            return {data:data}
        } catch (error) {
          console.log(error)
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
    useQuery({
      queryKey:[params],
      queryFn:fetchEvent,
      retry:false,
      refetchOnWindowFocus:false
    })
  return (
  <>
   {isLoading ? (
    <Loader/>
   ):(
    <>
    {data && <div>
      {/* Event Details */}
      <div className="max-w-4xl mx-auto p-6">
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
            <CardHeader className='flex justify-between flex-row items-center'>
              <CardTitle>Event Details</CardTitle>
              <div className=''>
              <Dialog >
  <DialogTrigger className="bg-yellow-400 text-black p-2 rounded-md">Edit</DialogTrigger>
  
  <DialogContent className=' overflow-y-auto max-h-[90vh]'>
    <DialogHeader>
    <DialogTitle>Update Event</DialogTitle>
    </DialogHeader>
    <UpdateEventForm data={data} />
  </DialogContent >
</Dialog>
              </div>
              
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
      </div>
  </div>}
    </>
   )}
  </>
    
  )
}

export default EventPage