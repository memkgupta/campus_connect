"use client"
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import HorizontalProjectCard from '@/components/projects/HorizontalProjectCard'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = () => {
    const [page,setPage] = useState(1);
    const [totalProjects,setTotalProjects] = useState(0);
    const fetchProjects = async()=>{
        try {
            // if(page>(Math.ceil(totalProjects/20))){
            //     toast({
            //         title:"No more projects",
            //         variant:"default"
            //     })
            //     return Promise.reject("No more projects")
            // }
            const req = await axios.get(`${BACKEND_URL}/users/my-projects`,{params:{
                page:page,
                limit:20
            },headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            }});
            setTotalProjects(req.data.totalProjects);
            return req.data.projects
        } catch (error) {
            toast({
                title:"Some error occured",
                variant:"destructive",
                color:"red"
            })
            Promise.reject("Some error occured")
        }
    }
    const {data:projects,isFetching,isError} = useQuery({
        queryKey:["my-projects",page],
        queryFn:fetchProjects,
        retry:false,
        refetchOnWindowFocus:false
    })
  return (
   <>
   {
   ( !projects||isFetching)?(<div className='w-full h-screen flex justify-center items-center'>
    <Loader2 className='animate-spin text-gray-500'/>
    </div>):(
        <>
       <div className='flex w-full justify-end pr-4'>
       <Link href={"/account/projects/add-a-project"} className='bg-yellow-300 rounded-md p-2 text-black '>Add Project</Link>
       </div>
         <div className='grid grid-cols-3 gap-3 mt-4'>
       {projects.map((project:any)=>(
         <HorizontalProjectCard data={project}/>
       ))}
        </div>
        </>
       
    )
   }
       <div className="flex items-center justify-center space-x-2 py-4 mt-24">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {setPage(page-1)}}
          disabled={page===1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page+1)}
          disabled={page>=(Math.ceil(totalProjects/20))}
        >
          Next
        </Button>
      </div>
   </>
  )
}

export default Page