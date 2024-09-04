'use client'
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'

const Page = ({params}:{params:{id:string}}) => {



    const [videos,setVideos] = useState<any[]>([]);
    const [data,setData] = useState<any>(null)
      ;
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
  finally{
    setIsLoading(false)
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

// Call handleVote with 'up' or 'down' based on the action
const handleUpVote = () => handleVote('up');
const handleDownVote = () => handleVote('down');
    const {data:r} = useQuery({
        queryKey:[],
        queryFn:fetchResource,
        retry:false,
        refetchOnWindowFocus:false
    });
    
  return (
<>
{  isLoading?(<Loader/>): ( <div className="grid gap-5 md:flex justify-center  min-h-screen bg-slate-950 p-4">
    {/* Embedded Video Section */}
  
   <div className=" flex-1 grid grid-rows-4 gap-2 md:w-3/4 w-full h-[80vh] ">
      <div className="w-full h-full row-span-3">
        <iframe
          width={"100%"}
          height={"100%"}
          src={selectedVideo?.videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
    </div>
    
   
    {/* Video List Section */}
    <div className="w-full h-full p-4 md:w-1/4 bg-slate-900 border-white rounded-md overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Video List</h2>
      <ul className="space-y-2">
        {videos.map((video:any,index:any) => (
          <li
            key={video._id}
            className={`p-2 text-sm ${selectedVideo!._id==video._id?'bg-slate-950':'bg-slate-800'} rounded shadow hover:bg-slate-900 cursor-pointer`}
            onClick={() => handleVideoClick(index)}
          >
            {video.label?video.label:`Video ${index}`}
          </li>
        ))}
      </ul>
    </div>
  </div>)}
</>
  )
}

export default Page