"use client"
import { CustomTable } from '@/components/ui/custom-table';
import { toast } from '@/components/ui/use-toast';
import { BACKEND_URL } from '@/constants';
import { useAppSelector } from '@/lib/hooks';
import { Message } from '@/types/club-dashboard';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { useClub } from '@/hooks/useClubContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const Messages = () => {
    // const [messages,setMessages]= useState<Message[]>([]);
    const clubContext = useClub()
    const [filters,setFilters] = useState({
        page:1,email:"",organisation:"",name:""
    });
    const [totalResults,setTotalResults] = useState(0);
    const handlePageChange = (page:any)=>{
        setFilters(prev=>({...prev,page:page.pageNumber}))
    }
    const handleFilterChange = (name:string,value:any)=>{
        setFilters(prev=>({...prev,[name]:value}))
    }
    const fetchMessages = async()=>{
        try {
            const req = await axios.get(`${BACKEND_URL}/clubs/messages`,{params:{...filters,club_id:clubContext.selectedClub!._id},
            headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            }})
            setTotalResults(req.data.totalResults);
            return req.data.messages;
        } catch (error) {
            const aError = error as AxiosError<any>
            const message = aError.response?.data.message||"Some error occured";
            toast({
                title:message,
                variant:"destructive"
            })
            return Promise.reject("Some error occured")
        }
    }
    const messageColumns: ColumnDef<Message>[] = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => row.original.name || "N/A",
        },
        {
          accessorKey: "email",
          header: "Email",
          cell: ({ row }) => row.original.email || "N/A",
        },
        {
          accessorKey: "organisation",
          header: "Organisation",
          cell: ({ row }) => row.original.organisation || "N/A",
        },
        {
          accessorKey: "subject",
          header: "Subject",
          cell: ({ row }) => row.original.subject || "N/A",
        },
        {
          accessorKey: "message",
          header: "Message",
          cell: ({ row }) => row.original.message || "N/A",
        },
        {
          accessorKey: "club",
          header: "Club",
          cell: ({ row }) => row.original.club || "N/A",
        },
        {
          accessorKey: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <DropdownMenu>
            <DropdownMenuTrigger>...</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
           
                <Dialog>
                    <DialogTrigger>View</DialogTrigger>
                    <DialogContent>
                    
                    <Card className="w-full max-w-lg p-4 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{row.original.subject || "No Subject"}</CardTitle>
        <p className="text-sm text-gray-500">{row.original.organisation || "Unknown Organisation"}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{row.original.message || "No message content available."}</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>From:</strong> {row.original.name || "Anonymous"} ({row.original.email || "No email"})
          </p>
          {/* {row.original.club && <p><strong>Club:</strong> {row.original.club}</p>} */}
        </div>
        
      </CardContent>
    </Card>
                    </DialogContent>
                </Dialog>
              </DropdownMenuLabel>
          
           
            </DropdownMenuContent>
           </DropdownMenu>
          ), // Replace with actual action handlers
        },
      ];
      const {data:messages,isLoading} =useQuery({
        queryKey:["club-messages",{...filters}],
        queryFn:fetchMessages,
        retry:false,
        refetchOnWindowFocus:false
      }) 
  return (
    <div>
          <CustomTable
            columns={messageColumns}
            data={messages as Message[]}
            manualPagination={true}
            totalResults={totalResults}
            onPageChange={handlePageChange}
            filterState={filters}
            handleFilterStateChange={handleFilterChange}
            filterable={[{
                label:"name",type:"text",
            },{label:"organisation",type:"text"}]}
        
        /> 
     
    </div>
  )
}

// export const message
export default Messages