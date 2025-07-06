'use client'
import React, { useContext, useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInSchema } from '@/schema/signupSchema'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { AuthContext } from '@/context/AuthContext'
import OverlayLoader from '@/components/ui/overlay-loader'

function Signin() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const authContext = useContext(AuthContext)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  })

  const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await authContext?.login({
        email: data.identifier,
        password: data.password
      })

      toast({
        title: "Login Success",
        description: "User login success",
        variant: "default",
        color: 'green'
      })

      router.replace(`/dashboard`)
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Incorrect username or password",
        variant: "destructive",
        color: 'red'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <OverlayLoader show={isSubmitting} />
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-yellow-400">Sign In</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name='identifier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder='email' {...field} />
                  <FormDescription>Your College Email</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='password'
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2/4 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormDescription>Your Password</FormDescription>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className='flex justify-center'>
          <Link className='text-indigo-600' href={"/auth/forgot-password"}>Forgot Password</Link>
        </div>
        <div className='flex justify-center'>
          <Link className='text-indigo-600' href={"/auth/sign-up"}>Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Signin
