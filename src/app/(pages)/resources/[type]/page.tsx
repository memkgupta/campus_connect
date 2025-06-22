'use client'
import FilterBox from '@/components/utils/study-materials/filter-box'
import React, { useEffect, useState } from 'react'
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
import NoResourceFound from '@/components/no-resource-found-card'
import Image from 'next/image'
import { BACKEND_URL } from '@/constants'
import CustomImage from '@/components/ui/image'
const Page = ({params}:{params:{type:string,id:string}}) => {
    const type = params.type||"pyq";
  const[isLoading,setIsLoading] = useState(true)
  const [subjects,setSubjects] = useState<{value:string,label:string,id:string}[]>([]);
  
  const [data,setData] = useState<any[]>([]);

  return (
    <div>
        <FilterBox type={type} subjectsState={setSubjects} loading={setIsLoading} url={`${BACKEND_URL}/resources`} state={setData}/>

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
           <Card className="w-full max-w-sm shadow-lg border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
  <CardContent className="p-0">
    {res.data.thumbnail && (
      <CustomImage
        src={res.data.thumbnail}
        className="w-full h-48 object-cover rounded-t-2xl"
      />
    )}
    <div className="p-4 space-y-2">
      <CardTitle className="text-lg font-semibold text-gray-800 truncate">{res.data.label}</CardTitle>
      <CardDescription className="text-sm text-gray-500">{res.data.sessionYear}</CardDescription>
    </div>
  </CardContent>
  <CardFooter className="flex items-center justify-between px-4 pb-4">
    <Link
      href={
        res.data.type === "lectures"
          ? `/lectures/${res.data._id}`
          : `/resource/${res.data._id}`
      }
    >
      <Button className="bg-yellow-300 hover:bg-yellow-400 text-black rounded-xl text-sm">
        View
      </Button>
    </Link>
    <div className="flex items-center space-x-4">
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <Image alt="upvotes" src={"/upvote.svg"} width={18} height={18} />
        <span>{res.upvoteCount}</span>
      </div>
      <div className="flex items-center gap-1 text-gray-500 text-sm">
        <Image alt="downvotes" src={"/downvote.svg"} width={18} height={18} />
        <span>{res.downvoteCount}</span>
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