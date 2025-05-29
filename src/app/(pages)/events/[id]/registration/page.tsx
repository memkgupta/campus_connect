'use client'
import { FormFieldInput } from '@/components/dashboard/events/dashboard/forms/form-render/form-field-input'
import { Button } from '@/components/ui/button'
import { BACKEND_URL } from '@/constants'
import { Field } from '@/types'
import { createFieldSchema } from '@/utils/validations'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useSession } from '@/hooks/useSession'
import { Toast } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import RegistrationDetailsForm from '@/components/events/registration/common/registration_details'
import { useEventContext } from '@/context/EventContext'
import { useEventRegistration } from '@/context/event_registration/EventRegistrationContext'
import CustomImage from '@/components/ui/image'
import { format } from 'date-fns'
import EventRegistrationContainer from '@/components/events/registration/registration_container'
const Page = ({params}:{params:{id:string}}) => {
    const searchParams = useSearchParams()
     const router = useRouter();
     const [formData, setFormData] = useState<Record<number, any>>({});
     const [errors, setErrors] = useState<Record<number, string>>({});
     const [isSubmitting,setIsSubmitting] = useState(false);
   const {isAuthenticated,isLoading} = useSession()

    const eventContext = useEventContext();
    const eventRegistrationContext = useEventRegistration()
    if(!eventContext || !eventContext.data)
    {
      router.back()
      return;
    }

     return (
       <div className="min-h-screen bg-slate-950 p-6 flex flex-col md:flex-row gap-8 items-start">
      {
        eventContext.data.registered!="null"?(
          <>
          <EventRegistrationContainer id={eventContext.data.registered as string}/>
          </>
        ):( 
          <>
           <div className=' w-2/3'>
          <RegistrationDetailsForm/>
          </div>
         
          <EventInfoCard/>
          </>
        )
      }
       </div>
     );
}

export default Page

function EventInfoCard() {
  const { data } = useEventContext();

  if (!data?.basicDetails) return null;

  const { banner, basicDetails } = data;
  const { title, venue, startDate, registrationDeadline, description } = basicDetails;

  return (
    <div className="w-full md:max-w-[350px] bg-slate-950 text-white border border-slate-800 rounded-xl shadow-sm p-4 space-y-3">
      {banner && (
        <div className="relative h-40 w-full overflow-hidden rounded-md">
          <CustomImage
            src={banner}
            alt="Event Banner"
           
 
            className="rounded-md"
          />
        </div>
      )}
  <h2 className="text-lg font-bold text-white text-wrap whitespace-pre-wrap">{title}</h2>
{/* <p className="text-sm text-slate-300 text-wrap whitespace-pre-wrap max-w-[200px]">{description}</p> */}
<div className="text-sm text-slate-300 space-y-1">
  <p><strong>📍 Venue:</strong> {venue}</p>
  <p><strong>📅 Date:</strong> {format(new Date(startDate), "PPP")}</p>
  <p><strong>⏳ Deadline:</strong> {format(new Date(registrationDeadline), "PPP")}</p>
</div>
    </div>
  );
}