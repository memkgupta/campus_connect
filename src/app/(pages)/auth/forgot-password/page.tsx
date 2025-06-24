"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { BACKEND_URL, BACKEND_URL_V2 } from "@/constants"

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
})

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true)
    try {
        const req = await axios.post(`${BACKEND_URL}/auth/forgot-password`,{email:data.email});
      toast({
        title: "Reset Link Sent",
        description: `We have sent a password reset link to ${data.email}`,
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-indigo-500">
          Enter your email and we'll send you a reset link.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="text-white placeholder:text-indigo-300 bg-black border-indigo-700"
                    />
                  </FormControl>
                  <FormDescription className="text-indigo-500">
                    Use your registered college email
                  </FormDescription>
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Link href="/auth/sign-in" className="text-indigo-600 text-sm hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
