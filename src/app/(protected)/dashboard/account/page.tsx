"use client";
import React, { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/image";
import EditDialog from "@/components/account/EditDialog";
import SocialLinkDialog from "@/components/account/SocialLinkDialog";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import ErrorLoadingPage from "@/components/error-loading-page";
import { BACKEND_URL } from "@/constants";
import { useClub } from "@/hooks/useClubContext";

function Page() {
  const [userDetails, setUserDetails] = useState({
    profile: "",
    username: "",
    socials: [""],
    name: "",
    bio: "",
    interest: [""],
    courses: [],
    events: [],
    isClubAdmin: false,
  });

  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState(false);
  const { user, logout, isAuthenticated } = useSession();
  const clubContext = useClub();

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access-token")}`,
        },
      });

      if (res.data.success) {
        const user_data = res.data.data;
        setUserDetails(user_data);
        return user_data;
      }
    } catch (error) {
      setError(true);
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.status !== 500 && axiosError.response) {
        toast({
          title: axiosError.response?.data.message || "Some error occurred",
          variant: "destructive",
        });
        router.replace("/auth/sign-in");
      } else {
        toast({ title: "Some error occurred", variant: "destructive" });
      }

      return Promise.reject("Some error occured");
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: ["account-data"],
    queryFn: fetchUserData,
    refetchOnWindowFocus: false,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center w-full">
        <Loader2 size={40} className="animate-spin text-gray-700" />
      </div>
    );
  }

  if (error) return <ErrorLoadingPage />;

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen">
      <div className="relative w-full max-w-4xl bg-slate-800 rounded-md p-6 border-gray-100 shadow-md">
        {/* Profile Picture */}
        <div className="relative flex items-center gap-4 mb-4">
          <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-black bg-slate-500">
            {data.profile && (
              <CustomImage
                src={data.profile}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-2xl">{data.name}</p>
            <p className="text-gray-300 mt-1">{data.bio}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async () => await logout()}
              className="bg-yellow-300 hover:bg-yellow-400 text-black"
            >
              Logout <LogOutIcon className="ml-2" />
            </Button>
            <EditDialog setUserDetails={setUserDetails} userDetails={userDetails} />
          </div>
        </div>

        {/* Socials + Buttons */}
        <div className="mt-4">
          <SocialLinkDialog
            userDetails={userDetails}
            setUserDetails={setUserDetails}
          />
          <div className="mt-6 flex gap-4 flex-wrap">
            {clubContext.clubs.length > 0 && (
              <Link
                className="bg-yellow-300 hover:bg-yellow-400 rounded-md px-4 py-2 text-black text-sm"
                href="/account/club"
              >
                Your Club
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                className="bg-yellow-300 hover:bg-yellow-400 rounded-md px-4 py-2 text-black text-sm"
                href="/admin/dashboard"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
