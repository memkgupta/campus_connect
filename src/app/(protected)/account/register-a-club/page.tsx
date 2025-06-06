"use client";
import { useSession } from "@/hooks/useSession";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Delete, Loader2, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { clubRegistrationSchema } from "@/schema/clubRegistrationSchema";
import axios, { AxiosError } from "axios";
import { Textarea } from "@/components/ui/textarea";

import { BACKEND_URL } from "@/constants";
import { ImageEditor as ImageSelector } from "@/components/imageSelector/image-selector";
import Cookies from "js-cookie";
const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(
        `/sign-in?next=${encodeURIComponent("/account/register-a-club")}`
      );
    }
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof clubRegistrationSchema>>({
    resolver: zodResolver(clubRegistrationSchema),
    defaultValues: {},
  });

  const handleSubmit = async (
    data: Zod.infer<typeof clubRegistrationSchema>
  ) => {
    setIsSubmitting(true);
    try {
      if (!preview) {
        toast({
          title: "Please upload an logo",
          variant: "destructive",
        });
        return;
      }

      const res = await axios.post(`${BACKEND_URL}/club/register`, {
        clubEmail: data.clubEmail,
        clubName: data.clubName,
        clubDescription: data.clubDescription,
        contactPhone: data.contactPhone,
        clubLogo: preview,
      },{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      }});
      if (res.data.success) {
        toast({
          title: "Club registered successfully verification pending",
          variant: "default",
        });
        router.push("/success");
      } else {
        toast({
          title: "Some error occured",
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.log(error);
      const message = axiosError.response?.data.message;
      toast({
        title: message || "Some error occured",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleProfileSelect = () => {
    if (preview) {
      setPreview(null);
    } else {
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="w-full max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-yellow-400">
              Register your club
            </h2>

            <div className="flex flex-col justify-center items-center">
             <ImageSelector isRound={true} preview={preview} setImage={(url)=>setPreview(url)} type="profile" />
            </div>
            {/* <ComboBox options={} stateSetter={setCollegeId}/> */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="clubEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <>
                        <Input
                          required
                          placeholder="email"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </>
                      <FormDescription>
                        Your club official Email id provided by college
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clubName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>

                      <Input
                        required
                        placeholder="Club Name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      <FormDescription>Club Name</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clubDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Description</FormLabel>

                      <Textarea
                        required
                        placeholder="Description of your club"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>

                      <Input
                        required
                        type="tel"
                        placeholder="Contact Phone"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      <FormDescription>
                        Contact phone number of club
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
                      Please wait
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
 