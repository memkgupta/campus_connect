"use client"

import Loader from "@/components/Loader";
import { useSession } from "@/hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";





export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
const queryClient = new QueryClient()
const {isLoading,isAuthenticated} = useSession();
const pathName = usePathname();
const router = useRouter()
if(isAuthenticated && pathName === "/") router.replace("/home")
    return (
        <QueryClientProvider client={queryClient}>

 {isLoading?(
 <Loader/>
 ):(<>
 {children}
 </>) }
        </QueryClientProvider>
    
    );
  }