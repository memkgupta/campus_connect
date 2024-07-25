"use client"
import ErrorCard from '@/components/ErrorCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { eventCategories } from '@/constants';
import axios, { AxiosError } from 'axios';
import { CalendarIcon, Loader2, Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ComboBox from '@/components/ComboBox';
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { UploadButton } from '@/utils/uploadthing';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { eventRegistrationSchema } from '@/schema/eventRegistrationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { format } from "date-fns"
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { EventParticipantRequestResponse } from '@/types';
import {DataTable} from "@/components/ui/data-table"
import { columns } from './columns';
import usePagination from '@/hooks/usePagination';
import { useQuery } from '@tanstack/react-query';
const Page = ({params}:{params:{id:string}}) => {
    const [isSubmitting,setIsSubmitting]=useState(false);
    const {id} = params
    const [data,setData] = useState<any>();
    
    const {toast} = useToast();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null)
    const [category,setCateg] = useState<NoInfer<{value:string,label:string,id:string}>|null>(eventCategories[0]);
    const[banner,setBanner] = useState<string|null>(null);
  const form  = useForm<z.infer<typeof eventRegistrationSchema>>({
    resolver:zodResolver(eventRegistrationSchema),
   defaultValues:{

   }
  });
  const [date, setDate] = React.useState<Date>()
  const [participantsFromOutsideAllowed,setParticipantFromOutsideAllowed] = useState(false);
  const [isHovered,setIsHovered] = useState(false);
  const handlesubmit = async(data:Zod.infer<typeof eventRegistrationSchema>)=>{
    // console.log(data);
    setIsSubmitting(true);
   
   if(!category){
    toast({title:'Please Select a category',variant:'destructive'})
    return;
   }
    const reqData = {
      
      name:data.name,
      venueAddress:data.venueAddress,
      description:data.description,
      dateTime:date,
      creationTimeStamp: new Date(),
      location:data.location,
      maxCapacity:data.maxCapacity,
      category:category.value,
      participantsFromOutsideAllowed:participantsFromOutsideAllowed,
      banner:banner,
      

    }
    try {
      const res = await axios.post(`/api/events/club/add`,reqData);
      const data = res.data
      if(data.success){
        toast({title:'Event registered successfully will be redirecting soon'})
    
      }
      else{
        toast({title:data.message,variant:'destructive'})

      }
    } catch (error) {
      
    }
  console.log(reqData);
  }
  const [isRequestsLoading,setIsRequestsLoading] = useState(true);
const [registrationRequestCount,setRegistrationRequestsCount]=useState(10);
  const { limit, onPaginationChange, skip, pagination } = usePagination();
const [registrationRequests,setRegistrationRequests] = useState<any>(
  [
    {
      _id: "1a2b3c4d",
      user_name: "Mayank Sharma",
      user_profile: "https://example.com/profile/mayank.jpg",
      user_username: "mayank_dev",
     
      note: "Exploring advanced Java concepts for upcoming project.",
      date: new Date("2024-07-23")
    },
    {
      _id: "2b3c4d5e",
      user_name: "Aditi Singh",
      user_profile: "https://example.com/profile/aditi.jpg",
      user_username: "aditi_code",
     
      note: "Working on a new frontend framework.",
      date: new Date("2024-06-15")
    },
    {
      _id: "3c4d5e6f",
      user_name: "Rohan Verma",
      user_profile: "https://example.com/profile/rohan.jpg",
      user_username: "rohan_dev",
  
      note: "Experimenting with Kafka for real-time data processing.",
      date: new Date("2024-05-20")
    }
  ]
)
const fetchRegistrationRequests = async()=>{
  try {
    const res = await axios.get(`/api/events/club/get-registrations`,{params:{event_id:id,page:pagination.pageIndex}})
    const data = res.data;
    setRegistrationRequests(data.registrations.map((registration:EventParticipantRequestResponse)=>({_id:registration._id,user_name:registration.user.name,user_profile:registration.user.profile,user_username:registration.user.username,note:registration.applicationNote,date:registration.createdAt})));
    setRegistrationRequestsCount(Math.ceil(data.total/limit));
    return {registrations:data.registrations,total:data.total}
  } catch (error) {
    toast({
      title:"Some error occured",
      variant:"destructive"
    })
    return Promise.reject("Some error occured")
  }
  finally{
    setIsRequestsLoading(false);
  }
}
const {data:registrationData,isSuccess} = useQuery<any>(
  {
    queryKey:[pagination,limit],
    queryFn:fetchRegistrationRequests
   
  }
)
    useEffect(()=>{
     axios.get(`/api/events/club/${id}`)
     .then((res)=>{
        const res_data = res.data;
        if(!res_data.success){
            setError(res_data.message);
            toast({title:data.message,variant:"destructive"})
        }
        else{
            setData(res_data.data);
            form.setValue('name',res_data.data.name)
            form.setValue('description',res_data.data.description)
            form.setValue('location',res_data.data.location)
            form.setValue('maxCapacity',res_data.data.maxCapacity)
            form.setValue('venueAddress',res_data.data.venueAddress)
            setBanner(res_data.data.banner)
            setParticipantFromOutsideAllowed(res_data.data.participantsFromOutsideAllowed)
            setDate(res_data.data.dateTime)
        }
        
     })
     .catch((error)=>{
        const axiosError= error as AxiosError<any>;
        if(axiosError.response?.data){
            toast({title:axiosError.response.data.message,variant:"destructive"})
        }  
        else{
            toast({title:"Some error occured",variant:"destructive"})
        }
     })
     .finally(()=>{
        setLoading(false)
     })
    },[id]);
  return (
    <>
    {loading?(<div className='min-h-screen w-full flex justify-center items-center'><Loader2 className='text-gray animate-spin' size={40}/></div>):(
        <>
        {error?(
            <ErrorCard title='Some error occured' message={error} />
        ):(
            <div className='w-full grid md:flex justify-center justify-items-center'>
                <div className="relative w-3/4 lg:max-w-3/4  bg-slate-900/50 border-2 border-gray-700 shadow-md rounded-md  mx-10 my-4">
      
        {/* Edit Dialog */}
        <Dialog >
           <DialogTrigger> <Button className='absolute top-10 right-10 bg-yellow-300 hover:bg-yellow-400 flex gap-3'>Edit <Pencil size={20}/></Button></DialogTrigger>
           <DialogContent className='overflow-y-scroll max-h-screen flex flex-col justify-center items-center'>
             <DialogHeader>
               <DialogTitle>Update User Details</DialogTitle>
              
             </DialogHeader>
             <div className='max-h-[80vh]'>
             <div className="w-2/3 border-2 border-gray-800 flex flex-col items-center justify-center py-10">
<div onMouseEnter={()=>{
            setIsHovered(true)
        }} onMouseLeave={()=>{setIsHovered(false)}} className={`relative w-3/4 rounded-md h-[200px] mb-4 flex items-center justify-center ${!banner && 'bg-slate-900/50' }`} onClick={(e)=>{
          if(banner){
            setBanner(null);
          }
        }} >
 {banner&&<img src={banner} className='w-full h-full'/>}
            {isHovered && banner && (
        <div className="absolute cursor-pointer inset-0 rounded-md flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity">
        <Trash size={40}/>
        </div>
            )}
            <UploadButton
       
       className={`${banner&&'hidden'} mt-2`}
       
       endpoint="fileUploader"
       onClientUploadComplete={(res) => {
       setBanner(res[0].url)
       }}
       onUploadError={(error: Error) => {
         // Do something with the error.
         alert(`ERROR! ${error.message}`);
       }}
     />
</div>
</div>
<div>
<Form {...form} >
  <form onSubmit={form.handleSubmit(handlesubmit)} className='space-y-6'>
<FormField control={form.control} name='name' render={({field})=>(
  <FormItem>
<FormLabel>Name of the event</FormLabel>
<Input  required placeholder='Name of the event'  {...field} onChange={(e)=>{field.onChange(e)}} />
  <FormDescription>{form.formState.errors.name && <p className='text-red-500 text-sm'>{form.formState.errors.name.message}</p>}</FormDescription>
  </FormItem>

)}/>
<FormField control={form.control} name='description' render={({field})=>(
  <FormItem>
<FormLabel>Description of the event</FormLabel>
<Textarea  required placeholder='Description of the event'  {...field} onChange={(e)=>{field.onChange(e)}} />
<FormDescription>{form.formState.errors.description && <p className='text-red-500 text-sm'>{form.formState.errors.description.message}</p>}</FormDescription>
  </FormItem>

)}/>
<FormField control={form.control} name='venueAddress' render={({field})=>(
  <FormItem>
<FormLabel>Venue address of the event</FormLabel>
<Textarea  required placeholder='Vennue of the event'  {...field} onChange={(e)=>{field.onChange(e)}} />
<FormDescription>{form.formState.errors.venueAddress && <p className='text-red-500 text-sm'>{form.formState.errors.venueAddress.message}</p>}</FormDescription>
  </FormItem>

)}/>
<FormField control={form.control} name='location' render={({field})=>(
  <FormItem>
<FormLabel>City</FormLabel>
<Input required placeholder='City where the event is happening'  {...field} onChange={(e)=>{field.onChange(e)}} />
<FormDescription>{form.formState.errors.location && <p className='text-red-500 text-sm'>{form.formState.errors.location.message}</p>}</FormDescription>
  </FormItem>

)}/>
<FormField control={form.control} name='maxCapacity' render={({field})=>(
  <FormItem>
<FormLabel>Maximum Capacity</FormLabel>
<Input type='number' required placeholder='Maximum capcity of the event'  {...field} onChange={(e)=>{field.onChange(e)}} />
<FormDescription className='text-red-500 text-sm'>{form.formState.errors.maxCapacity && form.formState.errors.maxCapacity.message}</FormDescription>
  </FormItem>

)}/>
<Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>

    <ComboBox label='Category' stateSetter={setCateg} options={eventCategories}/>

   <div className='grid gap-2'>
    <Label>Participants from outside allowed</Label>
   <Switch
                      
                      checked={participantsFromOutsideAllowed}
                      onCheckedChange={(e)=>{setParticipantFromOutsideAllowed(e)}}
                    />
   </div>
                   
                

<Button type='submit' className='bg-yellow-300 hover:bg-yellow-400 text-black'>{isSubmitting?(<div className='flex gap-2'>Please Wait <Loader2 className='animate-spin text-gray-800' size={20}></Loader2></div>):('Submit')}</Button>
  </form>
</Form>
</div>

             </div>
    
         <DialogFooter>
          {/* <DialogClose asChild>
            <Button disabled={isSubmitting} className='bg-red-300  hover:bg-red-400'>Close</Button>
          </DialogClose> */}
         </DialogFooter>
           </DialogContent>
           
         </Dialog>
      <div className="w-full h-auto lg:h-[500px] p-12 mt-5">
        <img className="object-cover w-full h-full " src={data.banner} alt={data.name} />
      </div>
      <div className="p-4 text-white flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className=" font-bold text-xl mb-2">{data.name}</div>
          <p className=" text-base">{data.description}</p>
        </div>
        <div className="mb-8">
          <div className="flex items-center">
            <img className="w-10 h-10 rounded-full mr-4" src={data.clubDetails?.clubLogo} alt={data.clubDetails?.clubName} />
            <div className="text-sm">
              <p className=" leading-none">{data.clubDetails?.clubName}</p>
            </div>
          </div>
          <p className="text-gray-600">{data.location}</p>
          <p className="text-gray-600">{new Date(data.dateTime).toLocaleString()}</p>
          <p className="text-gray-600">Category: {data.category}</p>
        </div>
        <div className="flex items-center">
          <p className={`text-sm ${data.isFull ? 'text-red-500' : 'text-green-500'}`}>
            {data.isFull ? 'Full' : 'Available'}
          </p>
          <p className="text-sm text-gray-600 ml-4">Registrations: {data.totalRegistrations}/{data.maxCapacity}</p>
        </div>
      </div>

  
     

    </div>
    {/* Tables */}
    <div className="container mx-auto py-10">
      <p className='text-center font-bold text-lg text-white b-5'>Registration requests</p>
      <DataTable loading={isRequestsLoading} pagination = {pagination} count={registrationRequestCount} onPaginationChange={onPaginationChange} columns={columns} data={registrationRequests} />
    </div>

    {/* <div className="container mx-auto py-10">
      <p className='text-center font-bold text-lg text-white b-5'>RSVP's</p>
      <DataTable columns={rsvpColumns} data={rsvpData} />
    </div> */}
            </div>
        )}
        </>
    )}
    </>
  )
}

export default Page