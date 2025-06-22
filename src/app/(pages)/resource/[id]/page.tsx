"use client"
import NoResourceFound from '@/components/no-resource-found-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// @ts-ignore
import Voting from '@/components/utils/voting';
import { BACKEND_URL } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Loader2Icon } from 'lucide-react';
// import { useSession } from 'next-auth/react';
import { useSession } from '@/hooks/useSession';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import CustomDocViewer from '@/components/ui/doc-viewer';
// import {Document, Page,pdfjs} from 'react-pdf'

const Page = ({params}:{params:{id:string}}) => {
    // pdfjs.GlobalWorkerOptions.workerSrc =  
    // `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 
    // const {data:session} = useSession();
    const {isAuthenticated,isLoading} = useSession()
    const id = params.id;
    // const[isLoading,setIsLoading] = useState(true);
    const[data,setData] = useState<any>();
    const [isVoted,setIsVoted] = useState<string|null>(null);
    const[pdfUrl,setPdfUrl] = useState<any>();
    const router = useRouter();
    const {toast} = useToast();
    const [isVoting,setIsVoting] = useState(false);
    
    const fetchResources = async()=>{
    
          
          try {
            // setIsLoading(true);
            const res = await axios.get(`${BACKEND_URL}/resources/view/${id}`,{
              headers:(isAuthenticated?{"Authorization":`Bearer ${Cookies.get('access-token')}`}:{})
            });
            const _data = res.data.data;
            if(_data.votes.length==0){
            _data.votes = [{upvoteCount:0,downvoteCount:0}]
            }
            setData(_data)
          setPdfUrl(_data.resource.file)
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
            // setIsLoading(false);
          }
      }
     
      const {data:resourceData,isSuccess,isFetching} = useQuery<any>(
        {
          queryKey:[id,isAuthenticated],
          queryFn:fetchResources,
      
          refetchOnWindowFocus:false,
              retry:false
        }
      )
  
  return (
   <>
   {
    isLoading || isFetching?(
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
{pdfUrl&&(<CustomDocViewer src={pdfUrl}/>)}
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