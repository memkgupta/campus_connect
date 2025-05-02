"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditMemberDialog } from "./edit-member-dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "../ui/custom-table";
import { useDebounceCallback } from "usehooks-ts";
import { useClub } from "@/hooks/useClubContext";

export function MemberTable() {
    const [totalResults,setTotalResults] = useState(0);
    const clubContext = useClub();
    const [filters,setFilters] = useState(
      {  name:"",email:"",team:"",page:1}
       )
    const fetchMembers = async()=>{
      if(clubContext.selectedClub?._id){
        try {
          const res = await axios.get(`${BACKEND_URL}/club/members`,{headers:{
              "Authorization":`Bearer ${Cookies.get('access-token')}`
          },params:{...filters,club_id:clubContext.selectedClub?._id}})
          setTotalResults(res.data.totalResults);
return res.data.members;
      } catch (error) {
          toast({
              title:"Some error occured",
              variant:"destructive"
          })
          return Promise.reject("Som error occured")
      }
      }
      
    }
    
        const debouncedFilter = useDebounceCallback(setFilters,500);
    const handleFilterChange = (name:string,value:any)=>{
      console.log(name);
      console.log(value);
      debouncedFilter((prev)=>({...prev,[name]:value}))
    }
const handlePagination =(state:{pageNumber:number,totalResults:number})=>{
  debouncedFilter((prev) => {
    // Ensure `updater` is correctly applied
    
    return { ...prev, page: state.pageNumber};
  });
}
    const columns: ColumnDef<any>[] = [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium text-white">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="text-slate-300">{row.original.email}</span>,
      },
      {
        accessorKey: "crole",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
            {row.original.crole}
          </Badge>
        ),
      },
      {
        accessorKey: "team",
        header: "Team",
        cell: ({ row }) => <span className="text-slate-300">{row.original.team}</span>,
      },
      {
        accessorKey: "joinedAt",
        header: "Joined At",
        cell: ({ row }) => (
          <span className="text-slate-300">{format(new Date(row.original.joinedAt), "PP")}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="text-right">
            <Link
              href={`/account/club/members/${row.original.mid}`}
              className="border-yellow-400 p-2 bg-yellow-300 rounded-md text-black hover:bg-yellow-400 hover:text-slate-950"
              onClick={() => console.log("Selected Member:", row.original)} // Replace with setSelectedMember if available
            >
              View
            </Link>
          </div>
        ),
      },
    ];
  const {data:members,isLoading} = useQuery({
        queryKey:['club-members',{...filters}],
        queryFn:fetchMembers
    })
  return (
    <div className="rounded-md border border-slate-800">
     {
        <CustomTable
        isLoading = {isLoading}
        columns={columns}
        data={members}
        filterState={filters}
        handleFilterStateChange={handleFilterChange}
        filterable={[{
          label:"name",type:"text"
        },{
          label:"team",type:"text"
        },
      {
        label:"email",type:"text"
      }]}
        manualPagination={true}
        onPageChange={handlePagination}
        pageSize={20}
        pagination={false}
        totalResults={totalResults}
        />
     
     }
    </div>
  );
}