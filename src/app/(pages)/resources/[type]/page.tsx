'use client'
import FilterBox from '@/components/study-materials/FilterBox'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUp, FileX, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import NoResourceFound from '@/components/NoResourceFound'
import Image from 'next/image'
const Page = ({params}:{params:{type:string,id:string}}) => {
    const type = params.type||"pyq";
  const[isLoading,setIsLoading] = useState(true)
  const [subjects,setSubjects] = useState<{value:string,label:string,id:string}[]>([]);
  
  const [data,setData] = useState<any[]>([]);
  return (
    <div>
        <FilterBox type={type} subjectsState={setSubjects} loading={setIsLoading} url='/api/resources' state={setData}/>

       {isLoading?(
        <>
        <div className='flex justify-center items-center min-h-[80vh]'><Loader2 size={50} className='animate-spin text-gray-700'/></div>
        </>
       ):(<>
       {
        data.length>0?(
          <div className='grid md:grid-cols-3 grid-cols-1 gap-4 justify-items-center mt-12'>
          {
            data?.map((res)=>(
              <Card className='min-w-[300px] '>
              <CardContent className='flex flex-col justify-center items-center'>  
                {res.data.thumbnail && <img src={res.data.thumbnail} className='max-w-fit w-[200px] h-[200px]' />}
                {res.data.label}
                
                {res.data.sessionYear}
                </CardContent>
            
            <CardFooter className='flex justify-between'>
              <Link href={res.data.type==='lectures'?
                `/lectures/${res.data._id}`
                :`/resources/${res.data.type}/${res.data._id}`} className=''><Button className='bg-yellow-300 hover:bg-yellow-400 text-black'>View</Button></Link>
              <div className='flex gap-2'>
                <div className='flex gap-1'>
                    <Image alt='upvotes' src={"/upvote.svg"} width={20} height={20}/>
                   <p className='text-gray-500'>{res.upvoteCount}</p>
                </div>
                <div className='flex gap-1'>
                    <Image alt='downvotes' src={"/downvote.svg"} width={20} height={20}/>
                   <p className='text-gray-500'>{res.downvoteCount}</p>
                </div>
              </div>
            </CardFooter>
          </Card>
            ))
          }
                  </div>
        ):
        (<div>
           <NoResourceFound/>
          </div>)
       }
       </>)}
    </div>
  )
}

export default Page