import { useToast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/constants";
import { useSession } from "@/hooks/useSession";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
type ClubContextProps = {
    _id:string,
    admin:string,
    name:string
}

export const ClubContext = createContext<ClubContextProps|null>(null);

export const ClubContextProvider = ({children}:{children:React.ReactNode})=>{
    const router = useRouter();
    const [state,setState] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const {isAuthenticated} = useSession();
    const {toast} = useToast();
    useEffect(()=>{
       
if(isAuthenticated){
    
{

    axios.get(`${BACKEND_URL}/club/my-club`,{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
    }})
    .then((res)=>{
        const data = res.data;
        if(!data.success){
            setState(null)
        }
        else{
            setState(data.clubs);
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
    .finally(()=>{
        setIsLoading(false);
    })

}

}
return(()=>{})
},[isAuthenticated])
    return(
    <ClubContext.Provider value={state} >
      <>
      {isLoading?(
        <div className="flex jsutify-center items-center min-h-[80vh] w-full">
           <Loader2 className="animate-spin text-gray-500"  size={40}/>

        </div>
        ):
        children
        }
      </>
    </ClubContext.Provider>
   
)
}
