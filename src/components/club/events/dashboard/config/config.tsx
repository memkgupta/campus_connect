import { toast } from '@/components/ui/use-toast';
import CustomForm from '@/components/utils/forms/custom-form';
import { BACKEND_URL, eventCategories } from '@/constants'
import { useClub } from '@/hooks/useClubContext';
import { useAppSelector } from '@/lib/hooks'
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
const EventConfigDashboard = ({event_id}:{event_id:string}) => {
  const events = useAppSelector(state=>state.club.events);
  const event = events.data.events.find(e=>e._id===event_id);
  const [disabled,setDisabled] = useState(false);
  const clubContext = useClub();
const handleSaveChange = async(data:any)=>{
try {
  setDisabled(true);
  const req = await axios.put(`${BACKEND_URL}/club/events/${event_id}`,data,{
 params:{
  club_id:clubContext.selectedClub?._id,member_id:clubContext.selectedClub?.member_id
 },
 headers:{
  "Authorization":`Bearer ${Cookies.get("access-token")}`
 }
  })
  toast({
    title:"Updated"
  })
} catch (error) {
  const aError = error as AxiosError<any>
  const message = aError.response?.data.message||"Some error occured";
  toast({
    title:message,
    variant:"destructive"
  });
}
finally{
  setDisabled(false)
}
}
  const formFields = [
   
    { name: "name", label: "Event Name", type: "text", required:true, defaultValue:event?.name||"" },
    { name: "description", label: "Description", type: "textarea", required:true,defaultValue: event?.description },
    { name: "dateTime", label: "Date & Time", type: "date", required:true,defaultValue:event?.dateTime||new Date() },
    { name: "location", label: "Location", type: "text", required:true,defaultValue:event?.location|| "" },
    { name: "venue", label: "Venue", type: "text", required: true,defaultValue:event?.venue },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: eventCategories.map((cat) => ({ value: cat.value, label: cat.label })),
      required: true,
      defaultValue:event?.category
    },
  
    {
      name: "participantsFromOutsideAllowed",
      label: "Allow External Participants",
      type: "switch",
      defaultValue: event?.participantsFromOutsideAllowed,
    },
    {
      name: "isAcceptingVolunteerRegistrations",
      label: "Accept Volunteer Registrations",
      type: "switch",
      defaultValue: event?.isAcceptingVolunteerRegistrations,
    },
    { name: "maxCapacity", label: "Max Capacity", type: "number", defaultValue: event?.maxCapacity, required: true },
    // { name: "isRemoved", label: "Hidden", type: "checkbox", defaultValue: event?.isRemoved },
    { name: "organizer", label: "Organizer", type: "text", required: true,defaultValue:event?.organizer },
    { name: "isTeamEvent", label: "Team Event", type: "switch", defaultValue: event?.isTeamEvent },
    { name: "isPublished", label: "Published", type: "switch", defaultValue: event?.isPublished },
  ]
  return (
    <div>
<CustomForm
submitText={"Save Changes"}
fields={formFields}
onSubmit={handleSaveChange}
submitDisabled={disabled}
/>

    </div>
  )
}

export default EventConfigDashboard