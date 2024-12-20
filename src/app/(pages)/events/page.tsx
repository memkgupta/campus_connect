"use client"
import ComboBox from '@/components/ComboBox';
import EventCard from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BACKEND_URL, eventCategories } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import Link from 'next/link';
const Page = () => {
// const [events,setEvents] = useState([]);
const [happening,setHappening] = useState({value:"this-week",label:'This Week',id:"this-week"});
const [location,setLocation] = useState(null)   
const [college,setCollege] = useState(null);
const [keyword,setKeyword] = useState("");
const debounced = useDebounceCallback(setKeyword,500);
const [page,setPage] = useState(1);
const [totalResults,setTotalResults]=useState<number|null>(null);
const[category,setCategory] = useState<{value:string,label:string,id:string}|null>(null);
const [loading,setLoading] = useState(true);
const {toast} = useToast();
const fetchEvents = async()=>{
        const params:any = {}
        if(happening){
            params.happening=happening.value
        }
        if(location){
            params.location = location
        }
        if(college){
            params.college=college;
        }
        if(keyword){
            params.keyword = keyword;
        }
        if(category){
            params.category = category.value
        }
        if(page){
          params.page = page;
        }
  
try {
    setLoading(true)
    const res = await axios.get(`${BACKEND_URL}/events`,{params:params});
    setTotalResults(res.data.total);
   return res.data.events;
} catch (error) {
    toast({
        title: "Some error occured",
        variant: "destructive",
      });
      return Promise.reject("Some error occured")
}
finally{
    setLoading(false);
}
    }
    const {data:events,isSuccess,isFetching} = useQuery<any>(
        {
          queryKey:[happening,keyword,category,page,"events"],
          queryFn:fetchEvents,
          refetchOnWindowFocus:false,
          retry:false,
        }
      )
      
  
  return (
   <>
   <div className='mb-12 gap-y-3 grid grid-cols-1 md:grid-cols-3 justify-items-center content-center'>
        <ComboBox label='When' options={[
            {value:"this-week",label:"This week",id:"this-week"},
            {value:"this-month",label:"This month",id:"this-month"},
            {value:"this-year",label:"This year",id:"this-year"}
        ]} stateSetter={setHappening}/>
          <ComboBox  label='Category' options={eventCategories} stateSetter={setCategory}/>
          {/* <Label>Search</Label> */}
         <div>
         <p className="text-sm text-slate-700">{"Search"}</p>
         <Input placeholder='Search by name' type='text' onChange={(e)=>{debounced(e.target.value)}} className='max-w-56 text-white border-2 border-white'/>
         </div>
    </div>
   {!events ||isFetching?(
    <div className='w-full min-h-screen flex justify-center items-center'>
        <Loader2 className='text-gray-500 animate-spin'/>
    </div>
   ):(

   <div>
    
     <div className='grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center'>
   {events.length>0 && 
   events.map((event:any)=>(<EventCard key={event._id} data={event}/>))
   }
   </div>
   <Pagination className='mt-12'>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious disabled={page==1}  onClick={(e)=>{page>1&&setPage(page-1)}} />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink onClick={()=>{setPage(1)}} >1</PaginationLink>
    
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext disabled={totalResults!=null && (Math.floor(totalResults/10)<page)} onClick={(e)=>{setPage(page+1)}} />
    </PaginationItem>
  </PaginationContent>
</Pagination>
   </div>
   )}
   <div className='w-full flex justify-center mt-12'>
   <Link className='text-center text-indigo-700' href={"/account/register-a-club"}>Register your club</Link>

   </div>
   </>
  )
}

export default Page