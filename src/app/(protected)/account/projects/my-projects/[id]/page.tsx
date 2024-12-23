"use client"
import ProjectDetails from '@/components/projects/ProjectDetails'
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React from 'react'

const ProjectPage = ({params}:{params:{id:string}}) => {
    const fetchProjectDetail = async()=>{
         try {
            const res = await axios.get(`${BACKEND_URL}/projects/view`,{params:{pid:params.id}});
            const data = res.data.data;
            return data;
         } catch (error) {
            return Promise.reject(error);
         }
    }
    const {data:project,isFetching} = useQuery({
        queryFn:fetchProjectDetail,
        queryKey:['project-details',params.id]
    })
  return (
    <div>
        {
            isFetching || !project ? <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='text-gray-400 animate-spin'/>
            </div>:
            <ProjectDetails project={project}/>
        }
        
    </div>
  )
}

export default ProjectPage