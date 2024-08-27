"use client"
import NoResourceFound from '@/components/NoResourceFound';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {Document, Page,pdfjs} from 'react-pdf'

const page = ({params}:{params:{id:string}}) => {
  
    const id = params.id;
    const[isLoading,setIsLoading] = useState(true);
    const[data,setData] = useState<any>();
    const[pdfUrl,setPdfUrl] = useState<any>();
    const router = useRouter();
    const {toast} = useToast();
    useEffect(()=>{
       
        if (id) {
            axios.get(`/api/resources/${id}`)
              .then((res) => {
                const data = res.data;
                console.log(data)
                setData(data.resource);
              })
              .catch((error) => {
                toast({
                  title: 'Some error occurred',
                  variant: 'destructive'
                });
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            router.replace("/not-found");
            setIsLoading(false);
          }
    },[])
    
  
  return (
   <>
   {
    isLoading?(
        <div className='min-h-screen flex items-center justify-center'>
        <Loader2Icon className='animate-spin' color='gray'/> 
        </div>
    ):(
        <>
      {
        data?
        (<>
          <p className='text-center text-2xl font-bold text-white'>{data?.label}</p>
        <p className='mt-5 text-center font-bolf text-gray'>Contributed by : - <Link href={`/user/@${data.contributor.username}`}>{data.contributor.name}</Link></p>
<div className='flex justify-around'>
    <p className="text-gray-500 font-bold">Year : {data.collegeYear} year</p>
    {/* <p className="text-gray-500 font-bold">{data.sessionYear}</p> */}
</div>
        <div className="mt-5 flex justify-center px-5">
{data?.file&&(<iframe src={data.file} className='w-4/3' width="720" height="720" allow="autoplay"></iframe>)}
        </div>
        </>):(
            <NoResourceFound/>
        )
      }
        </>
    )
   }
   </>
  )
}

export default page