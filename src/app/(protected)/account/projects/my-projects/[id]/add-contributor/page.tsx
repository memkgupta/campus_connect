"use client"
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import Cookies from 'js-cookie'
import { toast } from '@/components/ui/use-toast'
import { AddContributorModal } from '@/components/projects/dashboard/add-contributor-form'
import Loader from '@/components/loader'
const AddContributorPage = ({params}:{params:{id:string}}) => {
    const searchParams = useSearchParams()
    const requestId = searchParams.get('request_id')
    const fetchRequest = async()=>{
        try {
          const req = await axios.get(`${BACKEND_URL}/projects/collaborate/requests/${requestId}`,
            {params:{pid:params.id},headers:{
              "Authorization":`Bearer ${Cookies.get("access-token")}`
            }}
          )
          return req.data.request;
        } catch (error) {
          toast({
            title:"Something went wrong",
            variant:"destructive"
          })
          return Promise.reject("Some error occured")
        }
      }
const {data,isLoading} = useQuery({
    queryKey:['collab-request',requestId],
    queryFn:fetchRequest
})
return (
<>
{isLoading?<Loader/>:<AddContributorModal  details={data} projectId={params.id}/>}

</>
  )
}

export default AddContributorPage