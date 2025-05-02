"use client"
import { RegistrationDetails } from '@/components/club/analytics/registrations/registration-details'
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import Loader from '@/components/Loader'
import { useClub } from '@/hooks/useClubContext'
const Page = ({params}:{params:{rid:string}}) => {
const clubContext = useClub()
      const fetchRegistration = async()=>{
        if(clubContext.selectedClub){
          try {
            const res = await axios.get(`${BACKEND_URL}/club/events/registrations/${params.rid}`,
              {headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
              },params:{club_id:clubContext.selectedClub?._id}}
            )
            return res.data.data;
          } catch (error) {
            console.log(error)
            toast({
              title:"Some error occured",
              variant:"destructive"
            })
          return  Promise.reject("Some error occured")
          }
        }
    
      }
      const {data,isLoading} = useQuery({
        queryKey:['registration',params.rid],
        queryFn:fetchRegistration,
        retry:false,
        refetchOnWindowFocus:false
      })
  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
     {
      isLoading?(<Loader/>):(
        <>
        {data &&  <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
          Registration Details
        </h1>
        
       
         
          <RegistrationDetails registration={data} />
       
      </div>}
        </>
      )
     }
    </div>
  )
}

export default Page