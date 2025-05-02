"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/lib/hooks";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageEditor } from "@/components/imageSelector/image-selector";
import React, { forwardRef, useEffect } from "react";
import Loader from "@/components/Loader";

// Zod Schema for Validation
const formSchema = z.object({
  clubEmail: z.string().email("Invalid email").min(1, "Email is required"),
  clubDescription: z.string().min(10, "Description should be at least 10 characters"),
  clubLogo: z.string().url("Invalid logo URL"),
  contactPhone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  clubName: z.string().min(3, "Club name should be at least 3 characters"),
  isVerified: z.boolean(),
});

type ClubFormValues = z.infer<typeof formSchema>;

const ConfigPage = ()=> {
    const {details} = useAppSelector(state=>state.club)
 
  const form = useForm<ClubFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:details.data
  });

  const onSubmit = (data: ClubFormValues) => {
    console.log("Form Data:", data);
    toast({ title: "Club Registered Successfully!", description: "Your club has been added." });
  };
useEffect(()=>{
if(details.data.clubEmail){
    form.setValue("clubEmail",details.data.clubEmail);
    form.setValue("clubLogo",details.data.clubLogo!);
    form.setValue("clubDescription",details.data.clubDescription!);
    form.setValue("clubName",details.data.clubName!);
    form.setValue("contactPhone",details.data.contactPhone!)
}
},[details])
  return (
    <>
       {details.isLoading?<Loader></Loader>:<Card className="max-w-xl mx-auto mt-10 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Edit your club details</CardTitle>
      </CardHeader>
      <CardContent className="">
    
                    <ImageEditor isRound preview={form.getValues().clubLogo} setImage={(url)=>{form.setValue("clubLogo",url)}} type="profile"  />
                  
        <Form {...form} >
        
            
          {/* Club Name */}
          <FormField control={form.control} name="clubName" render={({field})=>{
            return(
                <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )
          }} />
            

          {/* Club Email */}
          <FormField control={form.control} name="clubEmail" render={({field})=>{
            return(
                <FormItem>
                <FormLabel>Club Email</FormLabel>
                <FormControl>
                  <Input placeholder="Registered Email" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )
          }} />
            

          {/* Club Description */}
          <FormField control={form.control} name="clubDescription" render={({field})=>{
            return(
                <FormItem>
                <FormLabel>Club description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Club Description" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )
          }} />
            

    
        

          {/* Contact Phone */}
          <FormField control={form.control} name="contactPhone" render={({field})=>{
            return(
                <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Contact Phone Number" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )
          }} />
            

         
          {/* Submit Button */}
          <div className="col-span-2 flex justify-center mt-12">
          <Button type="submit" className="w-full">Save Changes</Button>
          </div>
      
        </Form>
      </CardContent>
    </Card>}
    </>
 
  );
}

export default ConfigPage;