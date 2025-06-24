"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"

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
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import axios from "axios"
import { passwordSchema } from "@/schema/signupSchema"
import { BACKEND_URL } from "@/constants"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const userId = searchParams.get("id")
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    if (!token || !userId) {
      toast({
        title: "Invalid Link",
        description: "Reset token is missing or malformed.",
        variant: "destructive",
      })
      return 
    }

    setIsSubmitting(true)
    try {
      await axios.post(`${BACKEND_URL}/auth/reset-password`, {
        token,
        userId,
        newPass: data.password,
      })

      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password.",
      })

      router.replace("/auth/sign-in")
    } catch (err: any) {
      toast({
        title: "Reset Failed",
        description: err?.response?.data?.message || "Something went wrong",
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
          Reset Password
        </h2>
        <p className="text-sm text-center text-indigo-500">
          Set your new password below.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-black text-white border-indigo-700 placeholder:text-indigo-300"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-indigo-500">
                    Must be at least 6 characters.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-black text-white border-indigo-700 placeholder:text-indigo-300"
                      {...field}
                    />
                  </FormControl>
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
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
