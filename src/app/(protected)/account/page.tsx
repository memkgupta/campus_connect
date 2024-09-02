"use client"
import React, { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { CircleFadingPlus, Github, Instagram, Linkedin, Loader2, LogOutIcon, Pencil, Plus, PlusIcon, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';



import { Input } from '@/components/ui/input';
import { editProfileSchema } from '@/schema/editProfileSchema';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import ErrorLoadingPage from '@/components/ErrorLoadingPage';

import { useDebounceCallback } from 'usehooks-ts';

import ActiveCourse from '@/components/ActiveCourse';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { validateURL } from '@/utils/validator';
import Image from 'next/image';
import EditDialog from '@/components/account/EditDialog';
import SocialLinkDialog from '@/components/account/SocialLinkDialog';
function Page( ) {
const [userDetails,setUserDetails] = useState({
  profile:'',
  username:'',
  socials:[''],
  name:'',
  bio:'',
   interest:[''],
   courses:[],
   events:[],
   isClubAdmin:false,
})
// const clubContextData = useContext(Cl)
const [isLoading,setIsLoading] = useState(true);
 
 
  const {toast} = useToast();

const router = useRouter()

const [error,setError] = useState(false);



  const {data:session,status} = useSession();
  


  const fetchUserData = async () => {
    try {
      const res = await axios.get(`/api/users/me`);
  
      if (res.data.success) {
        setUserDetails(res.data.data);
        // setPreview(res.data.data.profile);
        console.log(res.data.data);
        // form.reset(res.data.data);
        return res.data;
      }
    } catch (error) {
      setError(true);
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.status !== 500 && axiosError.response) {
        toast({
          title: axiosError.response?.data.message || "Some error occurred",
          variant: 'destructive'
        });
        router.replace("/auth/sign-in");
      } else {
        toast({
          title: 'Some error occurred',
          variant: 'destructive'
        });
      }
    
    
      return Promise.reject("Some error occured");
    } finally {
      setIsLoading(false);
    }
  };



const {data} = useQuery({
  queryKey:[],
  queryFn:fetchUserData
})

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
         
      <div className='absolute top-10 right-10 flex gap-3'>
      <Button onClick={()=>{signOut({callbackUrl:"/auth/sign-in"})}} className=' bg-yellow-300 hover:bg-yellow-400 ' >Logout <LogOutIcon/></Button>
        <EditDialog setUserDetails={setUserDetails} userDetails={userDetails}/>
      </div>
         <div className='flex flex-col mt-24 ml-10'>
           <p className='font-bold text-white md:text-2xl sm:text-lg'>{userDetails.name}</p>
           <p className='mt-3 md:text-lg sm:text-sm'>{userDetails.bio}</p>
           {/* socials */}  <SocialLinkDialog userDetails={userDetails} setUserDetails={setUserDetails}/>
           
           {userDetails.isClubAdmin && <Link className='bg-yellow-300 hover:bg-yellow-400 rounded-md p-2 text-black w-fit mt-4 justify-self-end' href={"/account/club"}>Your Club</Link>}   
         </div>
         </div>

         {/* Cards */}
         <div className="justify-self-stretch w-full grid md:grid-cols-4 gap-5 p-2">
          {/* Quick actions */}
          <div className='w-full col-span-2 md:col-span-1 flex p-2 md:flex-col flex-row gap-x-4 gap-y-3 justify-center  bg-slate-900 rounded-md'>
            <Link className='sm:w-1/3 md:w-full text-center py-2 text-black rounded-md bg-yellow-300 hover:bg-yellow-400 text-xs'  href={"/account/projects/add-a-project"}>Add a project</Link>
            <Link className='sm:w-1/3 md:w-full text-center py-2 text-black rounded-md bg-yellow-300 hover:bg-yellow-400 text-xs' href={"/account/bookmarks"}>Bookmarks</Link>
            <Link className='sm:w-1/3 md:w-full text-center py-2 text-black rounded-md bg-yellow-300 hover:bg-yellow-400 text-xs' href={"/account/contributions"}>Contribute</Link>
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