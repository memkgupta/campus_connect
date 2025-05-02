"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StoreProvider from "../StoreProvider";
import { ClubContextProvider } from "@/context/ClubContext";





export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      
      staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
      refetchOnWindowFocus: false, // Avoid refetching on window focus
      refetchOnReconnect: false, // Avoid refetching on reconnect
    },
  },
}
)
const router = useRouter()
const {user,isAuthenticated,isLoading} = useSession();
useEffect(()=>{
  if(!user&&!isAuthenticated&&!isLoading){
router.replace("/auth/sign-in")
  }
},[user])
    return (
        <QueryClientProvider client={queryClient}>
          <ClubContextProvider>
<StoreProvider>
{children}
</StoreProvider>
</ClubContextProvider>
       

        </QueryClientProvider>
    
    );
  }