"use client"
import React, { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Github, Instagram, Linkedin, Loader2, Pencil, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as z from "zod"
import { DialogClose } from '@radix-ui/react-dialog';
import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form,FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { editProfileSchema } from '@/schema/editProfileSchema';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import ErrorLoadingPage from '@/components/ErrorLoadingPage';
import { Label } from '@/components/ui/label';
import { useDebounceCallback } from 'usehooks-ts';
import { UploadButton } from '@/utils/uploadthing';
import ActiveCourse from '@/components/ActiveCourse';
import { useQuery } from '@tanstack/react-query';
function Page( ) {
const [userDetails,setUserDetails] = useState({
  profile:'',
  username:'',
  name:'',
  bio:'',
   interest:[''],
   courses:[],
   events:[],
   isClubAdmin:false,
})
// const clubContextData = useContext(Cl)
const [isLoading,setIsLoading] = useState(true);
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver:zodResolver(editProfileSchema),
    defaultValues:{
      username:userDetails.username,
      name:userDetails.name,
      bio:userDetails.bio,
      interests:userDetails.interest,
      // profile:userDetails.profile
    
    }
  })
  const {toast} = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [preview, setPreview] = useState<any>(userDetails.profile!=''?userDetails.profile:null);

const [isSubmitting,setIsSubmitting] = useState(false);
const[currentInterest,setCurrentInterest] = useState('');
const [error,setError] = useState(false);
const [isUsernameValid,setIsUsernameValid] = useState(true);
const [username,setUsername] = useState(userDetails.username);
const handleSubmit = async(data:Zod.infer<typeof editProfileSchema>)=>{
setIsSubmitting(true)
  try {
   const res = await axios.put(`/api/users/update`,data);
  if(res.data.success){
    toast({title:"Details updated successfully"});
  }

  } catch (error) {
    const axiosError  = error as AxiosError<any>;
    if(axiosError.response?.data){
      const message = axiosError.response.data.message;
      toast({title:message,variant:'destructive'})
    }
    
  }
  finally{
    setIsSubmitting(false);
  }
}
const handleProfileSelect = ()=>{
  if(preview){
setPreview(null);

  }
  else{
   
  }
    
}
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  setCurrentInterest(e.target.value);
};
const removeInterest = (value:string)=>{
const filteredInterests = userDetails.interest.filter(item=>item!=value);
setUserDetails({...userDetails,interest:filteredInterests}) 
}
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === ' ') {
    if(!userDetails.interest.includes(currentInterest.trim())){
      if (currentInterest.trim()) {
        setUserDetails({...userDetails,interest:[...userDetails.interest,currentInterest]});
        setCurrentInterest('');
      }
    }
    else{
      toast({
        title:'Interest already added',
        variant:'default'
      })
    }
  }
};
const[isUsernameChecking,setIsUsernameChecking] = useState(false);
const [usernameMessage,setUsernameMessage] = useState('');
  const {data:session,status} = useSession();
  const debounced = useDebounceCallback(setUsername,500);
  useEffect(()=>{
    axios.get(`/api/users/me`)
    .then(res=>{
if(res.data.success){
setUserDetails(res.data.data);
setPreview(res.data.data.profile)
console.log(res.data.data)
form.reset(res.data.data);
}

    })
    .catch((error:AxiosError<any>)=>{
      setError(true);
      if(error.response?.status!==500&&error.response){
        toast({
          title:error.response?.data.message||"Some error occured",
          variant:'destructive'
        })
      }
    else{
      toast({
        title:'Some error occured',
        variant:'destructive'
      })
    }

    })
    .finally(()=>{
      setIsLoading(false);
    })
  },[])
