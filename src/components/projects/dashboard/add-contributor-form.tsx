import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { Contributor } from "./project-contributors";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/constants";
import { useRouter } from "next/navigation";
  export const AddContributorModal=({ projectId,details }:{projectId:string,details:any}) => {
  
  
    const[isLoading,setIsLoading]=useState(false)
  
   const [name,setName] = useState(details.userDetails.name);
   const [username,setUsername] =useState(details.userDetails.username)
   const [role,setRole] = useState(details.role);
   const router = useRouter();
   console.log(details)
  const handleAddContributor =  async () => {
  try{
    setIsLoading(true)
    await axios.put(`${BACKEND_URL}/projects/contributors/add`, {
    
        role,
        uid:details.user_id,
        contact_email:details.contact_email,
        contact_phone:details.contact_phone,
        project_id: projectId,
         // Ensure it's linked to a project
      },{
          headers:{
              "Authorization":`Bearer ${Cookies.get("access-token")}`
          },
          params:{
              pid:projectId
          }
      });
      toast({
        title:"Contributor Added successfully"
      })
      
  }
  catch(error)
  {
    const aError = error as AxiosError<any>
    const message = aError.response?.data.message||"Some error occured"
    toast({title:message,variant:"destructive"});
  }
  finally{
    setIsLoading(false)
  }
  }
    return (
      <div>
      <div>
            <label className="block text-sm font-medium">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
  
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
  
     
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium">Role</label>
           <Input 
           value={role}
           onChange={(e)=>setRole(e.target.value)}
           placeholder='Role'/>
          </div>
  
          {/* Submit Button */}
          <Button
            onClick={ handleAddContributor}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Adding..." : "Add Contributor"}
          </Button>

      </div>
  

     
    );
  };
  