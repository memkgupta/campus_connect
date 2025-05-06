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
import { EventContextProvider } from '@/context/dashboard/EventContext';
import { useToast } from '@/components/ui/use-toast';
import { BACKEND_URL_V2 } from '@/constants';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { useEventDashboard } from '@/context/dashboard/useContext';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
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
    {value:"assignments",label:"Assignments",content:"Assignments"},
    {value:"forms",label:"Forms",content:<EventFormsDashboard event_id={params.id}/>}
 ]
  const {toast} = useToast()
     const fetchEvent = async () => {
         try {
           
           const res = await axios.get(
             `${BACKEND_URL_V2}/events/admin/dashboard/${event_id}`,
             {
               headers: {
                 Authorization: `Bearer ${Cookies.get("access-token")}`,
               },
               
             }
           );
           eventContext?.setData(res.data.data)
           return res.data.data;
       
           
         } catch (error) {
          
           const axiosError = error as AxiosError<any>;
           if (axiosError.response) {
             if (axiosError.status !== 500) {
               toast({
                 title: axiosError.response.data.message,
                 variant: "destructive",
               });
             } else {
               toast({
                 title: "Some error occured",
                 variant: "destructive",
               });
             }
           }
   
           return Promise.reject("Some error occured");
         } 
       };
     
     const {data:eventData,isLoading} =  useQuery({
         queryKey: [event_id],
         queryFn: fetchEvent,
         retry: false,
         refetchOnWindowFocus: false,
       });
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