"use client"
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL } from '@/constants'
import { useClub } from '@/hooks/useClubContext'
import { useAppDispatch } from '@/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import { setError, setEvents, setLoading } from '@/lib/slices/clubSlice'
import Loader from '@/components/Loader'
const EventsLayout = ({children}:{children:React.ReactNode}) => {
   
    const clubContext = useClub();
    const dispatch = useAppDispatch();

    const fetcEvents = async()=>{


        if(clubContext.selectedClub){
           const role = ()=>{
            switch(clubContext.selectedClub!.role){
                case "admin":
                case "president":
                 case "vice-president" : return "admin"
                 break;
                case "team-member":return "member"
                case "team-lead" : return "lead" 
                default: return "member"
             }
           }
            try {
                dispatch(setLoading({entity:"events",isLoading:true}));
                const res = await axios.get(`${BACKEND_URL}/club/events`,{
                    params:{club_id:clubContext.selectedClub._id,member_id:clubContext.selectedClub.member_id,team_id:clubContext.selectedClub.team._id},
                    headers:{
                        "Authorization":`Bearer ${Cookies.get("access-token")}`
                    }

                });
                dispatch(setEvents(res.data.events));
                return res.data.events;

             } catch (error) {
                 const aError = error as AxiosError<any>
                 const message = aError.response?.data.message||"Some error occured"
                 toast({
                     title:message,
                     variant:"destructive"
                 })
                 dispatch(setError({entity:"events",error:message}));
                 return Promise.reject(message);
             }
             finally{
                dispatch(setLoading({entity:"events",isLoading:false}));
             }
        }
        else{
            return [];
        }
       
    }
    const {data:events,isLoading} = useQuery({
        queryKey:["club-events",clubContext.selectedClub?._id],
        queryFn:fetcEvents,
        retry:false,
        refetchOnWindowFocus:false

        
    })
  return (
    <div>
{isLoading&&<Loader/>}
{!isLoading && children}
    </div>
  )
}

export default EventsLayout