import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import { useClub } from '@/hooks/useClubContext'
import { toast } from '@/components/ui/use-toast'
import Loader from '@/components/Loader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const EventFormsDashboard = ({event_id}:{event_id:string}) => {
    const clubContext = useClub();
    const pathname = usePathname();
    const fetchForms = async()=>{
        if(clubContext.selectedClub){
            try {
                const res = await  axios.get(`${BACKEND_URL}/club/forms`,{
                    params:{
                        club_id:clubContext.selectedClub._id,
                        eid:event_id,
                    },
                    headers:{
                        "Authorization":`Bearer ${Cookies.get("access-token")}`
                    }
                });
                return res.data.forms;
            } catch (error) {
                const aError = error as AxiosError<any>
                const message = aError.response?.data.message || "Some error occured"
                toast({
                    title:message,
                    variant:"destructive"
                })
                return Promise.reject(message);
            }
        }
        
       
    }
    const {data,isLoading} = useQuery({
        queryKey:["event-forms",event_id],
        queryFn:fetchForms,
        retry:false,
        refetchOnWindowFocus:false
    })
  return (
    <div>
        {isLoading && <Loader/>}
        {data && <>
        <div className='flex justify-end'><Link className='bg-yellow-300 text-black p-2 rounded-md' href={`${usePathname()}/add-form`}>Add Form</Link></div>
        {data.map((form:any)=>(
               <Card key={form._id} className="w-full max-w-sm">
               <CardHeader>
                <Link target='_blank' href={`${pathname}/forms/${form._id}`}>
                <CardTitle className="text-lg font-semibold">{form.formName}</CardTitle>
                </Link>
                
               </CardHeader>
               <CardContent className="flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Type:</span>
                   <Badge variant="outline">{form.type}</Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Status:</span>
                   <Badge variant={form.enabled ? "default" : "destructive"}>
                     {form.enabled ? "Enabled" : "Disabled"}
                   </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Responses:</span>
                   <span className="text-sm font-medium">{form.totalResponses}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Created At:</span>
                   <span className="text-sm font-medium">{new Date(form.createdAt).toLocaleDateString()}</span>
                 </div>
               </CardContent>
             </Card>
        ))}
        </>}
    </div>
  )
}

export default EventFormsDashboard