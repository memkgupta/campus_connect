import { ClubContext } from "@/context/ClubContext"
import { useContext } from "react"

export const useClub = ()=>{
    const clubContext = useContext(ClubContext);
    if(!clubContext){
        throw new Error("Some error occured");
    }
    return clubContext;
}