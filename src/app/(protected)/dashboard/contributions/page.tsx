"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ContributorContext } from '@/context/ContributorContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from "./columns"
import Cookies from 'js-cookie'
import usePagination from '@/hooks/usePagination'
import { BACKEND_URL } from '@/constants'
type contributionItem = {
  label:string,
  link:string,
  
}
const Page = () => {
  const { limit, onPaginationChange, skip, pagination } = usePagination();

  const {toast} = useToast()
  const [loading,setLoading] = useState(true);
  const [count,setCount] = useState(0);
  
  // const isContributor = useContext(ContributorContext)
const fetchContributorData = async()=>{
  try {
   
const res = await axios.get(`${BACKEND_URL}/users/my-contributions`,{
  headers:{
    "Authorization":`Bearer ${Cookies.get('access-token')}`
  },
  params:{

    page:pagination.pageIndex,
    limit:pagination.pageSize
  }
});
const data = res.data;
setCount(data.totalContributions);
return data.contributions
    
  } catch (error) {
    toast({
      title:'Some error occured',
      variant:'destructive'
    })
    return Promise.reject('Some error occured')
  }
  finally{
    setLoading(false);
  }
}
const {
  data:contributionData
} = useQuery({
  queryKey:["contributions",pagination],
  queryFn:fetchContributorData,
  refetchOnWindowFocus:false,
  retry:false
})

  const contributionItems:contributionItem[] = [
{label:"PYQs",link:"/dashboard/contribute"},
{label:"Notes",link:"/dashboard/contribute"},
{label:"Question Banks",link:"/dashboard/contribute"},
{label:"Lectures",link:"/dashboard/contribute/lectures"}
  ]
 
  return (
    <div>
        <div className="min-h-screen bg-slate-950">
      
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Contribute to Campus Connect</h1>
        {
        (
      <>
<div className='px-12 mt-12 flex justify-center'>
        <div className='grid justify-items-center grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          {
contributionItems.map((item)=>(
<Link key={item.label} href={item.link} className='bg-slate-900 text-xl font-bold rounded-md p-3 w-fit border text-center  border-white'>
{item.label}
</Link>
))
          }
        </div>

       
        
        </div>
       {/* Your contributions */}
       <p className="text-center font-bold text-xl mt-12">Your Contributions</p>
     <DataTable  onPaginationChange={onPaginationChange} pagination={pagination} loading={loading}  count={count} data={contributionData?contributionData:[]} columns={columns}/>
      </>  
      ) 
        
        }
      </main>
     
    </div>
    </div>
  )
}

export default Page