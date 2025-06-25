import { useToast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/constants";
import { useSession } from "@/hooks/useSession";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/lib/hooks";
import { setClubDetails } from "@/lib/slices/clubSlice";
import Loader from "@/components/Loader";
type ClubContextState = {
     clubs:{
        _id:string,
        title:string,
        role:string,
        team:{
            _id:string,
            title:string,
        }
        member_id:string,
        permissions:{
            action:string,
            resource:string
        }[]
    }[],
    selectedClub?:{
        _id:string,
        title:string,
        role:string,
        team:{
            _id:string,
            title:string,
        }
        member_id:string,
        permissions:{
            action:string,
            resource:string
        }[]
    }|null
}
type ClubContextProps = {
    clubs:{
        _id:string,
        title:string,
        role:string,
        team:{
            _id:string,
            title:string,
        }
        member_id:string,
        permissions:{
            action:string,
            resource:string
        }[]
    }[],
    selectedClub?:{
        _id:string,
        title:string,
        role:string,
        team:{
            _id:string,
            title:string,
        }
        member_id:string,
        permissions:{
            action:string,
            resource:string
        }[]
    }|null,
    handleChangeSelectedClub:(id:string)=>void
}
export const ClubContext = createContext<ClubContextProps|null>(null);
export const ClubContextProvider = ({children}:{children:React.ReactNode})=>{
    const router = useRouter();
    const [state,setState] = useState<ClubContextState|null>(null);
    const [isLoading,setIsLoading] = useState(true);
// const dispatch = useAppDispatch()
    const {isAuthenticated} = useSession();
    const handleChangeSelectedClub = (id:string)=>{
        if(state!=null){
            const clubS = state.clubs.find(c=>c._id===id);
            if(clubS!=undefined){
                setState((prev:any)=>({...prev,selectedClub:clubS}))
            }
        }
    }
    useEffect(()=>{
if(isAuthenticated){
{

    axios.get(`${BACKEND_URL}/club/my-club`,{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
    }})
    .then((res)=>{
        const data = res.data;
        if(!data.success){
            setState({clubs:[],selectedClub:null})
        }
        else{
            setState({clubs:data.clubs,selectedClub:data.clubs.length>0?data.clubs[0]:null});
        }
    })
    .catch((error)=>{
        console.log(error)
        const axiosError = error as AxiosError<any>;
        setState({clubs:[]});
    })
    .finally(()=>{
        setIsLoading(false);
    })

}

}
return(()=>{})
},[isAuthenticated])
    return(
    <ClubContext.Provider value={{clubs:state?.clubs||[],selectedClub:state?.selectedClub,handleChangeSelectedClub:handleChangeSelectedClub}} >
      <>
      {isLoading?(
       <Loader/>
        ):<>
{
    state && children
}
        </>
        }
      </>
    </ClubContext.Provider>
   
)
}
