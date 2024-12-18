"use client"
import NoResourceFound from '@/components/NoResourceFound';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Voting from '@/components/utils/Voting';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Loader2Icon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
// import {Document, Page,pdfjs} from 'react-pdf'

const Page = ({params}:{params:{id:string,type:string}}) => {
    // pdfjs.GlobalWorkerOptions.workerSrc =  
    // `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 
    const {data:session} = useSession();
    const id = params.id;
    const[isLoading,setIsLoading] = useState(true);
    const[data,setData] = useState<any>();
    const [isVoted,setIsVoted] = useState<string|null>(null);
    const[pdfUrl,setPdfUrl] = useState<any>();
    const router = useRouter();
    const {toast} = useToast();
    const [isVoting,setIsVoting] = useState(false);
    
    const fetchResources = async()=>{
    
          
          try {
            setIsLoading(true);
            const res = await axios.get(`/api/resources/${id}`);
            const _data = res.data.data;
            if(_data.votes.length==0){
            _data.votes = [{upvoteCount:0,downvoteCount:0}]
            }
            setData(_data)
          
setIsVoted(res.data.data.isVoted);
            return res.data.data;
          } catch (error: any) {
            console.log(error)
            toast({
              title: "Some error occured",
              variant: "destructive",
            });
            return Promise.reject("Some error occured")
          } finally {
            setIsLoading(false);
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
          const res = await axios.post(`/api/resources/vote`, { c_id: id, type: voteType });
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
      const {data:resourceData,isSuccess} = useQuery<any>(
        {
          queryKey:[id],
          queryFn:fetchResources,
          // refetchOnMount:false,
          refetchOnWindowFocus:false,
              retry:false
        }
      )
  
  return (
   <>
   {
    isLoading?(
        <div className='min-h-screen flex items-center justify-center'>
        <Loader2Icon className='animate-spin' color='gray'/> 
        </div>
    ):(
        <>
      {data ? 
      (
        <div className='py-12'>
          <p className='text-center text-2xl font-bold text-white'>{data.resource?.label}</p>
        <p className='mt-5 text-center font-bolf text-gray'>Contributed by : - <Link href={`/user/${data.resource.contributor.username}`}>{data.resource.contributor.name}</Link></p>
<div className='flex justify-around'>
    <p className="text-gray-500 font-bold">Year : {data.resource.sessionYear}</p>
    {/* <p className="text-gray-500 font-bold">{data.sessionYear}</p> */}
    <div className='flex gap-2 w-200'>

      <Voting setIsVoted={setIsVoted} votes={data.votes} setVotes={(v)=>{setData({...data,votes:v})}} c_id={params.id} currentVote={isVoted?isVoted:null}/>
          
              </div>
</div>
        <div className="mt-5 flex justify-center">
{data?.resource.file&&(<iframe src={data.resource.file} width="640" height="640" allow="autoplay"></iframe>)}
        </div>
        </div>
      ):
      (<NoResourceFound/>)}
        </>
    )
   }
   </>
  )
}

export default Page