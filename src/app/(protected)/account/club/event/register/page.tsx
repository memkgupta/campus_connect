"use client"
import { ClubContext } from '@/context/ClubContext'
import { ChevronDownIcon, CircleX, Loader2, Trash } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import React, { useContext, useState } from 'react'
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { eventRegistrationSchema } from '@/schema/eventRegistrationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

import { eventCategories } from '@/constants';
import clsx from 'clsx';
import ComboBox from '@/components/ComboBox';
import { useToast } from '@/components/ui/use-toast';
import { UploadButton } from '@/utils/uploadthing';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
const Page = () => {
  const {toast} = useToast();
  const [date, setDate] = React.useState<Date>()
  const clubDetails = useContext(ClubContext);
  const [category,setCateg] = useState<NoInfer<{value:string,label:string,id:string}>|null>(eventCategories[0]);
const[isSubmitting,setIsSubmitting] = useState(false);
const router = useRouter();
const[banner,setBanner] = useState<string|null>(null);
  const form  = useForm<z.infer<typeof eventRegistrationSchema>>({
    resolver:zodResolver(eventRegistrationSchema),
   
  });
  const [participantsFromOutsideAllowed,setParticipantFromOutsideAllowed] = useState(false);
  const [isHovered,setIsHovered] = useState(false);
  const handlesubmit = async(data:Zod.infer<typeof eventRegistrationSchema>)=>{
    // console.log(data);
    setIsSubmitting(true);
   if(!clubDetails){
    toast({title:'Invalid request',variant:'destructive'})
    return;
   }
   if(!category){
    toast({title:'Please Select a category',variant:'destructive'})
    return;
   }
    const reqData = {
      clubId:clubDetails._id,
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
     router.replace(`/account/club/event/${data.id}`)
      }
      else{
        toast({title:data.message,variant:'destructive'})

      }
    } catch (error) {
      
    }
  console.log(reqData);
  }
  return (
    <div className='flex justify-center items-center p-5'>
{clubDetails ? (
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

<Form {...form}>
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
):
(
  <div className='bg-slate-800 h-[200px] items-center text-center flex justify-center flex-col gap-5 p-10'>
    <p className="font-bold text-xl text-gray-750"> Club Not Registered</p>
    <CircleX size={50} className='text-gray-700'/>
   <Link href={"/account/register-a-club"} className='text-indigo-700 text-center'>Register Now your club</Link>
  </div>
)}
    </div>
  )
}

export default Page