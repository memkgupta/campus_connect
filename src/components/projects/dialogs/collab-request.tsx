"use client"
import { DialogForm, FieldConfig } from '@/components/form/dialog-form';
import { BACKEND_URL } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React from 'react'
import { z } from 'zod';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle,DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
const statusStyles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-500",
    Accepted: "bg-green-100 text-green-700 border-green-500",
    Rejected: "bg-red-100 text-red-700 border-red-500",
  };
  
  const statusIcons: Record<string, JSX.Element> = {
    Pending: <Clock className="w-5 h-5 text-yellow-700" />,
    Accepted: <CheckCircle className="w-5 h-5 text-green-700" />,
    Rejected: <XCircle className="w-5 h-5 text-red-700" />,
  };
const CollabRequestForm = ({project_id}:{project_id:string}) => {
    const fields: FieldConfig[] = [
        {
            name: "skills",
            label: "Skills",
            type: "text",
            placeholder: "Enter your skills (comma-separated)",
            validation: z.string(),
          },
          {
            name: "motive",
            label: "Motive",
            type: "text",
            placeholder: "Enter your motive",
            validation: z.string().min(1, "Motive is required"),
          },
          {
            name: "contact_no",
            label: "Contact Number",
            type: "text",
            placeholder: "Enter your contact number",
            validation: z.string().regex(/^\d{10}$/, "Invalid phone number (10 digits required)").optional(),
          },
          {
            name: "contact_email",
            label: "Contact Email",
            type: "email",
            placeholder: "Enter your email",
            validation: z.string().email("Invalid email format").optional(),
          },
      ];
// const {}
      const handleSubmit = async(data: Record<string, any>) => {
       try {
        const req = await axios.post(`${BACKEND_URL}/projects/collaborate/${project_id}`,
            data,
            {headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            }}
        )
        return true;
       } catch (error) {
        const axiosError = error as AxiosError<any>
        const message = axiosError.response?.data.message;
        toast({
            title:message||"Something went wrong",
            variant:"destructive"
        })
return false
       }
      };
      const fetchStatus = async()=>{
        try {
            const req = await axios.get(`${BACKEND_URL}/projects/collaborate/${project_id}`,{
                headers:{
                    "Authorization":`Bearer ${Cookies.get("access-token")}`
                }
            });
            return req.data.request;
        } catch (error) {
            toast({
                title:"Some error occured",
                variant:"destructive"
            })
            return Promise.reject(null);
        }
      }
      const {data:collabRequestStatus,isLoading} = useQuery({
        queryKey:['collab-request-status',project_id],
        queryFn:fetchStatus,
        retry:false,
        refetchOnWindowFocus:false,
      })
  return (
    <>
   {!isLoading && (collabRequestStatus?(
    
        <Dialog>
            <DialogTrigger  asChild>
                <Button className={"bg-yellow-400"}>Status</Button>
            </DialogTrigger>
            <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Status</DialogTitle>
          <DialogDescription>
           Your request status
          </DialogDescription>
        </DialogHeader>
       
         
        <div className="w-80 p-4 bg-white shadow-lg rounded-xl flex items-center gap-4 border">
      
      <div className="flex-1">
       
        <div className="flex items-center gap-2">
          {statusIcons[collabRequestStatus.status]}
          <span className={`px-3 py-1 text-sm font-semibold border rounded-lg ${statusStyles[collabRequestStatus.status]}`}>
            {collabRequestStatus.status}
          </span>
        </div>
      </div>
   
        </div>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
        </Dialog>
 
   ):(
    
    <DialogForm
    fields={fields}
    onSubmit={handleSubmit}
    triggerText="Open Form"
  />
   ))}
    </>
  )
}

export default CollabRequestForm