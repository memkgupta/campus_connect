// TeamDetailsCard.tsx
"use client"

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useEventContext } from "@/context/EventContext"
import { Clipboard, ClipboardCheck } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "@/hooks/useSession"
import axios, { AxiosError } from "axios"
import { BACKEND_URL_V2 } from "@/constants"
import Cookies from "js-cookie"

// inside component scope


const TeamDetailsCard = ({ team }: { team: any }) => {
  const { data: event } = useEventContext()
  const members = team.members || []
  const {toast} = useToast()
    const minimumRequirements = event?.eventStructure?.teamRequirements?.minimumStrength||1
    const maximumRequirements = event?.eventStructure?.teamRequirements?.maximumStrength ||4
    const lead = team.lead;
    const {user} = useSession()
 const isLead = () => {
  for (const member of team.members) {
    if (member._id === lead && member.user === user?.id) {
      return true;
    }
  }
  return false;
};
const[isTeamSubmitting,setIsTeamSubmitting] = useState(false)
 const[status,setStatus] = useState(team.status)
    const handleSubmit = async() => {
try{
  setIsTeamSubmitting(true);
const req = await axios.post(`${BACKEND_URL_V2}/events/registrations/submit-team`,
  {
    team_id:team._id
  },
  {headers:{
    "Authorization":`Bearer ${Cookies.get("access-token")}`
  }}
 
);
toast({
  title:"Team submitted"
})
 const data = req.data.team;
  setStatus(data.status);

}
catch(error:any)
{
  const aError = error as AxiosError<any>
  const message  = aError.response?.data.message || "Some error occured";
  toast({
    title:message,
    variant:"destructive"
  })
}
finally{
  setIsTeamSubmitting(false)
}
  }
const [copied, setCopied] = useState(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(team._id)
    setCopied(true)
    toast({title:"Team code copied"})
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    toast({
        title:"Failed",
        variant:"destructive"
    })
  }
}
  return (
    <Card className="bg-muted dark:bg-zinc-900 dark:text-white shadow-md max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Team Overview</CardTitle>
        <CardDescription>
          Details of team <strong>{team.name}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-6">
        {/* LEFT SECTION - Team Details */}
        <div className="flex-1 space-y-4">
          <div>
            <span className="font-medium">Team Name:</span> {team.name}
          </div>
          <div className="flex items-center gap-2">
  <span className="font-medium">Team Code:</span>
  <code className="text-sm bg-muted px-2 py-1 rounded">{team.code}</code>
  <Button
    variant="ghost"
    size="icon"
    onClick={copyToClipboard}
    className="text-muted-foreground hover:text-primary"
  >
    {copied ? <ClipboardCheck className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
  </Button>
</div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <Badge
              className={cn(
                team.status === "approved"
                  ? "bg-green-600"
                  : team.status === "submitted"
                  ? "bg-yellow-600"
                  : "bg-gray-600"
              )}
            >
              {team.status}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Event Title:</span>{" "}
            {event?.basicDetails?.title}
          </div>
          <div>
            <span className="font-medium">Event Date:</span>{" "}
            {event?.basicDetails?.startDate &&
              format(new Date(event.basicDetails.startDate), "PPP")}
          </div>
        </div>

        {/* RIGHT SECTION - Members */}
        <div className="md:w-[320px] flex-shrink-0 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          {members.map((member: any, index: number) => (
            <div
              key={member._id}
              className="flex items-center gap-4 p-3 border rounded-lg bg-background"
            >
              <Avatar>
                <AvatarFallback>
                  {member.registrationDetails?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {member.registrationDetails?.name || "Unnamed"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.registrationDetails?.email || "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Footer Section with Submit Button */}
     {minimumRequirements && maximumRequirements && <CardFooter className="justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isLead() || (team.status !== "not-submitted") || !(team.members.length>=minimumRequirements && team.members.length<=maximumRequirements)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Submit Team
        </Button>
      </CardFooter>}
    </Card>
  )
}

export default TeamDetailsCard
