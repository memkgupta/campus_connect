"use client"
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast} from '@/components/ui/use-toast'
import { useToast } from 'react-toastify'
import Loader from '@/components/Loader'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Select, SelectValue,SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { BACKEND_URL, projectCategories } from '@/constants'
import { Input } from '@/components/ui/input'
import { useDebounceCallback } from 'usehooks-ts'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import CustomImage from '@/components/ui/image'

interface ProjectRes {
title:string,
lead:{
  name:string,
  username:string,
  profile:string,
},
banner:string,
_id:string,
description:string
}
const Page = () => {
  const [projects,setProjects] = useState<ProjectRes[]>([])
  const [isLoading,setIsLoading]=useState(false);
  const [total,setTotal] = useState(0);
  const [params,setParams] = useState<
  {
   
    title:string,
    categ:string,
    page:number

  }>({

    title:'',
    categ:'',
    page:1
  })
  const debounced  = useDebounceCallback(setParams,500);
  const fetchData = async()=>{
    try {
      const reqParams:any = {
      
      }
      if(params.categ!=''){
        reqParams.category = params.categ
      }
      if(params.title!=''){
        reqParams.title = params.title.trim();
      }


      const res = await axios.get(`${BACKEND_URL}/projects`,{params:reqParams});
      setProjects(res.data.projects)
      setTotal(res.data.total);
      return res.data.projects;
    } catch (error) {
      const axiosError = error as AxiosError<any>
      if(axiosError.response?.data.message){
toast({
  title:axiosError.response.data.message,
  variant:'destructive'
})
      }
      else{
        toast({
          title:"Some error occured",
          variant:'destructive'
        })
      }
      return Promise.reject("Some error occured")
    }
    finally{
      setIsLoading(false);
    }
  }

   const {data:ss,isFetching,isError} = useQuery({
    queryKey:[params.title,params.categ,params.page],
    queryFn:fetchData
   })

  return (
    <div>
 
    
       <div className='flex gap-2 justify-center mx-auto max-w-3xl'>
       <Select onValueChange={(e)=>{debounced({...params,categ:e})}}>
<SelectTrigger>
  <SelectValue placeholder="Select Category"/>
</SelectTrigger>
<SelectContent>
                   {projectCategories.map((categ,index)=>{
                    return(
                      <SelectItem key={categ.id} value={categ.value}>{categ.label}</SelectItem>
                    )
                   }) 
                    }
                  </SelectContent>
        </Select>
        <Input type='text' placeholder='Search By title' onChange={(e)=>{debounced({...params,title:e.target.value})}}/>
       </div>
       {!ss||isFetching?(<>
       <Loader/>
       </>):(<div className='grid grid-cols-3 gap-3 mt-12 px-12'>
       {
 projects.map(project=>(
  <Card>
    <CardHeader>
      <CardTitle>{
        project.title
}</CardTitle>
    </CardHeader>
    <CardContent>
      <CustomImage src={project.banner} alt='' className='w-full '/>
      {project.description}
    </CardContent>
    <CardFooter className='justify-between'>
      {
     <>
        <div className='flex gap-2 items-center'>
        <CustomImage src={project.lead.profile} className='w-12 h-12 rounded-full'/>
        <Link href={`/user/${project.lead.username}`}>{project.lead.name}</Link>
        </div>
        <Link href={`/projects/${project._id}`} className='bg-yellow-300 hover:bg-yellow-400 text-black p-2  rounded-md'>View</Link>
     </>
        }
    </CardFooter>
  </Card>
 ))
        }


       </div>)}
       <div className='mt-5'>
       <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious onClick={()=>{setParams({...params,page:params.page-1})}} disabled={params.page===1}  />
    </PaginationItem>
   {Math.floor(total/10)>=0 && <PaginationItem>
      <PaginationLink onClick={()=>{setParams({...params,page:1})}} >1</PaginationLink>
    </PaginationItem>}
   {Math.floor(total/10)>1 && <PaginationItem>
      <PaginationLink onClick={()=>{setParams({...params,page:2})}}>2</PaginationLink>
    </PaginationItem>}
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext onClick={()=>{setParams({...params,page:params.page+1})}} disabled={Math.floor(total/10)<params.page} />
    </PaginationItem>
  </PaginationContent>
</Pagination>
       </div>
  
       
     </div>
  )
}

export default Page