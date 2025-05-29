"use client"

import * as React from "react"
// import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDownIcon, MoreHorizontal, SortAscIcon } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { BACKEND_URL, BACKEND_URL_V2, eventCategories } from "@/constants"
import Cookies from "js-cookie"
import { useClub } from "@/hooks/useClubContext"
import { useAppSelector } from "@/lib/hooks"
import { CustomTable } from "@/components/ui/custom-table"

import { authorisedGetRequest } from "@/lib/api"
import { format } from "date-fns"
import { useDebounceCallback } from "usehooks-ts"


interface Event{
_id:string,
basicDetails:{
  title: string,
  venue:string,
  startDate:Date,
  endDate:Date,
  isOnline:boolean,
  category: string,
},
isPublished:1,
status:1
}

export const eventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.original.basicDetails.title || "N/A",
  },

  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) =>
      row.original.basicDetails.startDate
        ? format( row.original.basicDetails.startDate,"PPP")
        : "N/A",
  },
  {
    accessorKey: "endDate",
    header: "End",
    cell: ({ row }) =>
      row.original.basicDetails.startDate
        ? format( row.original.basicDetails.startDate,"PPP")
        : "N/A",
  },
  {
    accessorKey: "venue",
    header: "Venue",
    cell: ({ row }) => row.original.basicDetails.venue || "N/A",
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.basicDetails.category || "N/A",
  },
  {
    accessorKey:"isPublished",
    header:"Published",
    cell:({row})=>row.original.isPublished
  },
  {
    accessorKey:"status",
    header:"Status",
    cell:({row})=>row.original.status
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
           <Link href={`/dashboard/events/${row.original._id}`}>View</Link>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AllEventsPage() {
  const {toast} = useToast() 


  const [page,setPage] = React.useState(1);
  const[total,setTotal] =React.useState(0);
  const [filters,setFilters] = React.useState({
   title:"",
   category:"",
   page:1
  });

 const debounced = useDebounceCallback(setFilters,500);
  const handleFilterChange = (name:string,value:string)=>{
debounced((prev)=>({...prev,[name]:value}))
  }
  const loadEvents = async()=>{
    try{
      const data = await authorisedGetRequest(`${BACKEND_URL_V2}/events/admin/all`,filters);
      setTotal(data.total);

      return data.events;
    }
    catch(error:any){

    }
  }

const {data:events,isLoading} = useQuery<any>({
  queryKey:[{...filters}],
  queryFn:loadEvents
})

const handlePageChange = ({pageNumber,totalResults}:{pageNumber:number,totalResults:number})=>{
debounced({...filters,page:pageNumber})
}
  return (
    <div className="w-full">
      <div className="flex items-center py-4">

 
      </div>
      <div className="rounded-md border">
       
        <CustomTable
          pagination={false}
          manualPagination={true}
          data={events}
          totalResults={total}
          pageSize={20}
          filterable={[{
            label:"title",type:"text"
          },{label:"category",type:"select",options:eventCategories}]}
          onPageChange={handlePageChange}
          handleFilterStateChange={handleFilterChange}
          columns={eventColumns}
        />
      </div>
  
    </div>
  )
}