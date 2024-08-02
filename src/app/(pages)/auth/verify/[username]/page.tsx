"use client"
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
function page() {
    const router = useRouter();
    const params = useParams<{username:string}>();
    const {toast} = useToast();
    const [isSubmitting,setIsSubmitting] = useState(false);

    const username = params.username;
    const FormSchema = z.object({
        code: z.string().min(6, {
          message: "Your one-time password must be 6 characters.",
        }),
      })

   
        const form = useForm<z.infer<typeof FormSchema>>({
          resolver: zodResolver(FormSchema),
          defaultValues: {
           code: "",
          },
        })
   async function onSubmit(data: z.infer<typeof FormSchema>) {
      setIsSubmitting(true);
      console.log(data.code)
if(data.code&&data.code!=""){
  try {
  const res = await axios.post(`/api/users/verify`,{username:username,otp:data.code});
  if(res.data.success){
    toast({
      title:"Success",
      description:"User verified successfully",
      variant:'default',
      color:"green"
    });
    router.replace("/auth/sign-in")
  }
  else{
    toast({
      title:"Verification failed",
      description:res.data.message,
      variant:'default',
      color:"red"
    })
  }
  } catch (error) {
    const axiosError = error as AxiosError<any>
   
    toast({
      title:"Error",
      description:axiosError.response?.data?.message,
      variant:"destructive"
    })
  }
finally{
  setIsSubmitting(false);
}
}
     
      }
  return (
   <div className='flex items-center justify-center min-h-screen bg-black'>
   <div className='max-w-sm md:max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-lg'>
   <h2 className="text-2xl font-bold text-center text-yellow-400">Verify Email</h2>
   <Form {...form} >
    <form onSubmit={form.handleSubmit(onSubmit)} className="text-yellow-400 space-y-6">
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Verification code</FormLabel>
            <FormControl>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormDescription>
              Please enter the verification code sent to your college email id.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button disabled={isSubmitting} className='text-yellow-300' type="submit">{
isSubmitting?(<>
<p className='text-gray-700'>Verifying</p> <Loader2 className='animate-sping'/>
</>):("Submit")
}</Button>
    </form>
  </Form>
   </div>
   </div>
  )
}

export default page