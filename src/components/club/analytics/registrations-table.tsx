"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCard } from "./table-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/constants";
import { useClub } from "@/hooks/useClubContext";
import { toast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";

type Registration ={
    _id:string,user:{username:string,name:string,email:string},updatedAt:Date
}
export function RegistrationsTable({eventId,viewAll}:{registrations:Registration[],eventId:string,viewAll:boolean}) {

  const [filters,setFilters] = useState({
    username:"",email:"",page:1
  })
   const clubContext = useClub();
  const fetchRegistrations = async()=>{
    if(clubContext.selectedClub){
      try {
        const res = await axios.get(`${BACKEND_URL}/events/dashboard/${eventId}/registrations`,{
          params:{...filters,club_id:clubContext.selectedClub?._id},
          headers:{
            "Authorization":`Bearer ${Cookies.get("access-token")}`
          }
        });
        return res.data.registrations;
      } catch (error) {
        const aError = error as AxiosError<any>
        const message = aError.response?.data.message||"Some error occured";
        toast({
          title:message,
          variant:"destructive"
        })
        return Promise.reject(message);
      }
    }
  
  }

  const {data:registrations,isLoading} = useQuery({
  queryKey:[],
  queryFn:fetchRegistrations,
  retry:false,
  refetchOnWindowFocus:false
 })
  return (
    <>
    {   <TableCard viewAll={viewAll} title="Recent Registrations" viewAllHref={`/account/club/events/dashboard/registrations?eid=${eventId}`}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-slate-800/50">
            <TableHead className="text-slate-400">ID</TableHead>
            <TableHead className="text-slate-400">Name</TableHead>
            <TableHead className="text-slate-400">Email</TableHead>

            <TableHead className="text-slate-400">Date</TableHead>
            <TableHead className="text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
       
          {isLoading && <Loader/>}
          <TableBody>
          {registrations && registrations.map((reg:any,index:number) => (
            <TableRow key={reg._id} className="hover:bg-slate-800/50">
              <TableCell className="text-yellow-500">{index}</TableCell>
              <TableCell className="text-slate-200"><Link href={`/user/${reg.user?.username}`}>{reg.user.name}</Link></TableCell>
              <TableCell className="text-slate-200">{reg.user.email}</TableCell>
            
              <TableCell className="text-slate-200">{format(reg.updatedAt,"dd/mm/yyyy")}</TableCell>
             <TableCell className="text-slate-200"> <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(reg._id)}
            >
              Copy event ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link href={`/account/club/events/dashboard/registrations/${reg._id}`}>View Details</Link></DropdownMenuItem>
          
          </DropdownMenuContent>
        </DropdownMenu></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>}
    </>

  );
}