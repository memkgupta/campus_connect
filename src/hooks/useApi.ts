import { useToast } from "@/components/ui/use-toast";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
const {toast} = useToast();
// const fetchResourceData = async(params:any)=>{
//     try {
//         const res  = await axios.get(`/api/subjects`,{params:params});
//         const resData = res.data;
        
//         return resData.data;
       
//      } catch (error) {
//         console.log(error);
//        toast({ title: "Error Occurred", variant: "destructive", color: "red" });
//        return Promise.reject("Some error occured")
//      }
// }

// const useFetchResource =(keys:any[],params:any):UseQueryResult=>{
    
//     return useQuery<any>({
//         queryKey:keys,
//         queryFn:fetchFunction
//     })
// }
