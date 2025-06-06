"use client"
import Loader from '@/components/Loader';
import { useToast } from '@/components/ui/use-toast';
import { ClubContext } from '@/context/ClubContext'

import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, PlusCircle, Trophy, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
import Link from 'next/link';
import CustomImage from '@/components/ui/image';
import { useClub } from '@/hooks/useClubContext';
const ClubDashboard = () => {
  const {toast} = useToast();

    
    const clubContext = useClub()

   
const fetchClubDashboardData = async ()=>{
    console.log("Hello")
  if(clubContext.selectedClub){
   
    try {
 
      const res = await axios.get(`${BACKEND_URL}/club/dashboard`,{headers:{
        "Authorization" : `Bearer ${Cookies.get('access-token')}`
      },params:{club_id:clubContext.selectedClub._id}});
    const data = res.data.clubDetails;
  
    return data;
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError<any>
      if(axiosError.response?.data){
        toast({
          title:axiosError.response.data.message,
          variant:"destructive"
        })
       
      return Promise.reject(axiosError.response.data.message);
    
      }
      toast({
        title:"Some error occured",
        variant:"destructive"
      })
      return Promise.reject("Some error occured")
    }

  }

}


    const {data:clubData,isSuccess,isLoading}=useQuery({
        queryKey:[clubContext.selectedClub?._id,"club-dashboard"],
        queryFn:fetchClubDashboardData,
        refetchOnWindowFocus:false,
        retry:false
    });
  return (
   <>
    {!isLoading?(
    <div className='flex flex-col min-h-[90vh] items-center '>
    {clubData ? (
       <div className="min-h-screen bg-slate-950">
       {/* Header */}
       <header className="border-b border-slate-800">
         <div className="container mx-auto px-4 py-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <CustomImage 
               src={clubData.clubLogo} 
               alt={clubData.clubName} 
               className="w-12 h-12 rounded-full object-cover"
             />
             <div>
               <h1 className="text-2xl font-bold text-yellow-400">{clubData.clubName}</h1>
               <p className="text-slate-400 text-sm">{clubData.clubDescription}</p>
             </div>
           </div>
           <div className="flex gap-3">
             <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950">
               <MessageSquare className="w-4 h-4 mr-2" />
               Messages
             </Button>
             <Link href={"/account/club/add-event"} className="bg-yellow-400 p-2 rounded-md flex items-center text-slate-950 hover:bg-yellow-500">
               <PlusCircle className="w-4 h-4 mr-2" />
               Create Event
             </Link>
           </div>
         </div>
       </header>
 
       {/* Main Content */}
       <main className="container mx-auto px-4 py-8">
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-yellow-400 text-sm font-medium"> <Calendar className="w-4 h-4 text-yellow-400" /> Total Events</CardTitle>
              
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-white">{clubData.totalEvents}</div>
             </CardContent>
           </Card>
           <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-yellow-400 text-sm font-medium">   <Trophy className="w-4 h-4 text-yellow-400" /> Upcoming Events</CardTitle>
             
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-white">{clubData.upcomingEvents}</div>
             </CardContent>
           </Card>
           <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-yellow-400 text-sm font-medium">  <Users className="w-4 h-4 text-yellow-400" /><Link href={"/account/club/members"} className='flex items-center gap-2'>Total Members <ArrowRight/></Link></CardTitle>
             
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-white">{clubData.members.length}</div>
             </CardContent>
           </Card>
           <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-yellow-400 text-sm font-medium">  <Users className="w-4 h-4 text-yellow-400" /><Link href={"/account/club/teams"} className='flex items-center gap-2'>Total Teams <ArrowRight/></Link></CardTitle>
             
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-white">{clubData.members.length}</div>
             </CardContent>
           </Card>
           <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-yellow-400 text-sm font-medium"> <MessageSquare className="w-4 h-4 text-yellow-400" /> Messages</CardTitle>
              
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-white">{clubData.messages.length}</div>
             </CardContent>
           </Card>
         </div>
 
         {/* Events Section */}
         <div className="mb-8">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-white">Recent Events</h2>
             <Link href={"/account/club/events"}  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950">
               View All Events
             </Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {clubData.events.map((event:any) => (
               <Card key={event._id} className="bg-slate-900 border-slate-800">
                 <CardHeader>
                   <CardTitle className="text-white">{event.name}</CardTitle>
                   <div className="flex items-center text-slate-400 text-sm">
                     <Calendar className="w-4 h-4 mr-2" />
                     {format(new Date(event.dateTime), "PPP")}
                   </div>
                   <div className="flex items-center text-slate-400 text-sm">
                     <MapPin className="w-4 h-4 mr-2" />
                     {event.venue}
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-yellow-400">Category: {event.category}</span>
                     <span className="text-slate-400">Capacity: {event.maxCapacity}</span>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
 
         {/* Quick Actions */}
         <div>
           <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Button className="bg-slate-900 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 p-8 h-auto flex flex-col gap-2">
               <PlusCircle className="w-6 h-6" />
               <span>Create Event</span>
             </Button>
             <Button className="bg-slate-900 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 p-8 h-auto flex flex-col gap-2">
               <Users className="w-6 h-6" />
               <span>Add Member</span>
             </Button>
             <Button className="bg-slate-900 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 p-8 h-auto flex flex-col gap-2">
               <MessageSquare className="w-6 h-6" />
               <span>Send Message</span>
             </Button>
             <Button className="bg-slate-900 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 p-8 h-auto flex flex-col gap-2">
               <Calendar className="w-6 h-6" />
               <span>View Calendar</span>
             </Button>
           </div>
         </div>
       </main>
     </div>
     ):(
      <div className='bg-slate-800 rounded-md p-4 my-auto mx-auto w-2/4  flex flex-col items-center'>
        <p className='text-center'>You have not registered your club yet</p>
        <Link className={`text-yellow-400 text-xs antialiased text-center`} href={"/account/register-a-club"}>Register now</Link>
      </div>
     )}
    </div>
    ):(
      <Loader/>
    )}
   </>
  )
}

export default ClubDashboard