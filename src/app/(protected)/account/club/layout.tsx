"use client"
import { ClubContextProvider } from "@/context/ClubContext";
import React from "react";

export default function ClubLayout({children}:Readonly<{
    children:React.ReactNode
}>){
    return(
      <ClubContextProvider>
{children}
      
      </ClubContextProvider>

        
    )
}