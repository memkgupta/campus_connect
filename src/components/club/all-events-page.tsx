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
import { useToast } from "../ui/use-toast"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { BACKEND_URL, eventCategories } from "@/constants"
import Cookies from "js-cookie"
import { useClub } from "@/hooks/useClubContext"
import { useAppSelector } from "@/lib/hooks"
import { CustomTable } from "../ui/custom-table"
import { Event } from "@/types/club-dashboard"




export const eventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name || "N/A",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description || "N/A",
  },
  {
    accessorKey: "dateTime",
    header: "Date & Time",
    cell: ({ row }) =>
      row.original.dateTime
        ? new Date(row.original.dateTime).toLocaleString()
        : "N/A",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => row.original.location || "N/A",
  },
  {
    accessorKey: "venue",
    header: "Venue",
    cell: ({ row }) => row.original.venue || "N/A",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category || "N/A",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
           <Link href={`/account/club/events/${row.original._id}`}>View</Link>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AllEventsPage() {
  const {toast} = useToast() 
  const {events} = useAppSelector(state=>state.club);

  const [page,setPage] = React.useState(1);
  const [filteredEvents,setFilteredEvents] = React.useState(
   events.data.events.slice(0,Math.min(events.data.events.length,20))
  );
  const [filters,setFilters] = React.useState({
   name:"",
   category:"",
  });
  const clubContext = useClub();
  const handlePageChange = ({ pageNumber, totalResults }: { pageNumber: number; totalResults: number; })=>{
    setPage(pageNumber);
  }
  const handleFilterChange = (name:string,value:string)=>{
    setFilters((prev)=>({...prev,[name]:value}));
  }
  React.useEffect(()=>{
    const filtered = events.data.events.filter(e=>{
      return e.name!.startsWith(filters.name) && (filters.category!==""?e.category===filters.category:true)
    })
    const start = (page-1)*20;
    const paginated = filtered.slice(start,Math.min(filtered.length,start+20))
    setFilteredEvents(paginated)
  },[page,filters])
  return (
    <div className="w-full">
      <div className="flex items-center py-4">

 
      </div>
      <div className="rounded-md border">
       
        <CustomTable
          pagination={false}
          manualPagination={true}
          data={filteredEvents}
          totalResults={events.data.events.length}
          pageSize={20}
          filterable={[{
            label:"name",type:"text"
          },{label:"category",type:"select",options:eventCategories}]}
          onPageChange={handlePageChange}
          handleFilterStateChange={handleFilterChange}
          columns={eventColumns}
        />
      </div>
  
    </div>
  )
}