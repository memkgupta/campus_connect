"use client"
import { useSession } from 'next-auth/react'

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useDebounceCallback, useDebounceValue} from "usehooks-ts"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter} from 'next/navigation'
import { signInSchema, signUpSchema } from '@/schema/signupSchema'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CalendarIcon, CircleX, Loader2, Trash } from 'lucide-react'
import { ProjectSchema } from '@/schema/projectSchema'
import { Textarea } from '@/components/ui/textarea'
import { UploadButton } from '@/utils/uploadthing'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { PopoverContent } from '@radix-ui/react-popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
const Page = () => {
    const {data:session} = useSession()
    const router = useRouter();
    const form = useForm<z.infer<typeof ProjectSchema>>({
      resolver:zodResolver(signInSchema),
      defaultValues:{
       
      }
    })
  const handleSubmit = async(data:Zod.infer<typeof ProjectSchema>)=>{

  }
  const [start, setStart] = React.useState<Date>()
  const [end,setEnd] = React.useState<Date>()
  const [isHovered,setIsHovered] =  useState(false);
  const[repos,setRepos] = useState<{id:number,title:string,link:string}[]>([{id:1,title:'',link:''}])
  const [banner,setBanner] = useState<string|null>(null);
  const [isSubmitting,setIsSubmitting] = useState(false); 
  const [tag,setCurrentTag] = useState(''); 
  const [tags,setTags] = useState<string[]>([]);
  const[openForCollab,setOpenForCollab] = useState(false);
  const {toast} = useToast()
  const [currentlyWorking,setCurrentlyWorking] = useState(true);
  // const [currentTag,setCurrentTag]=us
  const handleKeyDown = (e:any) => {
    if (e.key === ' ') {
      if(!tags.includes(tag.trim())){
        if (tag.trim()) {
          setTags([...tags,tag]);
          setCurrentTag('')
         return true;
        }
      }
      else{
        toast({
          title:'Tag already added',
          variant:'default'
        });
        return false
      }
    }
  };
  useEffect(()=>{
if(!session?.user){
router.replace("/auth/sign-in")
}
    },[]);
  return (
    <div className='flex flex-col items-center gap-5 justify-center'>
        <p className="text-center text-xl font-bold">Showcase your project to your peers</p>

        <div className='w-2/3 flex flex-col items-center border border-white rounded-md p-12'>
      
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
<div className='w-full'>
<Form  {...form} >
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
         
          
            
         
          {/*title of project  */}
          <FormField
            control={form.control}
            name='title'
            render={({field})=>(
              <FormItem>
                <FormLabel>Title</FormLabel>
              
                 <>
                 <Input  placeholder='title' {...field} onChange={(e)=>{
                    field.onChange(e)
                  }}/>
                
                 </>
                  <FormDescription>
                    Your Project Title
                  </FormDescription>
            
              </FormItem>
            )}/>
        
         {/* description */}
          <FormField
            control={form.control}
            name='description'
            render={({field})=>(
              <FormItem>
                <FormLabel>Description</FormLabel>
                
                  <Textarea  placeholder='description' {...field} onChange={(e)=>{
                    field.onChange(e)
                  }}/>
                  <FormDescription>
                    Your Project Description
                  </FormDescription>
               
              </FormItem>
            )}/>
            {/* checkboxes */}
     <div className='flex justify-around'>
      <div className="flex gap-2">
      <Label>Open for collaborations</Label>
   <Switch
                      
checked={openForCollab}
onCheckedChange={(e)=>{setOpenForCollab(e)}}
                    />
      </div>
      <div className="flex gap-2">
      <Label>Currently Working</Label>
   <Switch
                      
checked={currentlyWorking}
onCheckedChange={(e)=>{setCurrentlyWorking(e)}}
                    />
      </div>
      </div>     
         {/* start and end */}
         <div className='flex justify-around'>
<div className='flex gap-2'>
<Label>Start</Label>
         <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !start && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {start ? format(start, "PPP") : <span>Pick Start date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={start}
          onSelect={setStart}
          initialFocus
        />
      </PopoverContent>
    </Popover>
</div>
{!currentlyWorking && (
  <div className='flex gap-2'>
  <Label>End</Label>
           <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !end && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {end ? format(end, "PPP") : <span>Pick End date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={end}
            onSelect={setEnd}
            initialFocus
          />
        </PopoverContent>
      </Popover>
  </div>
)}

         </div>
{/* tags */}

         <div className='flex gap-2 border border-white rounded-md'>
  <div className=' grid grid-cols-3 gap-x-2  m-2'>
  {tags.map(tag=>(
    <div key={tag} className='relative flex justify-center rounded-full w-full p-2  h-6 items-center text-[8px] bg-slate-600 '>
      <p>#{tag}</p>
      <div onClick={(e)=>{setTags(tags.filter(k=>k!==tag))}} className='absolute top-0 right-0 rounded-full cursor-pointer bg-slate-400'>
        <CircleX className='text-gray-900 ' size={10}/>
      </div>
    </div>
  ))}
  </div>
  <Textarea value={tag}  className='rounded-r-md focus-visible:ring-offset-0 border-0 focus-visible:ring-0' onChange={(e)=>{setCurrentTag(e.target.value)}} onKeyDown={(e)=>{handleKeyDown(e)}} />
  </div>
{/* Links */}
<div className='grid md:flex  gap-2 justify-around'>
<FormField
            control={form.control}
            name='live_link'
            render={({field})=>(
              <FormItem>
                <FormLabel>Live</FormLabel>
                
                  <Input className='w-[300px] md:w-[250px]' type='text'  placeholder='live link of project' {...field} onChange={(e)=>{
                    field.onChange(e)
                  }}/>
                  <FormDescription>
                    Your Project Live link
                  </FormDescription>
               
              </FormItem>
            )}/>
            <FormField
            control={form.control}
            name='demo'
            render={({field})=>(
              <FormItem>
                <FormLabel>Demo</FormLabel>
                
                  <Input className='w-[300px] md:w-[250px]' type='text'  placeholder='demo link of project' {...field} onChange={(e)=>{
                    field.onChange(e)
                  }}/>
                  <FormDescription>
                    Your Project Demo link
                  </FormDescription>
               
              </FormItem>
            )}/>
</div>
<div className='grid gap-2'>
  <Label className='mb-2'>Github Repos</Label>
  {repos.map((repo,index)=>(<div key={repo.id} className='flex gap-2'>
<Input type='text' value={repos[index].title} placeholder='Title' onChange={(e)=>{setRepos(prevRepos => [
      ...prevRepos.slice(0, index),
      { ...prevRepos[index],title:e.target.value},
      ...prevRepos.slice(index + 1)
    ])}} /> <Input value={repos[index].link} type='text' placeholder='Link' onChange={(e)=>{setRepos(prevRepos => [
      ...prevRepos.slice(0, index),
      { ...prevRepos[index],link:e.target.value},
      ...prevRepos.slice(index + 1)
    ])}}/>
    <Button onClick={()=>{setRepos(repos.filter(k=>repo.id!=k.id))}} className=' text-white bg-red-300 hover:bg-red-400'><Trash/></Button>
  </div>))}
  <Button onClick={()=>{console.log(repos.length);setRepos(pre=>[...pre,{id:repos.length+1,link:'',title:''}])}} className='text-black mt-2 bg-yellow-300 hover:bg-yellow-400'>Add</Button>
</div>

            <Button
              type="submit" disabled={isSubmitting}
              className="w-full px-4 py-2 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {isSubmitting?(<>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait
                </> ):("Sign In")}
            </Button>
         
          </form>
        </Form>
</div>
    
        </div>
    </div>
  )
}

export default Page