import { BACKEND_URL, BACKEND_URL_V2 } from '@/constants';
import { useClub } from '@/hooks/useClubContext';
import { FilterOptions } from '@/types';
import axios from 'axios';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { useDebounceCallback } from 'usehooks-ts';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RegistrationFilters } from '@/components/club/analytics/registrations/registration-filters';
import Loader from '@/components/Loader';
import { RegistrationsTable } from '@/components/club/analytics/registrations-table';
import { TablePagination } from '@/components/club/analytics/registrations/table-pagination';
import { CustomTable } from '@/components/ui/custom-table';
import { ColumnDef } from '@tanstack/react-table';
import { EventRegistration } from '@/types/club-dashboard';

import CustomImage from '@/components/ui/image';
import Link from 'next/link';
const EventRegistrationsDashboard = ({event_id}:{event_id:string}) => {

  const pathName = usePathname()
  const clubContext = useClub()
  const [filters, setFilters] = useState({

  page:1
  });
  const[search,setSearch]=useState('')
  const [totalResults,setTotalResults] = useState(0);
  const fetchRegistrations = async()=>{
    try {
      const res = await axios.get(`${BACKEND_URL_V2}/events/admin/registrations`,{
        
        headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      },params:{event_id:event_id,...filters,search}});
      setTotalResults(res.data.totalResults);
return res.data.registrations
    } catch (error) {
      toast({
        title:"Some error occured",
        variant:"destructive"
      })
      return Promise.reject("Some error occured");
    }
  }
  const columns:ColumnDef<EventRegistration>[] =[ 
  {
    accessorKey: "user.name",
    header: "User Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "user.username",
    header: "Username",
  },
  {
    accessorKey: "user.profile",
    header: "Profile",
    cell: ({ row }) => (
      <CustomImage
        src={row.original.user.profile}
        alt="User Profile"
        width={40}
        height={40}
        className="rounded-full"
      />
    ),
  },
  {
    accessorKey: "entry_status",
    header: "Entry Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-md text-white ${
          row.original.entry_status === "pending"
            ? "bg-yellow-500"
            : row.original.entry_status === "approved"
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {row.original.entry_status}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
  },
  {
    accessorKey: "_id",
    header: "View",
    cell:({row})=>(
      <Link className='bg-yellow-400 text-black p-2 rounded-md' href={`${pathName}/registrations/${row.original._id}`}>View</Link>
    )
  },] 
  const debounced = useDebounceCallback(setSearch,500);
  const [totalPages,setTotalPages] = useState(1);
  const {data:registrations,isLoading} = useQuery({
    queryKey:['total-registrations',event_id,search],
    queryFn:fetchRegistrations,
    retry:false,
    refetchOnWindowFocus:false
  })
  return (
    <>
    {(
     <>
     {(
          <div>
          <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8">Event Registrations</h1>
        <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <Input
             placeholder="Search by name, email, or ID..."
             className="pl-10 bg-slate-800 border-yellow-500/20 text-slate-200"
             
             onChange={(e) => debounced(e.target.value)}
           />
         </div>
      
       
        {isLoading?<Loader/>:(
         <>
         {registrations && <CustomTable
          columns={columns}
          data={registrations}
         />}
         </>
        )}
      </div>
    </div>
     
    </div>
     )}
     </>
    )}
    </>
  )
}

export default EventRegistrationsDashboard