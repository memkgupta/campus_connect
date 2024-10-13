'use client'
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import ProgressComponent from '@/components/component/progress'
const Page = ({params}:{params:{id:string}}) => {



    const [videos,setVideos] = useState<any[]>([]);
    const [data,setData] = useState<any>(null);
    const [tracker,setTracker] = useState<{_id:string,taken:string[],recent:[],user_id:string}|null>(null);
      const {data:session} = useSession();
      const [isVoting,setIsVoting] = useState(false);
      const {toast} = useToast();
      const [isLoading,setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<{_id:string,label:string,videoUrl:string,thumbnail:string}|null>(null);
    const [isVoted,setIsVoted] = useState<string|null>(null);
    const handleVideoClick = (index:number) => {
      setSelectedVideo(videos[index]);
    };
    const fetchResource = async()=>{
        setIsLoading(true);
try {
    const res = await axios.get(`/api/resources/${params.id}`);
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
const handleVote = async (voteType:string) => {
  setIsVoting(true);

  if (!session?.user) {
    toast({
      title: "Login first",
      className: "bg-yellow-300 text-black"
    });
    setIsVoting(false);
    return;
  }

  // Create a copy of votes to update
  const votes = data.votes;
  const currentVote = isVoted;

  if (currentVote === voteType) {
    // User is undoing their vote
    setIsVoted(null);
   
    votes[0][`${voteType}voteCount`] = Math.max(votes[0][`${voteType}voteCount`] - 1, 0);
  } else {
    // Update votes based on the current and new vote types
    if (currentVote) {
      votes[0][`${currentVote}voteCount`] = Math.max(votes[0][`${currentVote}voteCount`] - 1, 0);
    }
    setIsVoted(voteType);
    votes[0][`${voteType}voteCount`] = (votes[0][`${voteType}voteCount`] || 0) + 1;
  }

  // Update state with the new votes
  setData({ ...data, votes:votes });

  try {
    const res = await axios.post(`/api/resources/vote`, { c_id: params.id, type: voteType });
    if (res.data.success) {
      toast({
        title: `${voteType.charAt(0).toUpperCase() + voteType.slice(1)}d the contribution`,
        className: 'bg-yellow-300 text-black'
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    toast({
      title: "Error",
      description: axiosError.response?.data?.message,
      variant: "destructive"
    });
  } finally {
    setIsVoting(false);
  }
};
const handleStartTracker = async()=>{
  try {
    const res = await axios.post(`/api/resources/tracker/start`,{},{params:{rid:params.id}});
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
const handleUpVote = () => handleVote('up');
const handleDownVote = () => handleVote('down');
   
    const fetchTracker = async()=>{
  
      try {
        if(data!=null){
          const res = await axios.get(`/api/resources/tracker?rid=${params.id}`);
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
       
      } catch (error) {
        const axiosError = error as AxiosError<any>
        const message = axiosError.response?.data.message||"Something went wrong"
        return new Error(message)
      }
      finally{
        setIsLoading(false)
      }
    }
    const _d = useQueries({
      queries:[
        {
          queryKey:[],
          queryFn:fetchResource,
          retry:false,
          refetchOnWindowFocus:false,
          staleTime:Infinity
      },
      {
        queryKey:[data],
        queryFn:fetchTracker,
        retry:false,
        refetchOnWindowFocus:false,
        staleTime:Infinity
      }
      ]
    });
    const handleProgressUpdate =async(index:number,status:boolean,id:string)=>{
      let videosCopy = [...videos];
if(tracker){
  try {
    const res = await axios.put(`/api/resources/tracker/update`,{tracker_id:tracker._id,lectureId:id,taken:status})
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

{  isLoading?(<Loader/>): ( <div className=''>
  {!tracker &&!isLoading && (<div className='bg-black/50 flex justify-center items-center p-2 w-full'>
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
      <div className='w-full flex justify-between mt-4 '>
      <div className='flex gap-2'>
                <div className='flex gap-1'>
                    <Button disabled={isVoting} onClick={handleUpVote} className='bg-neutral-800 border hover:bg-black border-white rounded-md'>
                    <Image   alt='upvotes' src={`/upvote${isVoted&&isVoted=='up'?'-filled':''}.svg`} width={20} height={20}/>
                    <p className='text-gray-500'>{data.votes[0]?.upvoteCount}</p>
                    </Button>
                </div>
                <div className='flex gap-1'>
                 <Button disabled={isVoting} onClick={handleDownVote} className='bg-neutral-800 border hover:bg-black border-white rounded-md'>
                 <Image  alt='downvotes' src={`/downvote${isVoted&&isVoted=='down'?'-filled':''}.svg`} width={20} height={20}/>
                 <p className='text-gray-500'>{data.votes[0]?.downvoteCount}</p>
                 </Button>
                </div>
              </div>
      </div>
      {/* Progress */}

    </div>
    <ProgressComponent tracker ={tracker}/>
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