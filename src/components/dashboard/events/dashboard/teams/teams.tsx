import { useToast } from '@/components/ui/use-toast'
import { BACKEND_URL_V2 } from '@/constants'
import { useEventDashboard } from '@/context/dashboard/useContext'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { CustomTable } from '@/components/ui/custom-table'
import { EventTeam } from '@/types/events'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
const EventTeams = () => {
    const {data,setData} = useEventDashboard()!
    const {toast} =useToast()
    const pathName = usePathname()
    const teamColumns: ColumnDef<EventTeam>[] = [
  {
    accessorKey: "name",
    header: "Team Name",
  },
  {
    accessorKey: "code",
    header: "Team Code",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-md text-white ${
          row.original.status === "submitted"
            ? "bg-green-500"
            : row.original.status === "draft"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => (
      <div className="space-y-1">
        {row.original.members.length}
      </div>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
  },
  {
    accessorKey: "_id",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        className="bg-yellow-400 text-black px-3 py-1 rounded-md"
        href={`${pathName}/teams/${row.original._id}`}
      >
        View
      </Link>
    ),
  },
];
const [filters,setFilters] = useState({
    name:"",
    page:1,
    
    status:""
})
const [totalResults,setTotalResults] =useState(0);
const debounced = useDebounceCallback(setFilters,500);
    const fetchTeams = async()=>{
        try{
            if(data?._id){
      const req = await axios.get(`${BACKEND_URL_V2}/events/admin/teams`,{headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            },params:{
                
                ...filters,event_id:data._id
            }});
            setTotalResults(req.data.totalTeams);
            return req.data.teams;
            }
      return []
        }   
        catch(error:any){
            const aError = error as AxiosError<any>
            const message = aError.response?.data.message || "Some error occured";
            toast({
                title:message,
                variant:"destructive"
            })
        }
    }
        const handleFilterChange = (name:any,value:string|number)=>{
            console.log(name,value)
        debounced((prev)=>({...prev,[name]:value}));
    }
    const handlePagination =(state:{pageNumber:number,totalResults:number})=>{
      debounced((prev) => {
      
        
        return { ...prev, page: state.pageNumber};
      });}
    
      const {data:teams,isFetching} = useQuery({
        queryKey:[{...filters},data._id],
        queryFn:fetchTeams,
        retry:false,
        refetchOnWindowFocus:false
      })
  return (
  <>
  {data && 
  <>
{data.basicDetails?.isTeamEvent ? (
    <>
    <CustomTable
    columns={teamColumns}
    data={teams}
    filterState={filters}
    filterable={[{label:"name",type:"text"},
        {label:"status",type:"select",options:[{
            id:"1",label:"Approved",value:"approved"
        },{id:"2",label:"Not Submitted",value:"not-submitted"},
    {id:"3",label:"Submitted",value:"submitted"}]}
    ]}
    handleFilterStateChange={handleFilterChange}
    isLoading={isFetching}
    manualPagination={true}
    onPageChange={handlePagination}
    totalResults={totalResults}
    pageSize={50}
    />
    </>
)

:(
<>
<div className="max-w-md mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-md text-center">
  <h2 className="text-xl font-semibold text-gray-800">Notice</h2>
  <p className="mt-2 text-gray-600">This event is <span className="font-medium text-red-500">not a team event</span>.</p>
</div>
</>
    
)}
  </>
  }
  </>
  )
}

export default EventTeams