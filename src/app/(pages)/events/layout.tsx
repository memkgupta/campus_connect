"use client"

import { EventContextProvider } from "@/context/EventContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";





export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
          <EventContextProvider>
{children}
          </EventContextProvider>
 
        </QueryClientProvider>
    
    );
  }