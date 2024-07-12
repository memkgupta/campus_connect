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
import { FileX, Folder, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import NoResourceFound from '@/components/NoResourceFound'
const page = () => {
  const[isLoading,setIsLoading] = useState(true)
  const [subjects,setSubjects] = useState<{value:string,label:string,id:string}[]>([]);
  const [data,setData] = useState<any[]>([]);
  return (
    <div>
        <FilterBox filters={{year:true,subjects:true,branch:true,university:true}} subjectsState={setSubjects} loading={setIsLoading} url='/api/resources/question-banks' state={setData}/>

       {isLoading?(
        <>
        <div className='flex justify-center items-center min-h-[80vh]'><Loader2 size={50} className='animate-spin text-gray-700'/></div>
        </>
       ):(<>
       {
        data.length>0?(
          <div className='grid md:grid-cols-3 grid-cols-1 gap-4 justify-items-center mt-12'>
          {
            data?.map((question_bank)=>(
              <Card>
            <CardHeader>
              <CardTitle>{subjects.filter((subject:any)=>(subject.value===question_bank.code))[0]?.label}</CardTitle>
              <CardDescription>{question_bank.sessionYear}</CardDescription>
            </CardHeader>
           
            <CardFooter>
              <Link href={`/resources/question-banks/${question_bank._id}`} className=''><Button className='bg-yellow-300 hover:bg-yellow-400 text-black'>View</Button></Link>
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

export default page