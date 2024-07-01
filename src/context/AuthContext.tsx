import { AuthContextProps, User } from "@/types";
import { ReactNode, createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { HOST_URL } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
const AuthContext = createContext<AuthContextProps>({
    user: null,
    authStatus:false,
    logout: () => {},
  });

  export const AuthProvider= ({children}:{children:ReactNode})=>{
    const [user,setUser] = useState<User|null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const[authStatus,setAuthStatus] = useState<boolean>(false);
const router = useRouter();
      const logout = () => {
        setUser(null);
        Cookies.remove('token');
      };
      useEffect(()=>{
const loadUser = async()=>{
    const token = Cookies.get('token');
    if(token){
        try {
            const res = await axios.get(`${HOST_URL}/users/auth`,{headers:{Authorization:`Bearer ${token}`}});
if(res.status==200){
    const data = res.data;
setUser({id:data._id,username:data.username});
setAuthStatus(true);
setLoading(false);
}
else{
toast.error("Invalid token please login again");
router.replace("/login");
}
        } catch (error:any) {
            if(error.response){
                console.log(error.response.data);
                console.log(error.response.status)
            }
            else{
                console.log(error.message);
            }
        }
    }
    else{
router.replace("/login");
    }
}
      },[])
return(
    <>
    <ToastContainer/>
      {
        loading ? <>
        Loading...
        </> :  
        <AuthContext.Provider value={{user:user,logout:logout,authStatus:authStatus}}>
        {children}
        </AuthContext.Provider>
    }
    </>
  
   
)
  }