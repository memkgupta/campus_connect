"use client"
import Loader from '@/components/Loader'
import { BACKEND_URL_V2 } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { CustomTable } from '@/components/ui/custom-table'
export const registrationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.original.event?.basicDetails?.title || "N/A",
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) =>
      row.original.event?.basicDetails?.startDate
        ? format(new Date(row.original.event.basicDetails.startDate), "PPP")
        : "N/A",
  },



  {
    accessorKey: "name",
    header: "Participant Name",
    cell: ({ row }) => row.original.name || "N/A",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status || "N/A",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <Link href={`/events/${row.original.event?._id}/registration`}>View Event</Link>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const MyRegistrations = () => {
    const token = Cookies.get("access-token")
    const {toast} = useToast()
    const [total,setTotal] = useState(0);
    const [filters,setFilters] = useState({
        title:"",
        page:1
    });
     const debounced = useDebounceCallback(setFilters,500);
       const handleFilterChange = (name:string,value:string)=>{
debounced((prev)=>({...prev,[name]:value}))
  }
  const handlePageChange = ({pageNumber,totalResults}:{pageNumber:number,totalResults:number})=>{
debounced({...filters,page:pageNumber})
}
    const fetchMyRegistration = async()=>{
try {
    const req = await axios.get(`${BACKEND_URL_V2}/events/registrations/my-registrations`,
        {
            headers:{
                "Authorization":`Bearer ${token}`
            },
            params:filters
        }
    );
    setTotal(req.data.total ||0)
    return req.data.registrations
} catch (error) {
    const axiosError = error as AxiosError<any>
    const message = axiosError.response?.data.message || "Some error occured"
    toast({
        title:message,
        variant:"destructive"
    })
}
    }
    const {data:registrations,isFetching} = useQuery({
        queryKey:[{...filters}],
        queryFn:fetchMyRegistration,
        retry:false,
        refetchOnWindowFocus:false
    })
  return (
    <div>
        {
           (<>
              <CustomTable
                      pagination={false}
                      manualPagination={true}
                      data={registrations}
                      isLoading={isFetching}
                      totalResults={total}
                      pageSize={20}
                      filterable={[{
                        label:"title",type:"text"
                      },]}
                      onPageChange={handlePageChange}
                      handleFilterStateChange={handleFilterChange}
                      columns={registrationColumns}
                    />
            </>)
        }
    </div>
  )
}

export default MyRegistrations