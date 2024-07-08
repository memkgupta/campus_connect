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
import { FileX, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
const page = () => {
  const[isLoading,setIsLoading] = useState(true)
  const [subjects,setSubjects] = useState<{value:string,label:string,id:string}[]>([]);
  const [data,setData] = useState<any[]>([]);
  return (
    <div>
        <FilterBox subjectsState={setSubjects} loading={setIsLoading} url='/api/resources/pyq' state={setData}/>

       {isLoading?(
        <>
        <div className='flex justify-center items-center min-h-[80vh]'><Loader2 size={50} className='animate-spin text-gray-700'/></div>
        </>
       ):(<>
       {
        data.length>0?(
          <div className='grid md:grid-cols-3 grid-cols-1 gap-4 justify-items-center mt-12'>
          {
            data?.map((pyq)=>(
              <Card>
            <CardHeader>
              <CardTitle>{subjects.filter((subject:any)=>(subject.value===pyq.code))[0]?.label}</CardTitle>
              <CardDescription>{pyq.sessionYear}</CardDescription>
            </CardHeader>
           
            <CardFooter>
              <Link href={`/resources/pyq/${pyq._id}`} className=''><Button className='bg-yellow-300 hover:bg-yellow-400 text-black'>View</Button></Link>
            </CardFooter>
          </Card>
            ))
          }
                  </div>
        ):
        (<div>
            <div className="flex items-center justify-center min-h-screen bg-slate-800">
      <div className="bg-white text-center p-6 rounded-lg shadow-lg max-w-sm">
        <FileX className="mx-auto mb-4 text-gray-400" size={48} />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">No Resource Found</h2>
        <p className="text-gray-600">We couldn't find the resource you were looking for.</p>
      </div>
    </div>
          </div>)
       }
       </>)}
    </div>
  )
}

export default page