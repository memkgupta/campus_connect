"use client"

import { ContributorContextProvider } from "@/context/ContributorContext";



export default function ContributorsLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return (
        <ContributorContextProvider>
 {children}
        </ContributorContextProvider>
    
    );
  }