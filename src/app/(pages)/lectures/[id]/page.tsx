'use client'
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from '@/hooks/useSession';
import Image from 'next/image';
import React, { useState } from 'react'
import ProgressComponent from '@/components/resources/progress'
//@ts-nocheck
import Voting from '@/components/utils/voting';
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
const Page = ({params}:{params:{id:string}}) => {

const auth = useSession();

    const [videos,setVideos] = useState<any[]>([]);
    const [data,setData] = useState<any>(null);
    const [tracker,setTracker] = useState<{_id:string,taken:string[],recent:[],user_id:string}|null>(null);
      const {toast} = useToast();
      const {isAuthenticated,isLoading} = useSession()
      // const [isLoading,setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<{_id:string,label:string,videoUrl:string,thumbnail:string}|null>(null);
    const [isVoted,setIsVoted] = useState<string|null>(null);
    const handleVideoClick = (index:number) => {
      setSelectedVideo(videos[index]);
    };
    const fetchResource = async()=>{
        // setIsLoading(true);
        const headers:any = {}
        if(isAuthenticated){
          headers.Authorization = `Bearer ${Cookies.get('access-token')}`
        }
try {
    const res = await axios.get(`${BACKEND_URL}/resources/view/${params.id}`,{
      headers:headers
    });
    setData(res.data.data);
    setVideos(res.data.data.resource.playlist.lectures);
    setSelectedVideo(res.data.data.resource.playlist.lectures[0]);
    setIsVoted(res.data.data.isVoted)
    const _data = res.data.data;
    if(_data.votes.length==0){
    _data.votes = [{upvoteCount:0,downvoteCount:0}]
    }
    setData(_data)
 
    return res.data
} catch (error) {
  
    const axiosError = error as AxiosError<any>;
  
      toast({
        title: axiosError.response?.data.message || "Some error occurred",
        variant: 'destructive'
      });
     
  return Promise.reject("Some error occured")
     
    }
 
  
    
}

const handleStartTracker = async()=>{
  try {
    const res = await axios.post(`${BACKEND_URL}/tracker`,{},{params:{rid:params.id},headers:{
      "Authorization":`Bearer ${Cookies.get('access-token')}`
    }});
    if(res.data.success){
      toast({
        title:'Tracker started',
        variant:'default',
        color:'#ffff'
      })
      setTracker(res.data.tracker)
    }
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    toast({
      title: "Error",
      description: axiosError.response?.data?.message,
      variant: "destructive"
    });
  }

}
// Call handleVote with 'up' or 'down' based on the action
    const fetchTracker = async()=>{
  
     if(isAuthenticated){
      try {
        const headers:any = {}
        
        if(data!=null && auth.isAuthenticated){
          const res = await axios.get(`${BACKEND_URL}/tracker?rid=${params.id}`,{headers:{
            "Authorization":`Bearer ${Cookies.get("access-token")}`
          }});
          if(res.data.success && res.data.tracker){
            setTracker(res.data.tracker);
            const index = videos.findIndex((_v:any)=>_v._id===res.data.tracker.recent);
            if(index+1>videos.length){
              setSelectedVideo(videos[index])
            }else{
              setSelectedVideo(videos[index+1])
            }
          }
          return res.data.tracker;
        }
        else{
          // setIsLoading(false);
        }
       
      } catch (error) {
        const axiosError = error as AxiosError<any>
        const message = axiosError.response?.data.message||"Something went wrong"
        return new Error(message)
      }
   
     }
     else{
      return null;
     }
    }
    const {data:_data,isLoading:isResourceLoading} = useQuery({
      queryKey:['resource',params.id,isAuthenticated],
      retry:false,
      refetchOnWindowFocus:false,
      queryFn:fetchResource
    })  
    const {data:_tracker,isLoading:isTrackerLoading} = useQuery(
   
      {
       queryKey:['tracker',params.id,,isAuthenticated],
        queryFn:fetchTracker,
        retry:false,
        refetchOnWindowFocus:false,
        staleTime:Infinity,
        enabled:!!_data });
    const handleProgressUpdate =async(index:number,status:boolean,id:string)=>{
      let videosCopy = [...videos];
if(tracker){
  try {
    const res = await axios.put(`${BACKEND_URL}/tracker/`,{tracker_id:tracker._id,lectureId:id,taken:status},{
      headers:{
        "Authorization":`Bearer ${Cookies.get('access-token')}`
      }
    })
      if(res.data.success){
        videosCopy[index].taken = status;
        setVideos(videosCopy)
        setTracker({...tracker,taken:[...tracker.taken,videos[index]._id]})
        setSelectedVideo(videos[index+1])
        toast({
          title:"Progress Updated",
          variant:'default',
          color:'#008000'
        })
      }
    
  } catch (error) {
    toast({
      title:"Something went wrong",
      variant:'destructive'
    })
  }

}
   
     
    }
  return (
<>

{  isResourceLoading || isTrackerLoading || isLoading?(<Loader/>): ( <div className=''>
  {!tracker &&!isResourceLoading && (<div className='bg-black/50 flex justify-center items-center p-2 w-full'>
<Button onClick={handleStartTracker} className='bg-purple-600 text-white hover:bg-purple-900'>Start Tracker </Button>
</div>)}
{data && <div className="grid gap-5 md:flex justify-center   bg-slate-950 p-4">
    {/* Embedded Video Section */}
  
   <div>
   <div className=" flex-1 grid grid-rows-4 gap-2  w-full h-[80vh] ">
      <div className="w-full h-full row-span-3">
        <iframe
          width={"100%"}
          height={"100%"}
          src={selectedVideo?.videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer;  encrypted-media;  "
          allowFullScreen
          
        ></iframe>
     
      </div>
     
      <Voting setIsVoted={setIsVoted} votes={data.votes} setVotes={(v)=>{setData({...data,votes:v})}} c_id={params.id} currentVote={isVoted?isVoted:null}/>
      {/* Progress */}

    </div>
    {isAuthenticated&&<ProgressComponent tracker ={tracker}/>}
   </div>
   
    {/* Video List Section */}
    <div className="w-full h-full p-4 md:w-1/4 bg-slate-900 border-white rounded-md overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Video List</h2>
      <ul className="space-y-2">
        {videos.map((video:any,index:any) => (
          <li
            key={video._id}
            className={`p-2 text-sm ${selectedVideo!._id==video._id?'bg-slate-950':'bg-slate-800'} rounded shadow hover:bg-slate-900 cursor-pointer flex gap-2 p-2`}
           
          >
            <Checkbox  id='take-' onClick={(e:any)=>{
              // setVideos([...videos,])
              handleProgressUpdate(index,!video.taken,video._id)
            }} checked={video.taken} />
            <div  onClick={() => handleVideoClick(index)}>
            {video.label?video.label:`Video ${index}`}
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  </div>
}
</div>
)}
</>
  )
}

export default Page