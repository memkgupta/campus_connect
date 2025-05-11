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

  
  return (
    <div className='w-full'>
{(<>
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
      {/* Event assignmnet submissions */}

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