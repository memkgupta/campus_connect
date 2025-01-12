"use client"
import { ProjectPage } from '@/components/component/project-page';
import { BACKEND_URL } from '@/constants';
import { ProjectDashboardData } from '@/types'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'

const Page = ({params}:{params:{id:string}}) => {
const [data,setData] = useState<ProjectDashboardData|null>(null);
const [isLoading,setIsLoading] = useState();
const fetchProjectDetails = async()=>{
    try {
        const res = await axios.get(`${BACKEND_URL}/projects/view?pid=${params.id}`);
setData({
    projectData:res.data.data
});
    } catch (error) {
        
    }
}

const {data:resData} = useQuery({
    queryKey:[],
    queryFn:fetchProjectDetails,
    retry:false,
    refetchOnWindowFocus:false
});
  return (
    <div>
        { data && 
<ProjectPage projectData={data.projectData}/>
           
        }
    </div>
  )
}

export default Page