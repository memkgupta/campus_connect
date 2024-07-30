"use client"
import { DataTable } from './data-table'
import { useToast } from '@/components/ui/use-toast';
import usePagination from '@/hooks/usePagination';
import axios from 'axios';
import React, { useState } from 'react'
// import { columns } from '../event/[id]/columns';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';

const page = () => {
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<any>(null);
   const [events,setEvents] = useState([]);
   const {toast} = useToast();
   const { limit, onPaginationChange, skip, pagination } = usePagination();
   const [count,setCount] = useState(0);
   const fetchEvents = async()=>{
        try {
            const res = await axios.get(`/api/club/events`);
            const data = res.data;
       setEvents(data.events);
       setCount(Math.ceil(data.totalResults/10))
            return {events:data.events,total:data.totalResults}
        } catch (error) {
            toast({
                title:"Some error occured",
                variant:"destructive"
              })
    return Promise.reject("Some error occured")

        }
        finally{
            setLoading(false);
        }
    }
    const {data:eventData} = useQuery({
      queryKey:[],
        queryFn:fetchEvents
    })
  return (
    <div>
        <DataTable columns={columns} count={count} loading={loading} onPaginationChange={onPaginationChange} pagination={pagination} data={events} />
    </div>
  )
}

export default page