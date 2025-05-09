// components/TeamDetails.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEventRegistration } from "@/context/event_registration/EventRegistrationContext";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { BACKEND_URL_V2 } from "@/constants";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import TeamDetailsCard from "./team_details_card";
const TeamDetails = () => {
  const {data:registrationContext,setData} = useEventRegistration()
  const registrationDetails = registrationContext.registrationDetails;
  
  const [selectedOption, setSelectedOption] = useState<"join" | "create" | null>(null);
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const {toast} = useToast();
  const handleJoin = async() => {
     try{
      const req = await axios.post(`${BACKEND_URL_V2}/events/registrations/join-team`,{
        team_code:teamCode,
        registration_id:registrationDetails._id
      },{
        headers:{
          "Authorization":`Bearer ${Cookies.get("access-token")}`
        }
      });
      const {team} = req.data;
      setData({...registrationContext,registrationDetails:{...registrationContext.registrationDetails,team:team._id}});
    }
    catch(error:any)
    {
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message || "Some error occured";
      toast({
        title:message,
        variant:"destructive"
      })
    }
  
  };

  const handleCreate = async() => {
    
    try{
      const req = await axios.post(`${BACKEND_URL_V2}/events/registrations/create-team`,{
        team_name:teamName,
        registration_id:registrationDetails._id
      },{
        headers:{
          "Authorization":`Bearer ${Cookies.get("access-token")}`
        }
      });
      const {team} = req.data;
      setData({...registrationContext,registrationDetails:{...registrationContext.registrationDetails,team:team._id}});
    }
    catch(error:any)
    {
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message || "Some error occured";
      toast({
        title:message,
        variant:"destructive"
      })
    }
  };
const fetchTeamDetails = async()=>{
  try{
    if(registrationDetails.team && registrationDetails._id){
   const res = await axios.get(`${BACKEND_URL_V2}/events/registrations/team-details`,{
      params:{regId:registrationDetails._id,},headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }
    });
    return res.data.team;
    }
    return null;
  }
  catch(error:any){
  const aError = error as AxiosError<any>
  const message = aError.response?.data.message || "Some error occured";
  toast({
    title:message,
    variant:"destructive"
  })

  }
}

const {data:team,isFetching} = useQuery({
queryKey:[registrationDetails._id,registrationDetails.team],
retry:false,
refetchOnWindowFocus:false,
queryFn:fetchTeamDetails
})
  return (
    <>
       {isFetching ? (
        <Loader/>
       )
      :
      (
     <>
     {
      team?(
        <>
        <TeamDetailsCard team={team}/>
        </>
      )
      :(
           <div className="flex w-full h-full border rounded-xl overflow-hidden shadow-lg">
      {/* Sidebar */}
      <aside className="w-1/4 bg-muted p-4 flex flex-col gap-4 border-r">
        <Button
          variant={selectedOption === "join" ? "default" : "outline"}
          onClick={() => setSelectedOption("join")}
        >
          Join Team
        </Button>
        <Button
          variant={selectedOption === "create" ? "default" : "outline"}
          onClick={() => setSelectedOption("create")}
        >
          Create Team
        </Button>
      </aside>

      {/* Main Form Area */}
      <main className="flex-1 p-6">
        {selectedOption === "join" && (
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Join a Team</h2>
            <Input
              placeholder="Enter Team Code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
            />
            <Button onClick={handleJoin}>Join</Button>
          </div>
        )}

        {selectedOption === "create" && (
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Create a Team</h2>
            <Input
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button onClick={handleCreate}>Create</Button>
          </div>
        )}

        {!selectedOption && (
          <div className="text-gray-500">Please select an option from the sidebar.</div>
        )}
      </main>
    </div>
      )
     }
     </>
      ) 
      }
    </>
 
  );
};

export default TeamDetails;
