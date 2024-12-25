"use client"
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useDebounceCallback, useDebounceValue} from "usehooks-ts"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInSchema, signUpSchema } from '@/schema/signupSchema'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Form,FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
// import {signIn, useSession} from "next-auth/react"
import { useSession } from '@/hooks/useSession'
import { AuthContext } from '@/context/AuthContext'
function Signin() {
    // const [email,setEmail] = useState<string>("");
    const[username,setUsername] = useState('')
   
    const [isSubmitting,setIsSubmitting] = useState(false);
  //  const {data:session} = useSession();
  const authContext = useContext(AuthContext)
    const {toast} = useToast()
    const router = useRouter();
    const searchParams = useSearchParams();
    //zod 
    const form = useForm<z.infer<typeof signInSchema>>({
      resolver:zodResolver(signInSchema),
      defaultValues:{
        identifier: '',
      password: '',
      }
    })
  
   
  
    const handleSubmit = async(data:Zod.infer<typeof signInSchema>)=>{
        console.log("data")
        setIsSubmitting(true)
        try {
          const res = await authContext?.login({email:data.identifier,password:data.password})

          toast({
              title:"Login Success",
              description:"User login success",
              variant:"default",
              color:'green'
          });
         
       
          setIsSubmitting(false)
        } catch (error) {
          toast({
            title:"Login failed",
            description:"Incorrect username or password",
            variant:"destructive",
            color:'red'
        });
        setIsSubmitting(false)
        }

 }

    
    useEffect(()=>{
      if(authContext?.user){
        router.replace("/account")
      }
    },[authContext])
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-yellow-400">Sign In</h2>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
         
          
            
         
          
          <FormField
            control={form.control}
            name='identifier'
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
                </> ):("Sign In")}
            </Button>
         
          </form>
        </Form>
        <div className='flex justify-center'><Link className='text-indigo-600' href={"/auth/sign-up"}>Don't have an account ? Sign up</Link></div>
      </div>
    </div>
  
      
    )
  }
function page(){
  return(
   
          <Suspense fallback={<div><Loader2 size={40} className='animate-spin text-gray-800'/></div>}>
<Signin/>
</Suspense>
   
  )
}
export default page