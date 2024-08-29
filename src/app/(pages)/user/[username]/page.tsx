"use client"
import React, { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { CircleFadingPlus, Github, Instagram, Linkedin, Loader2, LogOutIcon, Pencil, Plus, PlusIcon, Trash, X } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { validateURL } from '@/utils/validator';
import Image from 'next/image';
import { setDate } from 'date-fns';
import { Card, CardHeader } from '@/components/ui/card';
function Page( {params}:{params:{username:string}}) {

  
const [userDetails,setUserDetails] = useState({
profile:'',
username:'',
socials:[''],
name:'',
bio:'',
interests:[''],
})

const [isLoading,setIsLoading] = useState(true);


  const {toast} = useToast();

const router = useRouter()

const [error,setError] = useState(false);
const {data:session,status} = useSession();







const icon = (link:string)=>{
  try {
    // Create a new URL object
    const urlObj = new URL(link);

    // Get the hostname (e.g., 'www.example.com')
    let hostname = urlObj.hostname;

    // Remove 'www.' if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    // Split the hostname into parts by '.' and return the first part
    const domainParts = hostname.split('.');
    const brandName = domainParts[0];

    return `/${brandName}.png`;
  } catch (error) {
    // Handle invalid URL or other errors
    console.error('Invalid URL:', error);
    return '';
  }
}




useEffect(()=>{
    const fetchUserDetails = async()=>{
        const username = params.username
    //  console.log(session)
        try {
      const res = await axios.get(`/api/users`,{params:{username:username}});
      setUserDetails(res.data.data);
        } catch (error:any) {
           
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
    }

    fetchUserDetails();
},[])

useEffect(()=>{
    if(session){
         
        if(userDetails.username===session.user.username){
            router.replace("/account")
        }
    }
},[session])

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
     
        
      </div>
         <div className='flex flex-col mt-24 ml-10'>
           <p className='font-bold text-white md:text-2xl sm:text-lg'>{userDetails.name}</p>
           <p className='font-semibold text-gray-600 '>@{userDetails.username}</p>
           <p className='mt-3 md:text-lg sm:text-sm'>{userDetails.bio}</p>
           
           {/* {interests} */}
           <div className="flex gap-x-3 mt-1 items-center">
             {userDetails.interests?.map((interest,index)=>(
             <div className='w-fit p-1 rounded-full bg-gray-800 text-white text-xs'>#{interest}</div>
             ))}
       
           </div>
           {/* socials */}
           
          
           <div className="flex gap-x-3 mt-3 items-center">
             {userDetails.socials?.map((social,index)=>(
              <Link href={social} key={social}>{<img alt='' src={icon(social)} className='max-w-8 max-h-8'></img>}</Link>
             ))}
       
           </div>
         
         </div>
         </div>

         {/* Cards */}
         <div className="justify-self-stretch w-full grid md:grid-cols-2 gap-5 p-2">
         {/* Projects */}
         <Card
            className='bg-slate-950 text-white'
            >
                <CardHeader>Projects</CardHeader>
            </Card>
       
            <Card
            className='bg-slate-950 text-white'
            >
                <CardHeader>Contributions</CardHeader>
            </Card>
         
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

export default Page