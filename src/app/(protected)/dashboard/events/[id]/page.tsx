"use client"
import React from 'react'
import AdminEventDetails from "@/components/club/events/dashboard/details/admin-event-details";
import AdminTasksDashboard from "@/components/club/events/dashboard/tasks/admin-tasks";
import EventFormsDashboard from "@/components/club/events/dashboard/forms/forms";
import EventFeedbacksDashboard from "@/components/club/events/dashboard/feedbacks/feedbacks";
import EventReportsDashboard from "@/components/club/events/dashboard/reports/reports";
import EventConfigDashboard from "@/components/club/events/dashboard/config/config";
import EventRegistrationsDashboard from "@/components/club/events/dashboard/registrations/registrations";
import MemberEventDashboard from "@/components/club/member/member-event-dashboard";
import MemberEventDetails from "@/components/club/events/dashboard/details/member-event-details";
import MemberTasksDashboard from "@/components/club/events/dashboard/tasks/member-tasks";
import LeadTaskDashboard from "@/components/club/events/dashboard/tasks/lead-tasks";
import { useClub } from '@/hooks/useClubContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventDashboardOverview from '@/components/club/events/dashboard/details/overview';
const EventDashboardPage = ({params}:{params:{id:string}}) => {


    // const fetchEvent = ()

 const tabs = [
    {value:"admin-overview",label:"Overview",content:<EventDashboardOverview event_id={params.id}/>},
 
    
    {value:"admin-feedbacks",label:"Feedbacks",content:<EventFeedbacksDashboard/>},
    {value:"admin-reports",label:"Reports",content:<EventReportsDashboard/>},
    {value:"admin-config",label:"Config",content:<EventConfigDashboard event_id={params.id}/>},
    {value:"registrations",label:"Registrations",content:<EventRegistrationsDashboard event_id={params.id}/>},
 ]
  return (
    <div>
  <Tabs defaultValue={tabs[0].value} className="w-full">
  <TabsList>
   {tabs.map(t=>(
    <TabsTrigger value={t.value}>{t.label}</TabsTrigger>
   ))}
  </TabsList>
  {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
</Tabs>
    
    </div>
  )
}

export default EventDashboardPage