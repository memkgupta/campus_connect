"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { useSession } from '@/hooks/useSession'
import { toast } from '../ui/use-toast'
import axios, { AxiosError } from 'axios'
import { BACKEND_URL } from '@/constants'
import Cookies from 'js-cookie'
const Voting = ({currentVote,votes,c_id,setVotes,setIsVoted}:{currentVote:string|null,votes:any,c_id:string,setVotes:(val:any)=>void,setIsVoted:(v:string|null)=>void}) => {
    // const [isVoted,setIsVoted] = useState<string|null>(null);
      const {isAuthenticated} = useSession();
      const [isVoting,setIsVoting] = useState(false);
    const handleVote = async (voteType:string) => {
      if(!isAuthenticated){
        toast({
          title:"Please login first",
          color:"yellow"
        })
        return;
      }
      setIsVoting(true);
        if (currentVote&& currentVote === voteType) {
          // User is undoing their vote
          setIsVoted(null);
         
          votes[`${voteType}voteCount`] = Math.max(votes[`${voteType}voteCount`] - 1, 0);
        } else {
          // Update votes based on the current and new vote types
          if (currentVote) {
            votes[`${currentVote}voteCount`] = Math.max(votes[`${currentVote}voteCount`] - 1, 0);
          }
          setIsVoted(voteType);
          votes[`${voteType}voteCount`] = (votes[`${voteType}voteCount`] || 0) + 1;
        }

      setVotes(votes);
        try {
          const res = await axios.post(`${BACKEND_URL}/resources/vote`, { r_id: c_id, type: voteType },{headers:{"Authorization":`Bearer ${Cookies.get('access-token')}`}});
          if (res.data.success) {
            toast({
              title: `Vote recorded`,
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
  return (
    <>
       <div className='w-full flex justify-between mt-4 '>
      <div className='flex gap-2'>
                <div className='flex gap-1'>
                    <Button disabled={isVoting} onClick={()=>handleVote('up')} className='bg-neutral-800 border hover:bg-black border-white rounded-md'>
                    <Image   alt='upvotes' src={`/upvote${currentVote&&currentVote=='up'?'-filled':''}.svg`} width={20} height={20}/>
                    <p className='text-gray-500'>{votes?.upvoteCount}</p>
                    </Button>
                </div>
                <div className='flex gap-1'>
                 <Button disabled={isVoting} onClick={()=>handleVote('down')} className='bg-neutral-800 border hover:bg-black border-white rounded-md'>
                 <Image  alt='downvotes' src={`/downvote${currentVote&&currentVote=='down'?'-filled':''}.svg`} width={20} height={20}/>
                 <p className='text-gray-500'>{votes?.downvoteCount}</p>
                 </Button>
                </div>
              </div>
      </div>
    </>
  )
}

export default Voting