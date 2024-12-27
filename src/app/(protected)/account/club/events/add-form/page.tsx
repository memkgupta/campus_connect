'use client'
import { FormBuilder } from '@/components/club/forms/form-builder/FormBuilder'
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL } from '@/constants'
import { Field } from '@/types'
import axios, { AxiosError } from 'axios'
import { CirclePlus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
const AddEventForm = () => {
    const params = useSearchParams();
    const id = params.get('eid')
    const type = params.get('type');
    const [fields,setFields] = useState<Field[]>([]);
const router = useRouter()
    // console.log(id)
const addForm = async()=>{
  if(!id){
    toast({
      title:"Invalid id",
      variant:"destructive"
    });
  return;
  }
  try {
    const res = await axios.post(`${BACKEND_URL}/forms/add-form`,{event:id,formName:"Registration Form",fields},{headers:{
      "Authorization":`Bearer ${Cookies.get('access-token')}`
    }});
toast({
  title:"Form added successfully",
  color:"yellow"
})
router.push(`/account/club/events/forms/${res.data.id}`)
  } catch (error) {
    const axiosError = error as AxiosError<any>
    if(axiosError.response){
      toast({
        title:axiosError.response.data.message,
        variant:"destructive"
      });
    }
  else{
    toast({
      title:"Some error occured",
      variant:"destructive"
    })
  }
  }
}
  return (
 <>
  {id ?
    <div className="min-h-screen bg-slate-950 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Form Builder</h1>
        <button onClick={addForm} className="flex items-center gap-2 bg-yellow-500 text-slate-950 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
          <CirclePlus className="w-5 h-5" />
          Save Form
        </button>
      </div>
      <FormBuilder fields={fields} setFields={setFields} id={id!} />
    </div>
  </div>
  :(
    <div>
        Page not found
    </div>
  )}
 </>
  )
}

export default AddEventForm