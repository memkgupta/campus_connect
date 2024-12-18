import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

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
    const {data:session,status} = useSession();
    const {toast} = useToast();
    useEffect(()=>{
       
if(session){
    
if(status==="authenticated"){
if(session.user){
    axios.get(`/api/club/my-club`)
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
