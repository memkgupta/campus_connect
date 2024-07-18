import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

type ClubContextProps = {
    _id:string,
    isVerified:boolean,
    name:string,
    logo:string
}

export const ClubContext = createContext<ClubContextProps|null>(null);

export const ClubContextProvider = ({children}:{children:React.ReactNode})=>{
    const router = useRouter();
    const [state,setState] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const {data:session,status} = useSession();
    const {toast} = useToast();
    useEffect(()=>{
if(session){
if(status==="authenticated"){
if(session.user){
    axios.get(`/api/club/get-club-details`)
    .then((res)=>{
        const data = res.data;
        if(!data.success){
            setState(null)
        }
        else{
            setState(data.data);
        }
    })
    .catch((error)=>{
        const axiosError = error as AxiosError<any>;
        if(axiosError.response?.data){
            toast({
                title:axiosError.response.data.message,
                variant:'destructive'
            })
        }
    })
}
}
else{
    router.replace("/sign-in")
}
}
return(()=>{})
},[session])
    return(
    <ClubContext.Provider value={state} >
      <>
      {isLoading?(
           <Loader2 className="animate-spin" size={40}/>
        ):
        ( {children})
        }
      </>
    </ClubContext.Provider>
   
)
}
