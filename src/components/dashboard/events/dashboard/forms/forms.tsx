import { BACKEND_URL, BACKEND_URL_V2 } from '@/constants'
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
import { useEventDashboard } from '@/context/dashboard/useContext'

const EventFormsDashboard = ({event_id}:{event_id:string}) => {
   
    const pathname = usePathname();
   const {forms:data} = useEventDashboard()!.data
  return (
    <div>
        
        {data && <>
        <div className='flex justify-end gap-3'><Link className='bg-yellow-300 text-black p-2 rounded-md' href={`${usePathname()}/add-form`}>Add Form</Link></div>
      <div className='grid grid-cols-2 gap-5 p-12'>
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
      </div>
      
        </>}
    </div>
  )
}

export default EventFormsDashboard