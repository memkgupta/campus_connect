"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useDebounceCallback, useDebounceValue} from "usehooks-ts"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schema/signupSchema'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import { BACKEND_URL } from '@/constants'
import OverlayLoader from '@/components/ui/overlay-loader'
function page() {
  // const [email,setEmail] = useState<string>("");
  const[username,setUsername] = useState('')
  const [isUsernameChecking,setIsUsernameChecking] = useState(false);
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isSubmitting,setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername,500)
  const {toast} = useToast()
  const router = useRouter();
  //zod 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })
const {isAuthenticated} = useSession();
  useEffect(()=>{
const checkUsername = async()=>{
  if(username!=""){
    setIsUsernameChecking(true);
    setUsernameMessage('');
    try {
     const response = await axios.get(`${BACKEND_URL}/username-valid-check?username=${username}`)
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
  },[username])

  const handleSubmit = async(data:Zod.infer<typeof signUpSchema>)=>{
setIsSubmitting(true);
try {
 const res = await axios.post(`${BACKEND_URL}/auth/sign-up`,data)
 toast({title:"Success",description:res.data.message})
 router.replace(`/auth/verify/${username}`);
 setIsSubmitting(false);
} catch (error) {
  console.error("Error in signup of user",error)
  const axiosError = error as AxiosError<any>;
  let errorMessage = axiosError.response?.data.message
  toast({title:'Signup Failed',description:errorMessage,variant:'destructive'})
  setIsSubmitting(false);
}
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
   <OverlayLoader show={isSubmitting}/>
    <div className="w-full max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-yellow-400">Sign Up</h2>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name='name'
          render={({field})=>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              
                <Input  placeholder='name' {...field} onChange={(e)=>{
                  field.onChange(e);
                }}/>
                <FormDescription>
                  Your Name
                </FormDescription>
             
            </FormItem>
          )}/>
        
          <FormField
          control={form.control}
          name='username'
          render={({field})=>(
            <FormItem>
              <FormLabel>Username</FormLabel>
              
                <Input  placeholder='username' {...field} onChange={(e)=>{
                  field.onChange(e);debounced(e.target.value)
                }}/>
                <FormDescription>
                  Your Username
                </FormDescription>
             {isUsernameChecking && <Loader2 className='animate-spin' color='gray'/>}
             {usernameMessage!=""&&(<p className={`text-sm ${usernameMessage=="Username is valid"?'text-green-400':'text-red-400'}`}>{usernameMessage}</p>)}
            </FormItem>
          )}/>
       
        
        <FormField
          control={form.control}
          name='email'
          render={({field})=>(
            <FormItem>
              <FormLabel>Email</FormLabel>
            
               <>
               <Input  placeholder='email' {...field} onChange={(e)=>{
                  field.onChange(e)
                }}/>
              
               </>
                <FormDescription>
                  Your College Email
                </FormDescription>
          
            </FormItem>
          )}/>
      
       
        <FormField
          control={form.control}
          name='password'
          render={({field})=>(
            <FormItem>
              <FormLabel>Password</FormLabel>
              
                <Input  placeholder='password' {...field} onChange={(e)=>{
                  field.onChange(e)
                }}/>
                <FormDescription>
                  Your Password
                </FormDescription>
             
            </FormItem>
          )}/>
        
       
          <Button
            type="submit" disabled={isSubmitting}
            className="w-full px-4 py-2 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {isSubmitting?(<>
              <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
              Please wait
              </> ):("Sign Up")}
          </Button>
       
        </form>
      </Form>
      <div className='flex justify-center'><Link className='text-indigo-600' href={"/auth/sign-in"}>Already have an account ? Log in</Link></div>
    </div>
  </div>
  )
}

export default page