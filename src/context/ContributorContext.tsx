import { createContext, ReactNode } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const ContributorContext = createContext<boolean>(false);

export const ContributorContextProvider = ({children}:{children:ReactNode})=>{
    
    const [isContributor,setIsContributor] = useState(false);
    const {data:session,status} = useSession();
const router = useRouter();
useEffect(()=>{
    console.log("Hola")
    if(status==="unauthenticated"){
router.replace(`/sign-in`);
return;
    }
    console.log(session)
    if(session?.user){
        axios.get(`/api/users/is-contributor?email=${session?.user.email}`)
        .then((res)=>{
        const data = res.data;
        if(!data.success){
        setIsContributor(false);
        }
        else{
            setIsContributor(true);
        }
        })
        .catch((error)=>{
        console.log(error)
        setIsContributor(false);
        })
    }

},[
session
])
    
    return(
<ContributorContext.Provider value={isContributor}>
    {children}
</ContributorContext.Provider>
    )

}
