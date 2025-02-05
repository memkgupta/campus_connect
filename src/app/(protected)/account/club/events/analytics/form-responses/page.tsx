"use client"
import { TablePagination } from '@/components/club/analytics/registrations/table-pagination'
import { SubmissionsTable } from '@/components/club/analytics/submission-table'
import Loader from '@/components/loader'
import { Input } from '@/components/ui/input'
import { BACKEND_URL } from '@/constants'
import { FilterOptions } from '@/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import Cookies from 'js-cookie'
import { toast } from '@/components/ui/use-toast'
const EventFormResponsesPage = () => {
  const formId = useSearchParams().get('fid'); 
  const [filters, setFilters] = useState<FilterOptions>({
     search: "",
     sortBy: "date",
     sortOrder: "desc",
     page: 1
   });
   const fetchSubmissions = async()=>{
    try {
      const res = await axios.get(`${BACKEND_URL}/forms/submissions/all?fid=${formId}&page=${filters.page}&search=${search}`,{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      }});
      setTotalPages(Math.ceil((res.data.total)/10))
return res.data.submissions
    } catch (error) {
      toast({
        title:"Some error occured",
        variant:"destructive"
      })
      return Promise.reject("Some error occured");
    }
  }
   const[search,setSearch]=useState('')
  const debounced = useDebounceCallback(setSearch,500);
  const [totalPages,setTotalPages] = useState(1);
  const {data:submissions,isLoading} = useQuery({
    queryKey:['total-registrations',formId,search,filters.page],
    queryFn:fetchSubmissions,
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
         {submissions && <SubmissionsTable viewAll={false}  submissions={submissions} />}
         </>
        )}
      </div>
    </div>
      <TablePagination 
        currentPage={filters.page} 
        totalPages={totalPages}
        onPageChange={(page) => filters.onPageChange?.(page)}
      />
    </div>
     )}
     </>
    )}
    </>
  )
}

export default EventFormResponsesPage