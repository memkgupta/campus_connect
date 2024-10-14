"use client"
import Loader from '@/components/Loader';
import { useToast } from '@/components/ui/use-toast';
import { ClubContext } from '@/context/ClubContext'

import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"

import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form,FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { editProfileSchema } from '@/schema/editProfileSchema';


import ErrorLoadingPage from '@/components/ErrorLoadingPage';
import { Label } from '@/components/ui/label';
import { useDebounceCallback } from 'usehooks-ts';
import { UploadButton } from '@/utils/uploadthing';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash } from 'lucide-react';
import { editClubSchema } from '@/schema/editClubSchema';
import { Textarea } from '@/components/ui/textarea';
import EventCard from '@/components/events/EventCard';
import Link from 'next/link';
import ClubDashboard from '@/components/club/dashboard/Dashboard';

const Page = () => {
  const {toast} = useToast();
    const clubContextData = useContext(ClubContext);
    const [clubDetails,setClubDetails] = useState({
      clubDescription:'',
      clubName:'',
      clubLogo:'',
      contactPhone:'',
    });
    const[loading,setLoading] = useState(true);
    const[isSubmitting,setIsSubmitting] = useState(false);
    const [isHovered,setIsHovered] = useState(false);
    const [preview,setPreview] = useState<string|null>('');
    const handleProfileSelect = ()=>{
      if(preview){
    setPreview(null);
    
      }
      else{
       
      }
        
    }
    const form = useForm<z.infer<typeof editClubSchema>>({
      resolver:zodResolver(editClubSchema),
      
    })
const fetchClubDashboardData = async ()=>{
try {
  const res = await axios.get(`/api/club/dashboard`);
const data = res.data.clubDetails;
setPreview(data.clubLogo);
setClubDetails({clubDescription:data.clubDescription,clubName:data.clubName,clubLogo:data.clubLogo,contactPhone:data.contactPhone})
form.setValue("clubDescription",data.clubDescription);
form.setValue("clubName",data.clubName);
form.setValue("contactPhone",data.contactPhone);
return data;
} catch (error) {
  
  const axiosError = error as AxiosError<any>
  if(axiosError.response?.data){
    toast({
      title:axiosError.response.data.message,
      variant:"destructive"
    })
    setLoading(false)
  return Promise.reject(axiosError.response.data.message);

  }
  toast({
    title:"Some error occured",
    variant:"destructive"
  })
  return Promise.reject("Some error occured")
}
finally{
  setLoading(false)
}
}

const handleSubmit = async(data:Zod.infer<typeof editClubSchema>)=>{
  try {
    setIsSubmitting(true);
    const reqData:any ={...data}
  
    if(preview!=clubDetails.clubLogo){
      reqData.clubLogo = preview
    }

    const res = await axios.put(`/api/club/update`,reqData);
   
    toast({
      title:'Club details updated successfully'
    })
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    if(axiosError.response?.data){
      toast({title:axiosError.response.data.message,variant:'destructive'})
    }else{
      toast({title:"Some error occured",variant:'destructive'})

    }
  }
  finally{
    setIsSubmitting(false)
  }
}
    const {data:clubData=undefined,isSuccess}=useQuery({
        queryKey:[clubContextData?._id],
        queryFn:fetchClubDashboardData,
        refetchOnWindowFocus:false,
        retry:false
    });
  return (
   <>
    {!loading?(
    <div className='flex flex-col min-h-[90vh] items-center '>
    {clubData ? (
      <div className={`bg-slate-950`}>
      <div className="min-h-screen bg-background-dark text-primary-yellow p-6">
        <header className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">Club Dashboard</h1>
        
        </header>
        
        <main className='relative'>
        <Dialog>
              
              <DialogTrigger> <Button className='absolute top-10 right-10 bg-yellow-300 hover:bg-yellow-400 flex gap-3'>Edit <Pencil size={20}/></Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update User Details</DialogTitle>
                 
                </DialogHeader>
                <div className="flex flex-col justify-center items-center">
           <div onMouseEnter={()=>{
               setIsHovered(true)
           }} onMouseLeave={()=>{setIsHovered(false)}} className={`relative w-52 h-52 rounded-full ${!preview && 'bg-gray-500' }`} onClick={handleProfileSelect}>
               {preview&&<img src={preview} className='w-52 h-52 rounded-full'/>}
               {isHovered && preview && (
           <div className="absolute cursor-pointer inset-0 rounded-full flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity">
           <Trash size={40}/>
           </div>
         )}
           </div>
           <UploadButton
          
           className={`${preview&&'hidden'} mt-2`}
           
           endpoint="fileUploader"
           onClientUploadComplete={(res) => {
           setPreview(res[0].url)
           
           }}
           onUploadError={(error: Error) => {
             // Do something with the error.
             alert(`ERROR! ${error.message}`);
           }}
         />
       </div>
                <Form {...form} >
                      <form  onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-5">
                     
                      
                        
                     
                      
                      <FormField
                        control={form.control}
                        name='clubName'
                        render={({field})=>(
                          <FormItem>
                            <FormLabel>ClubName</FormLabel>
                          
                             <>
                             <Input   placeholder='Club Name' {...field} onChange={(e)=>{
                                field.onChange(e);
                              }}/>
                             
                             </>
                          
                        
                          </FormItem>
                        )}/>
                    
                     
                      <FormField
                        control={form.control}
                        name='clubDescription'
                        render={({field})=>(
                          <FormItem>
                            <FormLabel>ClubDescription</FormLabel>
                            
                              <Textarea  placeholder='name' {...field} onChange={(e:any)=>{
                                field.onChange(e)
                              }}/>
                              
                           
                          </FormItem>
                        )}/>
                      
                      <FormField
                        control={form.control}
                        name='contactPhone'
                        render={({field})=>(
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            
                              <Input type='tel'  placeholder='Contact phone number' {...field} onChange={(e:any)=>{
                                field.onChange(e)
                              }}/>
                              
                           
                          </FormItem>
                        )}/>
                       
                      

   
   
   
                        <Button  type="submit" disabled={isSubmitting||(JSON.stringify(clubDetails)===JSON.stringify(form.getValues()))} className='bg-yellow-300 hover:bg-yellow-400 text-black'  >
                        {isSubmitting?(<>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait
                            </> ):("Save")}
                        </Button>
                      
                      </form>
                    </Form>
            <DialogFooter>
             <DialogClose asChild>
               <Button disabled={isSubmitting} className='bg-red-300  hover:bg-red-400'>Close</Button>
             </DialogClose>
            </DialogFooter>
              </DialogContent>
              
            </Dialog>
          <div className='grid gap-3 bg-slate-900 border border-white rounded-md text-lg p-2'>
           <img className='rounded-full w-[200px] h-[200px]' src={clubData.clubLogo}></img>
            <p className='text-white font-bold'>{clubData.clubName}</p>
            <p className='text-white font-bold'>{clubData.clubDescription}</p>

          </div>
         {/* <ClubDashboard/> */}
        </main>
      </div>
    </div>
     ):(
      <div className='bg-slate-800 rounded-md p-4 my-auto mx-auto w-2/4  flex flex-col items-center'>
        <p className='text-center'>You have not registered your club yet</p>
        <Link className={`text-yellow-400 text-xs antialiased text-center`} href={"/account/register-a-club"}>Register now</Link>
      </div>
     )}
    </div>
    ):(
      <Loader/>
    )}
   </>
  )
}

export default Page