import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationDetailsSchema } from "../schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useEventRegistration } from "@/context/event_registration/EventRegistrationContext";
import { usePathname, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { BACKEND_URL_V2 } from "@/constants";
import { headers } from "next/headers";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";
import { useEventContext } from "@/context/EventContext";
export default function RegistrationDetailsForm() {
    const router = useRouter()
    const eventContext = useEventContext()
    const registrationContext = useEventRegistration()
    const pathName = usePathname()
    const {toast} = useToast()
  const form = useForm<z.infer<typeof registrationDetailsSchema>>({
    resolver: zodResolver(registrationDetailsSchema),
    defaultValues: {
      email: "",
      name: "",
      phoneNo: "",
      collegeDetails: {
        collegeName: "",
        year: 1,
      },
    },
  });

 async function onSubmit(data: z.infer<typeof registrationDetailsSchema>) {
 try{
    const req = await axios.post(`${BACKEND_URL_V2}/events/registrations/register`,{
        event_id:eventContext.data?._id,
        registrationDetails:data
    },
{headers:{
    "Authorization":`Bearer ${Cookies.get('access-token')}`
}})
const rid = req.data.id;
toast({
  title:"Registration started"
})
registrationContext.setData({...registrationContext.data,registrationId:rid,registrationDetails:data})
if(eventContext.data){
eventContext.setData({...eventContext.data,registered:rid})

}
 }
 catch(error:any)
 {
    const axiosError = error as AxiosError<any>
    const message = axiosError.response?.data.message || "Some error occured";
  toast({
    title:message,
    variant:"destructive"
  })
 }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="Your name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input placeholder="10-digit phone number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collegeDetails.collegeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College Name</FormLabel>
              <FormControl><Input placeholder="College name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collegeDetails.year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl><Input type="number" placeholder="Year" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  );
}

