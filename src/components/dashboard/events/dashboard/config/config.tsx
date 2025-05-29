import { toast } from '@/components/ui/use-toast';
import CustomForm from '@/components/utils/forms/custom-form';
import { BACKEND_URL, BACKEND_URL_V2, eventCategories } from '@/constants'
import { useClub } from '@/hooks/useClubContext';
import { useAppSelector } from '@/lib/hooks'
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { useEventDashboard } from '@/context/dashboard/useContext';
const EventConfigDashboard = ({event_id}:{event_id:string}) => {
 const{data:event,setData} = useEventDashboard()!
 
  const [disabled,setDisabled] = useState(false);

const handleSaveChange = async(data:any)=>{
try {
  setDisabled(true);
  const req = await axios.put(`${BACKEND_URL_V2}/events/admin/${event_id}`,{...data,},{
params:{
  section:"publish"
},
 headers:{
  "Authorization":`Bearer ${Cookies.get("access-token")}`
 }
  })
  setData(req.data.event)
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