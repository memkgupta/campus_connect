"use client"

import { toast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/constants";
import { useClub } from "@/hooks/useClubContext";
import { useAppDispatch } from "@/lib/hooks";
import { setClubDetails, setError, setLoading, setMembers, setTeams } from "@/lib/slices/clubSlice";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { DashboardSidebar } from '@/components/club/events/event-dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { MenuIcon } from 'lucide-react'

export default function ClubLayout({children}:Readonly<{
    children:React.ReactNode
}>){
    const dispatch = useAppDispatch()
    const clubContext = useClub();
    const fetchClubDetails = async()=>{
        if(clubContext.selectedClub ){
            try {
            dispatch(setLoading({entity:"details",isLoading:true}))
            const res = await axios.get(`${BACKEND_URL}/club/details`,{params:{
                club_id:clubContext.selectedClub._id,
            },headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            }})
            dispatch(setMembers(res.data.data.members))
            dispatch(setTeams(res.data.data.teams));
            dispatch(setClubDetails(res.data.data.details));
            return res.data.data;
            } catch (error) {
                console.log(error)
                const aError = error as AxiosError<any>
                const message = aError.response?.data.message||"Some error occured";
                toast({
                    title:message,
                    variant:"destructive"
                })
                dispatch(setError({entity:"details",error:message}));
                return Promise.reject("Some error occured")
            }
            finally{
                dispatch(setLoading({entity:"details",isLoading:false}))
            }
        }
    }
    const {data,isLoading} = useQuery({
        queryKey:["club-details",clubContext.selectedClub?._id],
        queryFn:fetchClubDetails,
        retry:false,
        refetchOnWindowFocus:false
    })
    return(
      
        
        
        <SidebarProvider>
            <DashboardSidebar /> 
            <SidebarTrigger>
                <MenuIcon />
            </SidebarTrigger>
            <div className='w-full p-12'>
            {children}
            </div>
        </SidebarProvider>
      
 )
}