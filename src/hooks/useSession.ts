import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";



export const useSession = ()=>{
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return authContext;
};
