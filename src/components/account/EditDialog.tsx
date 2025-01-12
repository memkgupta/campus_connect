import { editProfileSchema } from "@/schema/editProfileSchema";
import axios, { AxiosError } from "axios";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { Button } from "../ui/button";
import { Loader2, Pencil, Trash, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
const EditDialog = ({
  userDetails,
  setUserDetails,
}: {
  userDetails: any;
  setUserDetails: any;
}) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [preview, setPreview] = useState<any>(
    userDetails.profile != "" ? userDetails.profile : null
  );
  const [username, setUsername] = useState(userDetails.username);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debounced =   useDebounceCallback(setUsername, 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentInterest, setCurrentInterest] = useState("");
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: userDetails.username,
      name: userDetails.name,
      bio: userDetails.bio,
      interests: userDetails.interest,
      // profile:userDetails.profile
    },
  });
  const handleSubmit = async (data: Zod.infer<typeof editProfileSchema>) => {
    setIsSubmitting(true);
    try {
      const reqData: any = { ...data };
      reqData.profile = preview;
      const res = await axios.put(`${BACKEND_URL}/auth/update`, reqData,{headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }});
      if (res.data.success) {
        toast({ title: "Details updated successfully" });
        queryClient.invalidateQueries({queryKey:['account-data']})
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.data) {
        const message = axiosError.response.data.message;
        toast({ title: message, variant: "destructive" });
      }
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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInterest(e.target.value);
  };
  const removeInterest = (value: string) => {
    const filteredInterests = userDetails.interest.filter(
      (item: string) => item != value
    );
    setUserDetails({ ...userDetails, interest: filteredInterests });
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      if (!userDetails.interest.includes(currentInterest.trim())) {
        if (currentInterest.trim()) {
          setUserDetails({
            ...userDetails,
            interest: [...userDetails.interest, currentInterest],
          });
          setCurrentInterest("");
        }
      } else {
        toast({
          title: "Interest already added",
          variant: "default",
        });
      }
    }
  };

  const checkUsername = async () => {
    if (username != "" && username != userDetails.username) {
      setIsUsernameChecking(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `${BACKEND_URL}/users/username-valid-check?username=${username}`
        );
        setUsernameMessage(response.data.message);
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.log(axiosError.response?.data?.message);
        setUsernameMessage(
          axiosError.response?.data?.message ?? "Error Checking username"
        );
        return Promise.reject("Some error occured");
      } finally {
        setIsUsernameChecking(false);
      }
    }
  };
  const { data: usernameData } = useQuery({
    queryKey: ["username",username],
    queryFn: checkUsername,
  });


  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <Button className=" bg-yellow-300 hover:bg-yellow-400 flex gap-3">
          Edit <Pencil size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center">
          <div
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
            className={`relative w-52 h-52 rounded-full ${
              !preview && "bg-gray-500"
            }`}
            onClick={handleProfileSelect}
          >
            {preview && (
              <img src={preview} className="w-52 h-52 rounded-full" />
            )}
            {isHovered && preview && (
              <div className="absolute cursor-pointer inset-0 rounded-full flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity">
                <Trash size={40} />
              </div>
            )}
          </div>
          <UploadButton
            className={`${preview && "hidden"} mt-2`}
            endpoint="fileUploader"
            onClientUploadComplete={(res) => {
              setPreview(res[0].url);
              setUserDetails({ ...userDetails, profile: res[0].url });
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 px-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                    {isUsernameChecking && (
                      <Loader2 className="animate-spin" color="gray" />
                    )}
                    {usernameMessage != "" && (
                      <p
                        className={`text-sm ${
                          usernameMessage == "Username is valid"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <Input
                    placeholder="name"
                    {...field}
                    onChange={(e: any) => {
                      field.onChange(e);
                    }}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>

                  <Input
                    placeholder="bio"
                    {...field}
                    onChange={(e: any) => {
                      field.onChange(e);
                    }}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={(field) => (
                <FormItem>
                  <Label className="mt-2">Interests</Label>
                  <Input
                    type="text"
                    value={currentInterest}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="px-2 border rounded w-full"
                    placeholder="Type and press space to add"
                  />
                  <ul className="mt-4">
                    {userDetails.interest.map((value: string) => (
                      <li
                        key={value.toLowerCase()}
                        className="p-2 flex justify-between border-b"
                      >
                        {value}
                        <X
                          size={20}
                          className="cursor-pointer"
                          onClick={(e) => {
                            removeInterest(value);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </FormItem>
              )}
            />

            <Button
              onClick={() => {
                handleSubmit(form.getValues());
              }}
              type="submit"
              disabled={
                isSubmitting ||
                JSON.stringify(userDetails) === JSON.stringify(form.getValues())
              }
              className="bg-yellow-300 hover:bg-yellow-400 text-black"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={isSubmitting}
              className="bg-red-300  hover:bg-red-400"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
