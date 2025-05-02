"use client"
import { FormGrid } from '@/components/club/analytics/forms/form-grid'
import { RegistrationsTable } from '@/components/club/analytics/registrations-table'
import { StatsCard } from '@/components/club/analytics/stats-card'
import { SubmissionsTable } from '@/components/club/analytics/submission-table'
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FileSpreadsheet, PointerIcon, TextCursorIcon, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import React from 'react'
import { toast } from '@/components/ui/use-toast'
import Loader from '@/components/Loader'
import { useClub } from '@/hooks/useClubContext'
interface User {
  username: string;
  name: string;
  email: string;
}

interface RecentRegistration {
  _id: string;
  user: User;
  updatedAt: string;
}

interface Form {
  _id: string;
  formName: string;
  enabled: boolean;
  responseCount: number;
}

interface EventResponse {
  _id: string;
  totalImpressions: number;
  totalRegistrations: number;
  recentRegistrations: RecentRegistration[];
  forms: Form[];
  totalForms: number;
}

const Page = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eid');
  const clubContext = useClub();
 
  const fetchAnalytics = async():Promise<EventResponse>=>{
    if(eventId){
      try {
        const res = await axios.get(`${BACKEND_URL}/events/admin/analytics?eid=${eventId}`,{headers:{
          "Authorization":`Bearer ${Cookies.get('access-token')}`
        },params:{club_id:clubContext.selectedClub?._id}})
        return res.data.analytics
      } catch (error) {
        console.log(error);
        toast({
          title:"Some error occured",
          variant:"destructive"
        })
        return Promise.reject("Some error occured")
      }
    }
 else{
  return Promise.reject("No event id")
 }
  }
  const {data,isLoading} = useQuery<EventResponse>({
    queryKey:['event-analytics',eventId],
    queryFn:fetchAnalytics,
    retry:false,
    refetchOnWindowFocus:false
  })
  return (
    <>
    {isLoading?(<Loader/>):(
      <>
      {data&&(
        <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-yellow-500 mb-8">Event Analytics</h1>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <StatsCard 
              title="Total Registrations" 
              value={data.totalRegistrations}
              icon={Users}
              trend={{ value: "+12% this week", positive: true }}
            />
            <StatsCard title='Total Impressions' value={data.totalImpressions} icon={PointerIcon}/>
      
    
          </div>
    
          <div className="space-y-6">
            <RegistrationsTable viewAll eventId={eventId as string} registrations={data.recentRegistrations as any}/>
           
          </div>
          <FormGrid forms={data.forms}/>
        </div>
      </div>
      )}
      </>
    )}
    </>
  )
}

export default Page