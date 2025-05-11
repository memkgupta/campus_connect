"use client"
import { BACKEND_URL, BACKEND_URL_V2 } from '@/constants'
import { useEventContext } from '@/context/EventContext'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Field } from '@/types'
import { FormFieldInput } from '@/components/club/forms/form-render/form-field-input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/Loader'
import { createFieldSchema } from '@/utils/validations'
import { useToast } from '@/components/ui/use-toast'
import { useEventRegistration } from '@/context/event_registration/EventRegistrationContext'
const AssignmentSubmit = ({params}:{params:{id:string,aid:string}}) => {
    const {data:event} = useEventContext()
    const [formSubmission,setFormSubmission] = useState(null)
    const registrationContext = useEventRegistration()
             const [errors, setErrors] = useState<Record<number, string>>({});
    const member_id = registrationContext.data.registrationDetails.team?.members.find((mem:any)=>mem.registrationDetails===registrationContext.data.registrationDetails._id);
   const fetchAssignment = async()=>{
    try {
        const req = await axios.get(`${BACKEND_URL_V2}/events/assignments/view/${params.aid}`,
            {headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            }}
        );
        return req.data.assignment
    } catch (error) {
    const aError = error as AxiosError<any>
    const message = aError.response?.data.message || "Some error occured"; 
    return Promise.reject(message)        
    }
   }
   const {toast} = useToast()
            const [formData, setFormData] = useState<Record<number, any>>({});
            const [isSubmitting,setIsSubmitting] = useState(false);
   
   const {data:assignment,isFetching} = useQuery({
    queryKey:[params.aid],
    retry:false,
    queryFn:fetchAssignment,
    refetchOnWindowFocus:false
   })
       const validateForm = () => {
           const newErrors: Record<number, string> = {};
           let isValid = true;
       if(assignment.form){
        assignment.form.fields.forEach((field:Field) => {
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
   const onSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
       
        if(!isSubmitting){
          if (!validateForm()) {
              setIsSubmitting(false)
              return;
            }
        
            try {
             
     setIsSubmitting(true);
     const res = await axios.post(`${BACKEND_URL}/forms/fill-form`,{registrationId:registrationContext.data.registrationDetails._id,formData,form_id:assignment.form._id},{
         headers:{
             Authorization:`Bearer ${Cookies.get('access-token')}`
         }
     })
     setFormSubmission(res.data.submission);
              toast({
                 title:"Form submitted"
              })
            
 
           
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
      const handleSubmitAssignment = async()=>{
        try {
            const req = await axios.post(`${BACKEND_URL_V2}/events/assignments/submit`,{
                member_id:member_id,
                form_submission:formSubmission,
                assignment_id:params.aid,
                registration_id:registrationContext.data.registrationDetails._id
            },
        {
            headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            }
        })
        } catch (error) {
            const aError = error as AxiosError<any>
            const message = aError.response?.data.message || "Some error occured";
            toast({
                title:message,
                variant:"destructive"
            })
        }
      }
  return (
   <>
   {isFetching?<Loader/>:
   (
      <Card className="w-full max-w-3xl mx-auto my-4 p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{assignment.title}</CardTitle>
        <p className="text-muted-foreground">{assignment.description}</p>
        <p className="text-sm mt-2 text-gray-500">
          Deadline: {new Date(assignment.submissionDeadline).toLocaleString()}
        </p>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-medium mb-2">Form: {assignment.form.formName}</h3>
        <Separator className="mb-4" />

        
           <form onSubmit={onSubmit} className="space-y-6">
              {assignment.form.fields.map((field:Field) => (
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
                disabled={false}
                className="w-full bg-yellow-500 text-slate-950 hover:bg-yellow-400"
              >
                Submit
              </Button>
            </form>

            <Button className='bg-yellow-100' onClick={handleSubmitAssignment}>Submit Assignment</Button>
      </CardContent>
    </Card>
   )
   }
   </>
  )
}

export default AssignmentSubmit