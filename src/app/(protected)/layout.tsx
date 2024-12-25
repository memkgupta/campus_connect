"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";





export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
const queryClient = new QueryClient()
const router = useRouter()
const {user,isAuthenticated,isLoading} = useSession();
useEffect(()=>{
  if(!user&&!isAuthenticated&&!isLoading){
router.replace("/auth/sign-in")
  }
},[user])
    return (
        <QueryClientProvider client={queryClient}>
 {children}
        </QueryClientProvider>
    
    );
  }