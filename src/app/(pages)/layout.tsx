"use client"

import { useSession } from "@/hooks/useSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";





export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
const queryClient = new QueryClient()
const {isLoading} = useSession();
    return (
        <QueryClientProvider client={queryClient}>

 {isLoading?(<div className="">
 <Loader2 className="animate-spin text-gray-400"/>
 </div>):(<>
 {children}
 </>) }
        </QueryClientProvider>
    
    );
  }