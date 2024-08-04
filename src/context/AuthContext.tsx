"use client"
import { AuthContextProps, User } from "@/types";
import { ReactNode, createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {SessionProvider} from "next-auth/react"
import { HOST_URL } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
const AuthContext = createContext<AuthContextProps>({
    user: null,
    authStatus:false,
    logout: () => {},
  });

  export const AuthProvider= ({children}:{children:ReactNode})=>{

return(
    <SessionProvider>
{children}
    </SessionProvider>
  
   
)
  }