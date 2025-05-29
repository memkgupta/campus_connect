"use client";
import React, { useContext, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  Loader2 } from 'lucide-react'


import ComboBox from '@/components/ui/combobox-custom';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { yearTillNow } from '@/helpers/yearUtility';


import { BACKEND_URL, branches, resourceTypes, universities } from '@/constants';
import { Label } from '@/components/ui/label';
import { YTLecture } from '@/types';


import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useSession } from '@/hooks/useSession';
import { PlaylistManager } from '@/components/resources/lectures/playlist-manager';
const Page = () => {
   
    const date = new Date();
    // const isContributor = useContext(ContributorContext);
  const [isSubmitting,setIsSubmitting] = useState(false);
    const {toast} = useToast();
        const [year,setYear] = useState({
        value:'1',label:"1st year",id:'1'
        })

       
const [sessionYear,setSessionYear] = useState({value:(date.getFullYear()-1).toString(),label:(date.getFullYear()-1).toString(),id:(date.getFullYear()-1).toString()});
const [selectedSubject,setSelectedSubject] = useState<{value:string,label:string,id:string}|null>(null);
const [selectedBranch,setSelectedBranch] = useState<{value:string,label:string,id:string}|null>({value:'first-year',label:'First Year',id:'first-year'});
// const [resourceType,setResourceType] = useState<{value:string,label:string,id:string}|null>();
   const {isAuthenticated} = useSession()
    const [subjects,setSubjects] = useState([]);
    const [label,setLabel] = useState("");
    const [selectedUniversity,setSelectedUniversity] = useState({value:'AKTU',label:'AKTU',id:'AKTU'})
    const [videos, setVideos] = useState<YTLecture[]>([]);

 

const fetchSubjects = async()=>{
  let params:any = {}
  if(year){
    params.year = year.value;
   }
   if(selectedBranch){
     params.branch =  selectedBranch.value
   }
   try {
    const res = await axios.get(`${BACKEND_URL}/subjects`,{params:params});
    const data = res.data;
    if(data.success){
        setSubjects(data.subjects);
    }
    return data
   } catch (error) {
    toast({title:'Error Occured',variant:'destructive',color:'red'})
    return Promise.reject("some error occured")
   }
}
    const handleSubmit = async()=>{
      if(!isAuthenticated){
        return;
      }
if(selectedBranch&&selectedSubject&&year&&videos.length!=0&&sessionYear){
const data = {
    label:label,
    type:'lectures',
  branch:selectedBranch.value,
  playlist:videos,
  code:selectedSubject.value,
  collegeYear:year.value,
  sessionYear:sessionYear.value,

  university:selectedUniversity.value,
}
try {
  setIsSubmitting(true);
  const res = await axios.post(`${BACKEND_URL}/resources/upload-resource`,data,{
    headers:{
      "Authorization":`Bearer ${Cookies.get('access-token')}`
    }
  });
  if(res.status===200){
    toast({
      title:'Your contribution was added thank you',
      variant:'default',
      color:'#008000'
    })
  }
  else{
    toast({
      title:'Some error occured',
      variant:'destructive',
      color:'red'
    })
  }
} catch (error) {
  const axiosError = error as AxiosError;
  if(axiosError.response?.data){
console.log(axiosError.response.data);
toast({
  title:'Some error occured',
  variant:'destructive',
  color:'red'
})
  }
}
finally{
  setIsSubmitting(false);
}

      }
      else{
        toast({
          title:'Please Fill out all the fields',
          variant:'destructive',
          color:'yellow'
        })
      }
    }

    // for fetching the subjects
 const {data:sub} = useQuery({
  queryKey:[selectedBranch,year],
  queryFn:fetchSubjects
 }) 
  return (
<>
  <div className='flex justify-center max-w-2/3'>
  <div className="grid md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 ">
    

   
   <div className='grid col-span-2 gap-1'>
   <Label className='text-gray-800'>Label</Label>
   {/* label */}
   <Input value={label} onChange={(e)=>{setLabel(e.target.value)}}  className='w-[500px] mb-5 text-white ' type='text'/>
  
  
   
   </div>

    <ComboBox label='Select Year' options={[
             {
               value:'1',label:"1st year",id:'1'
               },
               {
                 value:'2',label:"2nd year",id:'2'
               },
               {
                 value:'3',label:"3rd year",id:'3'
               },
               {
                 value:'4',label:"4th year",id:'4'
               }
       ]} stateSetter={setYear}/>
       {/* Branch */}
       {
       year.value!="1" &&
       (
       
      <ComboBox options={branches} label='Select Branch' stateSetter={setSelectedBranch}/>
          
       )
   
   }
    <ComboBox options={yearTillNow()} stateSetter={setSessionYear} label='Session Year'/>
   <ComboBox options={subjects} label='Select Subject' stateSetter={setSelectedSubject}/>
   <ComboBox options={universities} label='Select University' stateSetter={setSelectedUniversity}/>
   <Button onClick={handleSubmit}  disabled={isSubmitting} className='bg-yellow-300 w-32 hover:bg-yellow-400  text-black'>{!isSubmitting?'Upload':(<>
    <p>Uploading</p><Loader2 className='animate-spin'/></>)}</Button>
    </div>

  
  
  </div>
  {/* <div className='flex justify-center'>
  <div className="mt-12 flex justify-center gap-5  w-3/4">
  {playListUrl &&  <Card className='min-h-[500px] px-3'>
<CardHeader >Preview</CardHeader>
<CardContent >
  {playList?(<div className='flex flex-col gap-3'>
  {playList.map(item=>(
    <div className='bg-slate-900 px-3 py-3 text-white flex gap-2 border-white rounded-md'>
      {item.thumbnail&&<img className='w-16 h-16 rounded-md' src={item.thumbnail}></img>}
      <p>{item.label}</p>
  </div>))}
  </div>)
  :(<div className='w-full h-full flex justify-center items-center'>
  
  </div>)}
</CardContent>
    </Card>}
    <div className='flex flex-col gap-4'>
      
   

   </div>
  </div> */}
 <PlaylistManager videos={videos} setVideos={setVideos}/>
 <div className='w-full justify-center mt-12 flex'>
 
 </div>
 
    
       </>



  )
}

export default Page