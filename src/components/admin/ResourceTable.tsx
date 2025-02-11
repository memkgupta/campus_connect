import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { BACKEND_URL, branches, resourceTypes } from '@/constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from '../ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
interface ResourceData {
  _id: string;
  label: string;
  type: string;
  sessionYear: string;
}

interface Resource {
  data: ResourceData;
  upvoteCount: number;
  downvoteCount: number;
}


export function ResourcesTable() {

 


  const [filters,setFilter] = useState({
    code:'',
    label:'',
    type:'',
    branch:'',
    page:1,
    year:''
  })
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
  const debouncedFilter = useDebounceCallback(setFilter,500);
const handleFilter = (name:any,value:string|number)=>{
  debouncedFilter((prev)=>({...prev,[name]:value}))
}
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by label..."
          
          onChange={(e) => handleFilter("label",e.target.value)}
          className="max-w-sm"
        />
        <select
         
          onChange={(e) => handleFilter("type",e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Types</option>
          {resourceTypes.map((type) => (
            <option key={type.id} className='text-black' value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
         {/* Year */}
       <select
         
         onChange={(e) => handleFilter("year",e.target.value)}
         className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
       >
         <option value="" className='text-black'>All Years</option>
         {['1','2','3','4'].map((year) => (
           <option key={year} className='text-black' value={year}>
             {year}
           </option>
         ))}
       </select>
       {(filters.year=="" || filters.year!="1")&& <select
         
         onChange={(e) => handleFilter("branch",e.target.value)}
         className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
       >
         <option value="" className='text-black'>All Branches</option>
         {branches.map((branch) => (
           <option key={branch.id} className='text-black' value={branch.value}>
             {branch.label}
           </option>
         ))}
       </select>}
      
      </div>

      <div className="rounded-md border">
       {isLoading ? <Loader></Loader>:(
         <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Label</TableHead>
             <TableHead>Type</TableHead>
             <TableHead>Session Year</TableHead>
             <TableHead>Votes</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {resources.map((resource:any) => (
             <TableRow key={resource.data._id}>
               <TableCell className="font-medium">
                 {resource.data.label}
               </TableCell>
               <TableCell>
                 <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                   {resource.data.type}
                 </span>
               </TableCell>
               <TableCell>{resource.data.sessionYear}</TableCell>
               <TableCell>
                 <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-1">
                     <ThumbsUp className="w-4 h-4" />
                     <span>{resource.upvoteCount}</span>
                   </div>
                   <div className="flex items-center space-x-1">
                     <ThumbsDown className="w-4 h-4" />
                     <span>{resource.downvoteCount}</span>
                   </div>
                 </div>
               </TableCell>
               <TableCell>
               <DropdownMenu>
 <DropdownMenuTrigger>...</DropdownMenuTrigger>
 <DropdownMenuContent>
   <DropdownMenuLabel>

     <Link href={`/admin/resource/${resource.data._id}`}>View</Link>
   </DropdownMenuLabel>
   <DropdownMenuSeparator />

 </DropdownMenuContent>
</DropdownMenu>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
       )}
        <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={filters.page==1} onClick={()=>{handleFilter("page",filters.page-1)}} />
        </PaginationItem>
       
     
        <PaginationItem>
          <PaginationNext disabled={filters.page==(Math.ceil(totalResults/20))}  onClick={()=>{handleFilter("page",filters.page+1)}}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
      </div>
    </div>
  );
}