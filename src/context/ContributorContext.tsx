import { createContext, ReactNode } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
export const ContributorContext = createContext<boolean>(false);

export const ContributorContextProvider = ({children}:{children:ReactNode})=>{
    
    const [isContributor,setIsContributor] = useState(false);
    const {data:session,status} = useSession();
const router = useRouter();
const [isLoading,setIsLoading] = useState();
const fetchData = async () => {
    if (status === "unauthenticated") {
      router.replace(`/sign-in`);
      return;
    }
  
    console.log(session);
  
    if (session?.user) {
      try {
        const res = await axios.get(`/api/users/is-contributor?email=${session?.user.email}`);
        const data = res.data;
        
        if (!data.success) {
          setIsContributor(false);
        } else {
          setIsContributor(true);
        
        }
          return data;
      } catch (error) {
        console.log(error);
        setIsContributor(false);
        return Promise.reject("Some error occured");
      }
    }
  };
    const {data} = useQuery({
        queryKey:[session,isContributor],
        queryFn:fetchData
    })
    return(
        <>
        {isLoading ? (<Loader/>):(
            <ContributorContext.Provider value={isContributor}>
            {children}
        </ContributorContext.Provider>
        )}
        </>

    )

}