useEffect(()=>{
  const checkUsername = async()=>{
    if(username!=""){
      setIsUsernameChecking(true);
      setUsernameMessage('');
      try {
       const response = await axios.get(`/api/users/username-valid-check?username=${username}`)
       setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.log(axiosError.response?.data?.message)
        setUsernameMessage(axiosError.response?.data?.message??"Error Checking username");
      }
      finally{
        setIsUsernameChecking(false)
        
      }
    }
  }
   checkUsername();
  }
,[username])

  if (status==="authenticated") {
    return (
     <>
     {!isLoading?(
       <>
       {!error?(
         <div className="flex flex-col w-full items-center justify-center min-h-screen">
 
         <div className='relative w-2/3 bg-slate-800 rounded-md  border-gray-100'>
         <div className='z-10 absolute top-20 left-5 rounded-full min-w-[100px] min-h-[100px] md:min-w-[200px] md:min-h-[200px] bg-slate-500 border-2 border-black'>
          {userDetails.profile&&
          <img src={userDetails.profile} className='w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full'/>}
         </div>
         <div className="grid w-full">
            {/* banner */}
         <div className='justify-self-stretch  min-h-[150px] md:min-h-[200px] bg-slate-800/70 '>
         d
         </div>
         {/* details */}
         <div className='flex gap-4 relative bg-slate-900 min-h-[250px] rounded-b-md py-2'>
         
       
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
        setUserDetails({...userDetails,profile:res[0].url});
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
                     name='username'
                     render={({field})=>(
                       <FormItem>
                         <FormLabel>Username</FormLabel>
                       
                          <>
                          <Input   placeholder='username' {...field} onChange={(e)=>{
                             field.onChange(e);debounced(e.target.value)
                           }}/>
                          {isUsernameChecking && <Loader2 className='animate-spin' color='gray'/>}
                          {usernameMessage!=""&&(<p className={`text-sm ${usernameMessage=="Username is valid"?'text-green-400':'text-red-400'}`}>{usernameMessage}</p>)}
                          </>
                       
                     
                       </FormItem>
                     )}/>
                 
                  
                   <FormField
                     control={form.control}
                     name='name'
                     render={({field})=>(
                       <FormItem>
                         <FormLabel>Name</FormLabel>
                         
                           <Input  placeholder='name' {...field} onChange={(e:any)=>{
                             field.onChange(e)
                           }}/>
                           
                        
                       </FormItem>
                     )}/>
                   
                   <FormField
                     control={form.control}
                     name='bio'
                     render={({field})=>(
                       <FormItem>
                         <FormLabel>Bio</FormLabel>
                         
                           <Input  placeholder='bio' {...field} onChange={(e:any)=>{
                             field.onChange(e)
                           }}/>
                           
                        
                       </FormItem>
                     )}/>
                    
                   
<FormField 
control={form.control}
name='interests'
render={(field)=>(
  <FormItem>
    <Label className='mt-2'>Interests</Label>
                     <Input
                     
        type="text"
        value={currentInterest}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="px-2 border rounded w-full"
        placeholder="Type and press space to add"
      />
      <ul className="mt-4">
        {userDetails.interest.map((value) => (
          <li key={value.toLowerCase()} className="p-2 flex justify-between border-b">

            {value}
            <X size={20} className='cursor-pointer' onClick={(e)=>{removeInterest(value)}}/>
          </li>
        ))}
      </ul>
  </FormItem>
)}/>



                     <Button onClick={()=>{handleSubmit(form.getValues())}} type="submit" disabled={isSubmitting||(JSON.stringify(userDetails)===JSON.stringify(form.getValues()))} className='bg-yellow-300 hover:bg-yellow-400 text-black'  >
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
         <div className='flex flex-col mt-24 ml-10'>
           <p className='font-bold text-white md:text-2xl sm:text-lg'>{userDetails.name}</p>
           <p className='mt-3 md:text-lg sm:text-sm'>{userDetails.bio}</p>
           {/* socials */}
           <div className="flex gap-x-3 mt-3">
             <Link className='text-gray-700' href={"#"}><Instagram size={20}/></Link>
             <Link className='text-gray-700' href={"#"}><Github size={20}/></Link>
             <Link className='text-gray-700' href={"#"}><Linkedin size={20}/></Link>
           </div>
           {userDetails.isClubAdmin && <Link className='bg-yellow-300 hover:bg-yellow-400 rounded-md p-2 text-black w-fit mt-4 justify-self-end' href={"/account/club"}>Your Club</Link>}   
         </div>
         </div>

         {/* Cards */}
         <div className="justify-self-stretch w-full grid md:grid-cols-4 gap-5 p-2">
          {/* Quick actions */}
          <div className='w-full col-span-2 md:col-span-1 flex p-2 md:flex-col flex-row gap-x-4 gap-y-3 justify-center  bg-slate-900 rounded-md'>
            <Link className='sm:w-1/3 md:w-full text-center py-2 text-black rounded-md bg-yellow-300 hover:bg-yellow-400 text-xs'  href={"/projects/add-a-project"}>Add a project</Link>
            <Link className='sm:w-1/3 md:w-full text-center py-2 text-black rounded-md bg-yellow-300 hover:bg-yellow-400 text-xs' href={"/account/bookmarks"}>Bookmarks</Link>
            <Link className='sm:w-1/3 md:w-full text-center py-2 text-black rounded-md bg-yellow-300 hover:bg-yellow-400 text-xs' href={"/contribute"}>Contribute</Link>
          </div>
          {/* Active courses */}
          
          <div className='col-span-2 flex md:flex-col flex-row gap-4 bg-slate-900 rounded-md justify-center items-center'>
           <h2>Active courses</h2>
           {userDetails.courses.map((course:any)=>(
            <ActiveCourse data={course} key={course._id}/>
           ))}
          </div>
          
          {/* Upcoming events */}
          <div className='col-span-2 md:col-span-1 flex flex-col bg-slate-900 rounded-md justify-center items-center'>
          <h2>Upcoming events</h2>
          <p className='text-center mt-4 text-xl font-bold opacity-30'>Coming soon</p>
          {userDetails.events.map((event:any)=>(
            <Link href={`/events/${event._id}`} className='text-indigo-950'>{event.title}</Link>
          ))}
          </div>
         
         </div>
         </div>
       
         
         </div>
               </div>
       ):(
         <ErrorLoadingPage/>
       )}
       </>
     ):(
      <div className='min-h-[80vh] flex justify-center items-center w-full'>
        <Loader2 size={40} className='animate-spin text-gray-700'/>
      </div>
     )}
     </>
    );
  }
  else{
    return (
      "hello"
    )
  }
}

export default Page