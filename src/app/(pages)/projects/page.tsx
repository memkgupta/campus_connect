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
import { projectCategories } from '@/constants'
import { Input } from '@/components/ui/input'

interface ProjectRes {
title:string,
lead:{
  name:string,
  username:string,
  profile:string,
},
_id:string,
description:string
}
const Page = () => {
  const [projects,setProjects] = useState<ProjectRes[]>([])
  const [isLoading,setIsLoading]=useState(false);
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

      // if(params.tags!=''){
      //   if(params.tags.endsWith(',')){
      //     setParams({...params,tags:params.tags.substring(0,params.tags.length-1)})
      //   }
      //   reqParams.tags = 
      // }
      const res = await axios.get(`/api/projects`,{params:reqParams});
      setProjects(res.data.projects)
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

   const {data:ss} = useQuery({
    queryKey:[params.title,params.categ,params.page],
    queryFn:fetchData
   })
  
  return (
    <div>
      {isLoading?(
        <Loader/>
      ):(
        <>
       <div className='flex gap-2 justify-center'>
       <Select onValueChange={(e)=>{setParams({...params,categ:e})}}>
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
        <Input type='text' onChange={(e)=>{setParams({...params,title:e.target.value})}}/>
       </div>
        {
 projects.map(project=>(
  <Card>
    <CardHeader>
      <CardTitle>{
        project.title
}</CardTitle>
    </CardHeader>
    <CardContent>
      {project.description}
    </CardContent>
    <CardFooter>
      {<div className='flex gap-2 items-center'>
        <img src={project.lead.profile} className='w-12 h-12 rounded-full'></img>
        <Link href={`/user/${project.lead.username}`}>{project.lead.name}</Link>
        </div>}
    </CardFooter>
  </Card>
 ))
        }
        </>
      )
     
      }</div>
  )
}

export default Page