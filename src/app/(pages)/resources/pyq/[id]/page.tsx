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
    // pdfjs.GlobalWorkerOptions.workerSrc =  
    // `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`; 
    const id = params.id;
    const[isLoading,setIsLoading] = useState(true);
    const[data,setData] = useState<any>();
    const[pdfUrl,setPdfUrl] = useState<any>();
    const router = useRouter();
    const {toast} = useToast();
    useEffect(()=>{
const fetchData = async()=>{
    setIsLoading(true);
    try {
        if(id){
            const res = await axios.get(`/api/resources/pyq/${id}`);
            const data = res.data;
            setData(data.pyq);
            
        }
       else{
        router.replace("/not-found");
        
       }
    } catch (error) {
        toast({
            title:'Some error occured',
            variant:'destructive'
        })
    }
    finally{
        setIsLoading(false);
    }
}
fetchData();
    },[])
    const [totalPages,setTotalPages] = useState(null);
    const onDocumentLoadSuccess = ({numPages}:{numPages:any})=>{setTotalPages(numPages)}
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
        <>
          <p className='text-center text-2xl font-bold text-white'>{data?.label}</p>
        <p className='mt-5 text-center font-bolf text-gray'>Contributed by : - <Link href={`/user/@${data.contributor.username}`}>{data.contributor.name}</Link></p>
<div className='flex justify-around'>
    <p className="text-gray-500 font-bold">Year : {data.sessionYear}</p>
    {/* <p className="text-gray-500 font-bold">{data.sessionYear}</p> */}
</div>
        <div className="mt-5 flex justify-center">
{data?.file&&(<iframe src={data.file} width="640" height="640" allow="autoplay"></iframe>)}
        </div>
        </>
      ):
      (<NoResourceFound/>)}
        </>
    )
   }
   </>
  )
}

export default page