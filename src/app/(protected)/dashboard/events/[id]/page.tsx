"use client"
import React from 'react'
import AdminEventDetails from "@/components/dashboard/events/dashboard/details/admin-event-details";
import AdminTasksDashboard from "@/components/dashboard/events/dashboard/tasks/admin-tasks";
import EventFormsDashboard from "@/components/dashboard/events/dashboard/forms/forms";
import EventFeedbacksDashboard from "@/components/dashboard/events/dashboard/feedbacks/feedbacks";
import EventReportsDashboard from "@/components/dashboard/events/dashboard/reports/reports";
import EventConfigDashboard from "@/components/dashboard/events/dashboard/config/config";
import EventRegistrationsDashboard from "@/components/dashboard/events/dashboard/registrations/registrations";
import MemberEventDashboard from "@/components/club/member/member-event-dashboard";
import MemberEventDetails from "@/components/dashboard/events/dashboard/details/member-event-details";
import MemberTasksDashboard from "@/components/dashboard/events/dashboard/tasks/member-tasks";
import LeadTaskDashboard from "@/components/dashboard/events/dashboard/tasks/lead-tasks";
import { useClub } from '@/hooks/useClubContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventDashboardOverview from '@/components/dashboard/events/dashboard/details/overview';
import { EventContextProvider } from '@/context/dashboard/EventContext';
import { useToast } from '@/components/ui/use-toast';
import { BACKEND_URL_V2 } from '@/constants';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { useEventDashboard } from '@/context/dashboard/useContext';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import EventTeams from '@/components/dashboard/events/dashboard/teams/teams';
import Assignments from '@/components/dashboard/events/dashboard/assignments/page';
import CheckIn from '@/components/dashboard/events/dashboard/check-in/CheckIn';
const EventDashboardPage = ({params}:{params:{id:string}}) => {

const eventContext = useEventDashboard();
    // const fetchEvent = ()
const event_id = params.id;
 const tabs = [
    {value:"admin-overview",label:"Overview",content:<EventDashboardOverview event_id={params.id}/>},
    {value:"admin-feedbacks",label:"Feedbacks",content:<EventFeedbacksDashboard/>},
    {value:"admin-reports",label:"Reports",content:<EventReportsDashboard/>},
    {value:"admin-config",label:"Config",content:<EventConfigDashboard event_id={params.id}/>},
    {value:"registrations",label:"Registrations",content:<EventRegistrationsDashboard event_id={params.id}/>},
    {value:"assignments",label:"Assignments",content:<Assignments/>},
    {value:"teams",label:"Teams",content:<EventTeams/>},
    {value:"forms",label:"Forms",content:<EventFormsDashboard event_id={params.id}/>},
    {value:"check-in",label:"Check in",content:<CheckIn />}
 ]

  return (
    <div>
    {
      eventContext?.data?(
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
      )
      :
      (
        <Loader/>
      )
    }
    
    
 
    
    </div>
  )
}

export default EventDashboardPage