'use client'
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'

const Page = ({params}:{params:{id:string}}) => {



    const [videos,setVideos] = useState<any[]>([]);
    const [data,setData] = useState<any>(null)
      ;
      const {toast} = useToast();
      const [isLoading,setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<{id:string,title:string,videoUrl:string}|null>(null);
  
    const handleVideoClick = (index:number) => {
      setSelectedVideo(videos[index]);
    };
    const fetchResource = async()=>{
        setIsLoading(true);
try {
    const res = await axios.get(`/api/resources/${params.id}`);
    setData(res.data.data);
    setVideos(res.data.data.resource.playlist.lectures);
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
    
    const {data:r} = useQuery({
        queryKey:[params.id],
        queryFn:fetchResource,
        retry:false,
        refetchOnWindowFocus:false
    })
  return (
    <div className="grid gap-5 md:flex justify-center  min-h-screen bg-slate-950 p-4">
    {/* Embedded Video Section */}
    <div className="md:flex-1 md:w-3/4 w-full md:h-[70vh] h-[50vh]">
      <div className="w-full h-full ">
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
    </div>

    {/* Video List Section */}
    <div className="w-full h-[70vh] p-4 md:w-1/4 bg-slate-900 border-white rounded-md overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Video List</h2>
      <ul className="space-y-2">
        {videos.map((video:any,index:any) => (
          <li
            key={video._id}
            className="p-2 bg-slate-700 rounded shadow hover:bg-slate-900 cursor-pointer"
            onClick={() => handleVideoClick(index)}
          >
            {video.title?video.title:`Video ${index}`}
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default Page