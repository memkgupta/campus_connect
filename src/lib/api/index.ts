import { BACKEND_URL_V2 } from "@/constants";
import axios, { AxiosError } from "axios"
import Cookies from "js-cookie";
export const updateEventSection = async(section:any,data:any,id:string)=>{
try{
    const req = await axios.put(`${BACKEND_URL_V2}/events/admin/${id}?section=${section}`,data,
        {headers:{
            "Authorization":`Bearer ${Cookies.get('access-token')}`
        }}
    );
    const res = req.data;
    return {message:res.message,event:res.event};
}
catch(error){
    const axiosError = error as AxiosError<any>
    const message = axiosError.response?.data.message || "Some error occured";
    throw new Error(message);
}
}

export const authorisedGetRequest = async(url:string,queryParams:any)=>{
    try{
        const req = await axios.get(url,{params:queryParams,headers:{
            "Authorization":`Bearer ${Cookies.get('access-token')}`
        }})
        return req.data;
    }
    catch(error:any){
        const axiosError = error as AxiosError<any>
        const message = axiosError.response?.data.message || "Some error occured";
      throw new Error(message)
    }
}