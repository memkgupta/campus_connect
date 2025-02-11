'use client'
import Loader from '@/components/Loader'

import { useToast } from '@/components/ui/use-toast'

import axios, { AxiosError } from 'axios'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon,LineChart, UsersIcon, ClockIcon, BuildingIcon, FlagIcon, UserPlusIcon, ClipboardIcon, ExternalLink, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import UpdateEventForm from '@/components/component/update-event-form'
import { BACKEND_URL } from '@/constants'
import Cookies from 'js-cookie'
import { FormsDialog } from '@/components/events/external-form-dialog'
import Link from 'next/link'
interface Form {
  _id: string;
  label: string;
  link: string;
  form: string;
}


const Page = ({params}:{params:{id:string}}) => {
    const [data,setData] = useState<any>(null);
    const {toast} = useToast();
    const queryClient = useQueryClient()
    const [isLoading,setIsLoading] = useState<boolean>(true);
  const[external_forms,setExternalForms] = useState<Form[]>([]);
    const fetchEvent = async()=>{
        try {
            setIsLoading(true)
            const res = await axios.get(`${BACKEND_URL}/events/dashboard/${params.id}`,{headers:{
              "Authorization":`Bearer ${Cookies.get('access-token')}`
            }});
            const data = res.data;
            setData(data.data)
            // setIsRegistered(data.registered)
            if(data.data.external_forms){
              setExternalForms(data.data.external_forms)

            }
            return {data:data}
        } catch (error) {
          console.log(error)
            const axiosError = error as AxiosError<any>
            if(axiosError.response){
            if(axiosError.status!==500){
                toast({
                    title: axiosError.response.data.message,
                    variant: "destructive",
                  });
            }
            else{
                toast({
                    title: "Some error occured",
                    variant: "destructive",
                  });
            }
            }
            
              return Promise.reject("Some error occured")
        }
        finally{
            setIsLoading(false)
        }
    }
    const handleAdd = async(edata: Omit<Form, '_id'>) => {
      const newForm = {
        ...edata,
        _id: crypto.randomUUID()
      };
   
      try {
        const res = await axios.put(`${BACKEND_URL}/events/${data._id}`,{external_forms:[...external_forms,newForm]},{headers:{
          "Authorization":`Bearer ${Cookies.get('access-token')}`
        }});
        // queryClient.invalidateQueries()
      } catch (error) {
        toast({
          title:"Some error occured",
          variant:"destructive"
        })
      }
      setExternalForms((prev:Form[]) => [...prev, newForm]);

    };
  
    const handleEdit = (_id: string) => async(edata: Omit<Form, '_id'>) => {
      setExternalForms(prev => prev.map(form => 
        form._id === _id ? { ...edata, _id } : form
      ));
      const ex = external_forms.map(form => 
        form._id === _id ? { ...edata, _id } : form)
      try {
        const res = await axios.put(`${BACKEND_URL}/events/${data._id}`,{external_forms:ex},{headers:{
          "Authorization":`Bearer ${Cookies.get('access-token')}`
        }});
        // queryClient.invalidateQueries()
      } catch (error) {
        toast({
          title:"Some error occured",
          variant:"destructive"
        })
      }
     
    };
  
    const handleDelete = async(id: string) => {
      const ex = external_forms.filter(form => form._id !== id)
      try {
        const res = await axios.put(`${BACKEND_URL}/events/${data._id}`,{external_forms:ex},{headers:{
          "Authorization":`Bearer ${Cookies.get('access-token')}`
        }});
        // queryClient.invalidateQueries()
      } catch (error) {
        toast({
          title:"Some error occured",
          variant:"destructive"
        })
      }
      setExternalForms(prev => prev.filter(form => form._id !== id));
    };
    useQuery({
      queryKey:[params],
      queryFn:fetchEvent,
      retry:false,
      refetchOnWindowFocus:false
    })

  return (
  <>
   {isLoading ? (
    <Loader/>
   ):(
    <>
    {data && <div>
      {/* Event Details */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="relative w-full h-64 mb-6">
          <Image
            src={data.banner}
            alt={data.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
  
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <div className="space-x-2">
              {data.isTeamEvent && (
                <Badge variant="secondary">Team Event</Badge>
              )}
          
            </div>
          </div>
  
          <Card>
            <CardHeader className='flex justify-between flex-row items-center'>
              <CardTitle>Event Details</CardTitle>
              <Link href={`/account/club/events/analytics?eid=${params.id}`} className='flex gap-2 items-center bg-yellow-300 p-2 rounded-md text-black'>Analytics <LineChart/> </Link>
              <div className=''>
              <Dialog >
  <DialogTrigger className="bg-yellow-400 text-black p-2 rounded-md">Edit</DialogTrigger>
  
  <DialogContent className=' overflow-y-auto max-h-[90vh]'>
    <DialogHeader>
    <DialogTitle>Update Event</DialogTitle>
    </DialogHeader>
    <UpdateEventForm data={data} />
  </DialogContent >
</Dialog>
              </div>
              
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(data.dateTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(data.dateTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span>{data.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                <span>{data.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FlagIcon className="h-5 w-5 text-muted-foreground" />
                <span>{data.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
                <span>Max Capacity: {data.maxCapacity}</span>
              </div>
              {data.participantsFromOutsideAllowed && (
                <div className="flex items-center space-x-2">
                  <UserPlusIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Open to outside participants</span>
                </div>
              )}
              {data.isAcceptingVolunteerRegistrations && (
                <div className="flex items-center space-x-2">
                  <ClipboardIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Accepting volunteer registrations</span>
                </div>
              )}
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.description}</p>
            </CardContent>
          </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Forms
                    </CardTitle>
                  </CardHeader>
<CardContent>
{
  data.forms?.length>0 ?(
data.forms.map((_form:{_id:string,formName:string})=>{
  return(<Card>
    <CardHeader>
      <CardTitle>
      {_form.formName}
      </CardTitle>
    </CardHeader>
    <CardContent>
    <Link href={`/account/club/events/forms/${_form._id}`} className='bg-yellow-300 p-2 rounded-md text-black'>View</Link>
    </CardContent>
  </Card>)
})
  )
  :(<Card>
    <CardHeader>
      <CardTitle>
      Registration form
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='grid gap-2'>
        <p>No Form added</p>
        <Link href={`/account/club/events/add-form?eid=${params.id}`} className='bg-yellow-300 p-2 rounded-md text-black mt-2 max-w-[100px] text-center'>Add</Link>
      </div>
    </CardContent>
  </Card>)
}
  
</CardContent>
                </Card>
          {(
             <div className="space-y-6">
             <div className="flex justify-end">
               <FormsDialog mode="add" onSubmit={handleAdd} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {external_forms&&external_forms.map((form:any) => (
                 <Card key={form._id} className="bg-slate-900 border-slate-800">
                   <CardContent className="p-6">
                     <div className="space-y-4">
                       <div className="flex justify-between items-start">
                         <h3 className="text-lg font-semibold text-white">{form.label}</h3>
                         <div className="flex gap-2">
                           <FormsDialog
                             mode="edit"
                             initialData={form}
                             onSubmit={handleEdit(form.id)}
                           />
                           <Button
                             variant="outline"
                             size="sm"
                             className="border-red-400 text-red-400 hover:bg-red-400 hover:text-slate-950"
                             onClick={() => handleDelete(form.id)}
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <div className="text-sm text-slate-400">Form ID: {form.form}</div>
                         <a 
                           href={form.link} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
                         >
                           View Form
                           <ExternalLink className="w-4 h-4 ml-1" />
                         </a>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
             {external_forms&&external_forms.length === 0 && (
               <div className="text-center py-12">
                 <p className="text-slate-400">No forms available. Add your first form to get started.</p>
               </div>
             )}
           </div>
          )}
  
         
        </div>
      </div>
  </div>}
    </>
   )}
  </>
    
  )
}

export default Page