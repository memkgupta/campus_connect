import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { useToast } from '../ui/use-toast';
import axios, { AxiosError } from 'axios';
import { validateURL } from '@/utils/validator';
import { useDebounceCallback } from 'usehooks-ts';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
const SocialLinkDialog = ({userDetails,setUserDetails}:{userDetails:any,setUserDetails:any}) => {
const {toast} = useToast();
    const [isNotValidURL,setIsNotValidURL] = useState(true);
    const[socialLink,setSocialLink] = useState<string>('');

const handleAddLink =async ()=>{
  if(isNotValidURL){
    toast({
      title:"Not a valid url",
      variant:'destructive'
    })
    return;
  }
  
    try {
  
     
     const res = await axios.put(`${BACKEND_URL}/auth/update`,{social_links:socialLink},{headers:{
      "Authorization":`Bearer ${Cookies.get("access-token")}`
     }});
    if(res.data.success){
      toast({title:"Link added successfully"});
    }
    setUserDetails({...userDetails,socials:[...userDetails.socials,socialLink]})
  setSocialLink('');
  setIsNotValidURL(true)
  
    } catch (error) {
      const axiosError  = error as AxiosError<any>;
      if(axiosError.response?.data){
        const message = axiosError.response.data.message;
        toast({title:message,variant:'destructive'})
      }
  }
}
const socialLinkDebounced = useDebounceCallback(setSocialLink,500);
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
    if(validateURL(socialLink)){
  setIsNotValidURL(false);
    }
    else{
      setIsNotValidURL(true);
    }
  },[socialLink])
  return (
    <div className="flex gap-x-3 mt-3 items-center">
             
             {userDetails.socials?.map((social:string,index:number)=>(
        <Link href={social} key={social}>{<img alt='' src={icon(social)} className='max-w-8 max-h-8'></img>}</Link>
       ))}
    <Dialog>
    <DialogTrigger>
    <Button className='rounded-full hover:bg-gray-700 p-1 w-10 h-10 border-2 border-gray-500 border-dashed bg-transparent text-gray-500'>    <Plus /></Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>Add Social Link</DialogHeader>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-2'>
 {!isNotValidURL&&<div className='rounded-full w-10 h-10 bg-yellow-200 flex items-center justify-center'><img src={icon(socialLink)} className='max-w-10 max-h-10'/></div>}
        <Input className='' placeholder='Please Enter the url'   onChange={(e)=>{socialLinkDebounced(e.target.value)}} type='url'/>

        </div>
    {isNotValidURL && <p className='text-red-500 text-xs'>Please enter a valid url</p>}
    {!isNotValidURL && <Button onClick={handleAddLink} className='bg-yellow-300 hover:bg-yellow-400 text-black'>Add</Button>}
      </div>
     
    </DialogContent>
  </Dialog>
           </div>
  
  )
}

export default SocialLinkDialog