'use client'
import { FormFieldInput } from '@/components/club/forms/form-render/form-field-input'
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
const Page = ({params}:{params:{id:string}}) => {
    const searchParams = useSearchParams()
    const rid = searchParams.get('rid');
    const fetchForm= async():Promise<Field[]> =>{
        try {
            const res = await axios.get(`${BACKEND_URL}/forms/get-form`,{params:{
                rid:rid
            },headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            }})
            return res.data.fields
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
    const {data:form } = useQuery({
        queryKey:[params.id,'form-data'],
        queryFn:fetchForm
     })
     const router = useRouter();
     const [formData, setFormData] = useState<Record<number, any>>({});
     const [errors, setErrors] = useState<Record<number, string>>({});
     const [isSubmitting,setIsSubmitting] = useState(false);
   const {isAuthenticated,isLoading} = useSession()
     const validateForm = () => {
       const newErrors: Record<number, string> = {};
       let isValid = true;
   if(form){
    form.forEach((field) => {
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
   
      if(isAuthenticated && !isSubmitting){
        if (!validateForm()) {
            setIsSubmitting(false)
            return;
          }
      
          try {
            // TODO: Replace with actual form submission logic
   setIsSubmitting(true);
   const res = await axios.post(`${BACKEND_URL}/forms/fill-form`,{registrationId:rid,formData},{
       headers:{
           Authorization:`Bearer ${Cookies.get('access-token')}`
       }
   })
            toast({
               title:"Form submitted"
            })
            router.push(`/events/registration/${rid}`);
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

    
       
     };
   useEffect(()=>{
if(!isLoading){
    if(!isAuthenticated){
        Toast({
            title:"Please login first",
            variant:"destructive"
        })
        router.push("/sign-in")
    }
}
   },[isAuthenticated,isLoading])
   useEffect(()=>{
    if(!rid){
        router.back();
    }
   },[])
     return (
       <div className="min-h-screen bg-slate-950 p-6">
         <div className="max-w-2xl mx-auto">
           <h1 className="text-3xl font-bold text-yellow-400 mb-8">Submit Form</h1>
         {form ? (
              <form onSubmit={handleSubmit} className="space-y-6">
              {form.map((field) => (
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
       </div>
     );
}

export default Page