'use client'
import { FormBuilder } from '@/components/club/forms/form-builder/FormBuilder'
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL, BACKEND_URL_V2 } from '@/constants'
import { Field } from '@/types'
import axios, { AxiosError } from 'axios'
import { CirclePlus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { headers } from 'next/headers'
import { useQuery } from '@tanstack/react-query'
import Loader from '@/components/Loader'
import { useClub } from '@/hooks/useClubContext'
const Page = ({params}:{params:{fid:string}}) => {

    const [fields,setFields] = useState<Field[]>([]);
const router = useRouter()
   const clubContext = useClub()
    const fetchForm = async()=>{
        try {
            const res = await axios.get(`${BACKEND_URL_V2}/events/admin/forms/${params.fid}`,{headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            },params:{club_id:clubContext.selectedClub?._id}})
         setFields(res.data.fields)
        } catch (error) {
            toast({
title:"Some error occured",
variant:"destructive"
            })
            return Promise.reject("Some error occured");
        }
    }
const updateForm = async()=>{
  if(!params.fid){
    toast({
      title:"Invalid id",
      variant:"destructive"
    });
  return;
  }
  try {
    const res = await axios.put(`${BACKEND_URL}/club/forms/update`,{fields:fields},{params:{
        formId:params.fid
    },headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
    }});
toast({
  title:"Form updated successfully",
  color:"yellow"
})
// router.push(`/account/club/events/forms/${res.data.id}`)
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

const {data,isLoading} = useQuery({
    queryKey:['form',params.fid],
    queryFn:fetchForm,
    retry:false,
    refetchOnWindowFocus:false
})
  return (
    <>{
        isLoading ? (<Loader/>):(
            <>
  {params.fid && fields ?
      <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Form Builder</h1>
          <button onClick={updateForm} className="flex items-center gap-2 bg-yellow-500 text-slate-950 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
            <CirclePlus className="w-5 h-5" />
            Save Form
          </button>
        </div>
        <FormBuilder fields={fields} setFields={setFields} id={params.fid!} />
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
  
   </>
  )
}

export default Page