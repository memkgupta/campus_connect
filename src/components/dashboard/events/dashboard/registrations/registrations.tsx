import { BACKEND_URL, BACKEND_URL_V2 } from '@/constants';
import { useClub } from '@/hooks/useClubContext';
import { FilterOptions } from '@/types';
import axios, { AxiosError } from 'axios';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventDashboard } from '@/context/dashboard/useContext';
const EventRegistrationsDashboard = ({event_id}:{event_id:string}) => {

  const pathName = usePathname()
  const {data:eventDetails,setData} = useEventDashboard()!
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

const handleAttach = async(id:string)=>{
  try{
    const req = await axios.put(`${BACKEND_URL_V2}/events/admin/forms/attach-registration-form`,{formId:id,eventId:event_id},{
      headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }
    });
    toast({
      title:"Registration form attached"
    })
    setData({...eventDetails,registrationForm:id})
  }
  catch(error:any)
  {
    const aError = error as AxiosError<any>
    const message = aError.response?.data?.message || "Some error occured";
    toast({
  title:message,
  variant :"destructive"
    })

    }
}
  return (
    <>
    {(
     <>
     {(
          <div>
          <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6 ">
        <div className='flex '>
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 flex-1 text-start">Event Registrations</h1>
     {eventDetails.registrationForm?(<Link className='px-2 h-fit py-2 rounded-md items-center text-black bg-yellow-500' href={`/dashboard/events/${event_id}/forms/${eventDetails.registrationForm}`}>
     View Registration Form
     </Link>):(
    <div>
     {eventDetails.forms && <div className='justify-self-end'>
        <AttachFormDialog forms={eventDetails.forms} onAttach={(e)=>{
          handleAttach(e)
        }}/>
        </div>
      }
  </div>
    )
        }
        </div>
       
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
interface Form {
  _id: string;
  formName: string;
 
}
interface AttachFormDialogProps {
  forms: Form[]; 
  onAttach: (formId: string) => void; 

}
 function AttachFormDialog({ forms, onAttach }: AttachFormDialogProps) {
  const [selectedFormId, setSelectedFormId] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Attach Registration Form</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Registration Form</DialogTitle>
          <DialogDescription>
            Choose which form you want to assign as the registration form for this event.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Select onValueChange={setSelectedFormId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a form" />
            </SelectTrigger>
            <SelectContent>
              {forms.map((form) => (
                <SelectItem key={form._id} value={form._id}>
                  {form.formName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              if (selectedFormId) {
                onAttach(selectedFormId);
              }
            }}
            disabled={!selectedFormId}
          >
            Attach Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EventRegistrationsDashboard