"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ContributorContext } from '@/context/ContributorContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import usePagination from '@/hooks/usePagination'
type contributionItem = {
  label:string,
  link:string,
  
}
const Page = () => {
  const { limit, onPaginationChange, skip, pagination } = usePagination();

  const {toast} = useToast()
  const [loading,setLoading] = useState(true);
  const [count,setCount] = useState(0);
  
  const isContributor = useContext(ContributorContext)
const fetchContributorData = async()=>{
  try {
    if(isContributor){
const res = await axios.get(`/api/contributor/my-contributions`);
const data = res.data;
setCount(data.totalContributions);
return data.contributions
    }
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
  queryKey:[],
  queryFn:fetchContributorData,
  refetchOnWindowFocus:false,
  retry:false
})

  const contributionItems:contributionItem[] = [
{label:"PYQs",link:"/account/contribute/pyq"},
{label:"Notes",link:"/account/contribute/notes"},
{label:"Question Banks",link:"/account/contribute/question-banks"}
  ]
 
  return (
    <div>
        <div className="min-h-screen bg-slate-950">
      
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Contribute to Campus Connect</h1>
        {!isContributor ?
        (<>
        <Card>
  <CardHeader>
    <CardTitle>Not a Contributor ? Become one</CardTitle>
    <CardDescription>
      Campus connect is initiative in order to provide all the resources and guides for an engineering student , but we need your support show your support by contributing whatever resources you have
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Link target='_blank' href='https://forms.gle/5pyeVcoRk68FbE9v8' className='bg-yellow-300 hover:bg-yellow-400 p-2 text-black rounded-md ' >Become a contributor </Link>
  </CardContent>
 
</Card>
        </>)
        :
        (
      <>
<div className='px-12 mt-12 flex justify-center'>
        <div className='grid justify-items-center grid-cols-2 md:grid-cols-4 gap-4'>
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
       <p className="text-center font-bold text-xl">Your Contributions</p>
     <DataTable  onPaginationChange={onPaginationChange} pagination={pagination} loading={loading}  count={count} data={contributionData?contributionData:[]} columns={columns}/>
      </>  
      ) 
        
        }
      </main>
      <footer className="w-full text-center p-4  bottom-1 ">
        <p>&copy; 2024 Campus Connect</p>
      </footer>
    </div>
    </div>
  )
}

export default Page