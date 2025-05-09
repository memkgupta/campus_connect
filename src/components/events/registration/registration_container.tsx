import { useToast } from '@/components/ui/use-toast'
import { BACKEND_URL_V2 } from '@/constants'
import { useEventRegistration } from '@/context/event_registration/EventRegistrationContext'
import axios, { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import TeamDetails from './team_event/team_details'
import SimpleEventRegistrationDetails from './simple_event/simple_event'
import { useQuery } from '@tanstack/react-query'
import EventForm from './common/event_form'
import Loader from '@/components/Loader'
import { useEventContext } from '@/context/EventContext'
const EventRegistrationContainer = ({id}:{id:string}) => {
  const {data:event} = useEventContext()
  const registrationContext = useEventRegistration()
  const {toast} = useToast()
 const fetchRegistrationDetails = async()=>{
  try{
  const registrationId = id
  console.log(registrationId)
   if(
registrationId
   )
  {
    const req = await axios.get(`${BACKEND_URL_V2}/events/registrations/status`,{
      params:{
        regId:registrationId
      },
      headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }
    })
    registrationContext.setData({
      ...registrationContext.data,registrationDetails:req.data.registration
    });
    return req.data.registration
  }

  }
  catch(error:any)
  {
    const aError = error as AxiosError<any>
    const message = aError.response?.data.message || "Some error occured";
    toast({
        title:message,
        variant:"destructive"
      })
  }
 }
 const {data,isFetching} = useQuery({
  queryKey:[id],
  queryFn:fetchRegistrationDetails,
  refetchOnWindowFocus:false,
  retry:false
 })
  return (
    <div className='w-full'>
{isFetching?<Loader/>:(<>
  {
    registrationContext.data.registrationDetails?.status==="completed"?(
      <>
      {
        event?.basicDetails.isTeamEvent?(<>
        <TeamDetails/>
        </>):
        (
          <>
          <SimpleEventRegistrationDetails/>
          </>
        )
      }
      </>
    )
    :(
    
        <EventForm/>
    
    )
   }
</>)}
    </div>
  )
}

export default EventRegistrationContainer