"use client"
import ActivitySection from '@/components/dashboard/activity-section'
import GreetingSection from '@/components/dashboard/greetings-section'
import QuickActions from '@/components/dashboard/quick-actions'
import StatsCards from '@/components/dashboard/stats-cards'
import SuggestionsPanel from '@/components/dashboard/suggestion-panel'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Cookies from 'js-cookie'
import axios, { AxiosError } from 'axios'
import { BACKEND_URL } from '@/constants'
import { useToast } from '@/components/ui/use-toast'
import Loader from '@/components/Loader'
const DashboardPage = () => {
  const {toast} = useToast()
  const fetchDashboard = async()=>{
    try {
      const req = await axios.get(`${BACKEND_URL}/users/dashboard`,{headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }})
      return req.data.dashboard
    } catch (error) {
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message || "Some error occured"
      toast({
        title:message,
        variant:"destructive"
      })
      throw new Error(message);
    }
  }
  const {data:dashboardData,isFetching} = useQuery({
    queryKey:["dashboard"],
    queryFn:fetchDashboard,
    retry:false,
    refetchOnWindowFocus:false
  })
  return (
   <>
   {isFetching?<Loader/>:
   <div className="flex flex-col gap-6 p-4 md:p-6">
       
        <StatsCards resources={dashboardData.resourceCount} events={dashboardData.eventCount} projects={dashboardData.projectCount} collaborations={dashboardData.collabCount} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActivitySection />
            <QuickActions />
          </div>
          <div className="space-y-6">
            <SuggestionsPanel />
            {/* <Leaderboard /> */}
          </div>
        </div>
      </div>}
   </>
  )
}

export default DashboardPage