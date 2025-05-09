"use client"
import { BACKEND_URL } from '@/constants'
import { useEventRegistration } from '@/context/event_registration/EventRegistrationContext'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import Loader from '@/components/Loader'
import { useSession } from '@/hooks/useSession'
import { createFieldSchema } from '@/utils/validations'
import { Field } from '@/types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { FormFieldInput } from '@/components/club/forms/form-render/form-field-input'
const EventForm = () => {
    const router = useRouter()
    const {data:registrationContext,setData} = useEventRegistration()
    const {toast} = useToast()
   
         const [formData, setFormData] = useState<Record<number, any>>({});
         const [errors, setErrors] = useState<Record<number, string>>({});
         const [isSubmitting,setIsSubmitting] = useState(false);
       const {isAuthenticated,isLoading:sessionLoading} = useSession()



     const fetchForm= async()=>{
          try {
            if(registrationContext.registrationDetails?._id!=null)
            {
              const res = await axios.get(`${BACKEND_URL}/forms/get-form?rid=${registrationContext.registrationDetails._id}`,{headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            }})
            return res.data.fields
            }
           return[]
          } catch (error) {
              const axiosError = error as  AxiosError<any>
              const message = axiosError.response?.data.message || "Some error occured"
              toast({
                  title:message,
                  color:"#FFFF00."
              })
              return Promise.reject("Some error occured");
          }
      }
      const validateForm = () => {
        const newErrors: Record<number, string> = {};
        let isValid = true;
    if(form){
     form.forEach((field:Field) => {
         try {
           const schema = createFieldSchema(field);
           schema.parse(formData[field._id]);
         } catch (error) {
           isValid = false;
           newErrors[field._id] = 'This field is required';
         }
       });
    }
     
    
        setErrors(newErrors);
        return isValid;
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
    
     
 
     
        
      };
      const onSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        console.log(formData)
        if(isAuthenticated && !isSubmitting){
          if (!validateForm()) {
              setIsSubmitting(false)
              return;
            }
        
            try {
             
     setIsSubmitting(true);
     const res = await axios.post(`${BACKEND_URL}/forms/fill-form`,{registrationId:registrationContext.registrationDetails._id,formData},{
         headers:{
             Authorization:`Bearer ${Cookies.get('access-token')}`
         }
     })
              toast({
                 title:"Form submitted"
              })
            
 
            setData({...registrationContext,registrationDetails:res.data.registration})
            } catch (error) {
             const axiosError = error as AxiosError<any>
             
             const message = axiosError.response?.data.message || "Some error occured";
             //  console.error('Error submitting form:', error);
             toast({title:message,variant:"destructive"})
            }
            finally{
              setIsSubmitting(false);
            }
        }
      }
    const {data:form,isLoading} = useQuery({
        queryKey:[registrationContext.registrationId],
        queryFn:fetchForm,
        retry:false
    })
    
  return (
    <div className='w-full'>
    {isLoading?<Loader/>:(
        <div className='w-2/3 mx-auto'>
      {form ? (
              <form onSubmit={onSubmit} className="space-y-6">
              {form.map((field:Field) => (
                <FormFieldInput
                  key={field._id}
                  field={field}
                  value={formData[field._id]}
                  onChange={(value) => 
                    setFormData((prev) => ({ ...prev, [field._id]: value }))
                  }
                  error={errors[field._id]}
                />
              ))}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-slate-950 hover:bg-yellow-400"
              >
                Submit
              </Button>
            </form>
         ):
         <div className='w-full h-full flex justify-center items-center'>
            </div>}
        </div>
    )}
    </div>
    
  )
}

export default EventForm