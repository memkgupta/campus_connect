'use client'
import { FormBuilder } from '@/components/dashboard/events/dashboard/forms/form-builder/FormBuilder'
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL, BACKEND_URL_V2, eventFormTypes } from '@/constants'
import { Field } from '@/types'
import axios, { AxiosError } from 'axios'
import { CirclePlus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import ComboBox from '@/components/ui/combobox-custom'
import {Input} from '@/components/ui/input'
import { useClub } from '@/hooks/useClubContext'
import { useEventDashboard } from '@/context/dashboard/useContext'
const AddEventForm = ({params}:{params:{id:string}}) => {
    const id = params.id;
    const {data,setData} = useEventDashboard()!
    const [type,setType] = useState({value:'registration',label:'Registration',id:'registration'});
    const [formName,setFormName] = useState('');
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
      const res = await axios.post(`${BACKEND_URL_V2}/events/admin/forms/add`,{event:id,formName:formName||"Registration Form",fields,type:type.value},{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      },});
  toast({
    title:"Form added successfully",
    color:"yellow"
  })
  setData({...data,forms:[...data.forms,res.data.form]})
  router.replace(`/dashboard/events/${params.id}/forms/${res.data.data._id}`)
    } catch (error) {
        console.log(error);
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
        <Input className=' max-w-[200px]' value={formName} placeholder='Form Name' onChange={(e)=>{setFormName(e.target.value)}}/>
        <ComboBox label='Type' stateSetter={setType} options={eventFormTypes} />
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