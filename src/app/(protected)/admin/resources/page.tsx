"use client"
import { BACKEND_URL } from '@/constants'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { useDebounceCallback } from 'usehooks-ts'
import { ResourcesTable } from '@/components/admin/ResourceTable'
import { CustomTable, FilterState } from '@/components/ui/custom-table'
import { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table'
import Loader from '@/components/loader'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
interface Resource{
label:string,
votes:{
  upVote:number,
  downVote:number
},
sessionYear:string,
collegeYear:number,
type:string
}
const ResourcesPage = () => {
    // const fetchResources = await axios.get(`${BACKEND_URL}/admin/resources`)
    const [filters,setFilters] = useState<FilterState>(
   {  label:"",code:"",year:"",branch:"",page:1}
    )
    const [totalResults,setTotalResults] = useState(0);
    const fetchResources = async()=>{
      try {
        const res = await axios.get(`${BACKEND_URL}/admin/resources`,{
          params:filters,
          headers:{
            "Authorization":`Bearer ${Cookies.get('access-token')}`
          }
        })
        setTotalResults(res.data.totalResources);
        return res.data.resources;
      } catch (error) {
        toast({
          title:"Some error occured",
          variant:"destructive"
        })
        return Promise.reject("Some error occured")
      }
    }
    const {data:resources,isLoading} = useQuery({
      queryKey:['resources',filters],
      queryFn:fetchResources
    })
    const debouncedFilter = useDebounceCallback(setFilters,500);
 
    const columns: ColumnDef<Resource>[] = [
      {
        accessorKey: 'label',
        header: 'Label',
        id: 'label',
      },
      {
        accessorKey: 'type',
        header: 'Type',
        id: 'type',
      },
      {
        accessorKey: 'votes',
        header: 'Votes',
        id: 'votes',
        cell:({getValue})=>{
          const votes = getValue() as {upVote:number,downVote:number}
          return(
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{votes.upVote}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{votes.downVote}</span>
            </div>
          </div>
          )
        }
      },
      
      {accessorKey:'collegeYear',header:"College Year",id:"college-year"},
      {
      header:"Action",
      id:'action',
      accessorKey:'_id',
      cell:({getValue})=>{
        const id = getValue() as string
return(
  <DropdownMenu>
  <DropdownMenuTrigger>...</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>
 
      <Link href={`/admin/resource/${getValue()}`}>View</Link>
    </DropdownMenuLabel>

 
  </DropdownMenuContent>
 </DropdownMenu>
)
      }
      }
    ];
    const handleFilterChange = (name:string,value:any)=>{
      console.log(name);
      console.log(value);
      debouncedFilter((prev)=>({...prev,[name]:value}))
    }
const handlePagination =(state:{pageNumber:number,totalResults:number})=>{
  debouncedFilter((prev) => {
    // Ensure `updater` is correctly applied
    
    return { ...prev, page: state.pageNumber};
  });
} 
  return (
    <div>
      {/* <ResourcesTable/> */}
     
       <CustomTable
       data={resources}
       columns={columns}
      filterState={filters}
      onPageChange={handlePagination}
      handleFilterStateChange={handleFilterChange}
      //  sortable={['name', 'age']}
       filterable={[{label:"label",type:"text"}]}
       pagination={false}
       manualPagination={true}
       totalResults = {totalResults}
       pageSize={10}
    />
    
    </div>
  )
}

export default ResourcesPage