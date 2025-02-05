"use client"
import React, { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from 'react'
// import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import ErrorLoadingPage from '@/components/error-loading-page';


import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { validateURL } from '@/utils/validator';

import { Card, CardHeader } from '@/components/ui/card';
import {useSession} from '@/hooks/useSession';
import { BACKEND_URL } from '@/constants';
import NoResourceFound from '@/components/no-resource-found-card';
import HorizontalProjectCard from '@/components/projects/horizontal-project-card';
import HorizontalResourceCard from '@/components/resources/horizontal-resource-card';
import CustomImage from '@/components/ui/image';
import { Loader2 } from 'lucide-react';
function Page( {params}:{params:{username:string}}) {

  
// const [userDetails,setUserDetails] = useState({
// profile:'',
// username:'',
// socials:[''],
// name:'',
// bio:'',
// interests:[''],
// })

const [isLoading,setIsLoading] = useState(true);


  const {toast} = useToast();

const router = useRouter()

const [error,setError] = useState(false);
const {user,isAuthenticated} = useSession();
const icon = (link:string)=>{
  try {
    const urlObj = new URL(link);
    let hostname = urlObj.hostname;
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
const fetchUserDetails = async()=>{
  const username = params.username
  try {
const res = await axios.get(`${BACKEND_URL}/users`,{params:{username:username}});
// setUserDetails(res.data.data);
return res.data.data;
  } catch (error:any) {
    return  Promise.reject(error);
  }
  finally{
      setIsLoading(false);
  }
}
const fetchUserProjects = async()=>{
  try {
    const res = await axios.get(`${BACKEND_URL}/users/projects`,{params:{uid:userDetails._id,page:1,limit:4}})
    return res.data.projects;
  } catch (error) {
    
    return Promise.reject(error);
  }
}
const fetchUserContributions = async()=>{
  try {
    const res = await axios.get(`${BACKEND_URL}/users/projects`,{params:{uid:userDetails._id,page:1,limit:4}})
    return res.data.contributions;
  } catch (error) {
    return Promise.reject(error);
  }
}
const {data:userDetails,isFetching} = useQuery({
  queryKey:[params.username,'user-data'],
  queryFn:fetchUserDetails,
  refetchOnWindowFocus:false,
  retry:false
})

const {data:projects,isFetching:projectsLoading} = useQuery({
  queryKey:['project-users'],
  queryFn:fetchUserProjects,
  retry:false,
  refetchOnWindowFocus:false,
  enabled:!!userDetails?._id
})
const {data:contributions,isFetching:contributionsLoading} = useQuery({
  queryKey:['contribution-users'],
  queryFn:fetchUserContributions,
  retry:false,
  refetchOnWindowFocus:false,
  enabled:!!userDetails?._id
})
useEffect(()=>{
    if(isAuthenticated && user){
         
        if(params.username===user.username){
            router.replace("/account")
        }
    }
    
},[user,isAuthenticated])

    return (
     <>
     {!isFetching?(
       <>
       {!error?(
         <div className="flex flex-col w-full items-center justify-center min-h-screen">
 
         <div className='relative w-2/3 bg-slate-800 rounded-md  border-gray-100'>
         <div className='z-10 absolute top-20 left-5 rounded-full min-w-[100px] min-h-[100px] md:min-w-[200px] md:min-h-[200px] bg-slate-500 border-2 border-black'>
          {userDetails.profile&&
          <CustomImage src={userDetails.profile} className='w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full'/>}
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
             {userDetails.interests?.map((interest:string,index:number)=>(
             <div className='w-fit p-1 rounded-full bg-gray-800 text-white text-xs'>#{interest}</div>
             ))}
       
           </div>
           {/* socials */}
           
          
           <div className="flex gap-x-3 mt-3 items-center">
             {userDetails.socials?.map((social:string,index:number)=>(
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
                <div>
                  {projectsLoading ? (<>
                  <Loader2 className='animate-spin text-gray-500'/>
                  </>) :(
                    <div>
                      {
                        projects &&projects.length>0?(
                          projects.map((project:any)=>(
                            <HorizontalProjectCard
                            data={
                             project
                            }
                            />
                          ))
                        ):(
                          <NoResourceFound/>
                        )
                      }
                    </div>
                  )}
                </div>
            </Card>
       
            <Card
            className='bg-slate-950 text-white'
            >
                <CardHeader>Contributions</CardHeader>
                <div>
                  {contributionsLoading ? (<>
                  <Loader2 className='animate-spin text-gray-500'/>
                  </>) :(
                    <div>
                      {
                        contributions &&contributions.length>0?(
                         contributions.map((contribution:any)=>(
                            <HorizontalResourceCard
                            data={
                             contribution
                            }
                            />
                          ))
                        ):(
                          <NoResourceFound/>
                        )
                      }
                    </div>
                  )}
                </div>
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