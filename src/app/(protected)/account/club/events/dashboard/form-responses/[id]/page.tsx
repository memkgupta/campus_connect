"use client"
import { FormSubmission } from '@/components/club/analytics/forms/form-submission'
import { BACKEND_URL } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';
import { useClub } from '@/hooks/useClubContext';
const Page = ({params}:{params:{id:string}}) => {
  const clubContext = useClub();
const fetchSubmissionData = async()=>{
  if(clubContext.selectedClub?._id){
    try {
      const res = await axios.get(`${BACKEND_URL}/forms/submissions/view?sid=${params.id}`,{headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      },params:{club_id:clubContext.selectedClub?._id}});
      return res.data.submission
    } catch (error) {
      toast({
        title:"Some error occured",
        variant:"destructive"
      })
     return Promise.reject("Some error occured")
    }
  }
  else{
    return Promise.reject("Invalid session")
  }

}
      const {data,isLoading}=useQuery({
        queryKey:['form-response',params.id],
        queryFn:fetchSubmissionData,
        retry:false,
        refetchOnWindowFocus:false
      })
  return (
    <div>
      {isLoading?(<Loader/>):(
<>
{data &&  <div className="max-w-4xl mx-auto">
        <FormSubmission data={data} />
      </div>}
</>
      )}
        
    </div>
  )
}

export default Page