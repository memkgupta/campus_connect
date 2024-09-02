"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";





export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
const queryClient = new QueryClient()
const router = useRouter()
const {data:session,status} = useSession();
useEffect(()=>{
  if(!session?.user&&status!="loading"){
router.replace("/auth/sign-in")
  }
},[session])
    return (
        <QueryClientProvider client={queryClient}>
 {children}
        </QueryClientProvider>
    
    );
  }