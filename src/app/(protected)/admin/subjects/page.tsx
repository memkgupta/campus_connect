"use client"
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { toast, useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { useDebounceCallback } from 'usehooks-ts'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { Book, Hash, Pencil, Plus, Tag } from 'lucide-react'
import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { SubjectModal } from '@/components/admin/SubjectModal'
import { ColumnDef } from '@tanstack/react-table'
import { CustomTable } from '@/components/ui/custom-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface Subject {
    _id?:string;
    label: string;
    value: string;
    id: string;
    year:number;
    code:string
  }
  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "label",
      header: "Subject Name",
    },
    {
      accessorKey: "value",
      header: "Value",
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ getValue }) => <strong>{getValue() as string}</strong>, // Bold year
    },
    {
      accessorKey: "code",
      header: "Subject Code",
    },
    {
      accessorKey: "branch",
      header: "Branch",
      cell: ({ getValue }) => (
        <span style={{ fontWeight: "bold" }}>{getValue() as string}</span>
      ),
    },
    {
      accessorKey:"_id",
      header:"Action",
      cell:({getValue})=>(
        <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
       
            <Link href={`/admin/subjects/${getValue()}`}>View</Link>
          </DropdownMenuLabel>
      
       
        </DropdownMenuContent>
       </DropdownMenu>
      )
    }
  ];
const SubjectsPage = () => {
const [totalResults,setTotalResults] = useState(0);
const [modalOpen, setModalOpen] = useState(false);
const {toast} = useToast()
const [filters,setFilters] = useState({
    label:"",
    branch:"",
    year:"",
    page:1,
})
    const fetchSubjects = async()=>{
        try {
            const res = await axios.get(`${BACKEND_URL}/admin/subjects`,{
                params:filters,
                headers:{
                    "Authorization":`Bearer ${Cookies.get('access-token')}`
                }
            });
            setTotalResults(res.data.totalResults);
          
            return res.data.subjects;
        } catch (error) {
            toast({
                title:`Some error occured`,
                variant:"destructive"
            })
            return Promise.reject("Some error occured");
        }
    }
    const debouncedFilter = useDebounceCallback(setFilters,500);
    const {data:subjects,isLoading} = useQuery({
        queryKey:['subjects-admin',{...filters}],
        queryFn:fetchSubjects
    })
    const handleFilterChange = (name:any,value:string|number)=>{
        debouncedFilter((prev)=>({...prev,[name]:value}));
    }
    const handlePagination =(state:{pageNumber:number,totalResults:number})=>{
      debouncedFilter((prev) => {
        // Ensure `updater` is correctly applied
        
        return { ...prev, page: state.pageNumber};
      });}
    const handleSubmit = async(data:any)=>{
      try{
        const req = await axios.post(`${BACKEND_URL}/admin/subjects`,data,{headers:{
          "Authorization":`Bearer ${Cookies.get('access-token')}`
        }});
        const  res = req.data.subject;
        toast({
        title:"Subject added ",
        variant:"default",
        color:"#008000"
       })
        setModalOpen(false)
      }
      catch(error)
      {
        const aError = error as AxiosError<any>
       toast({
        title:"Something went wrong",
        variant:"destructive"
       })
      }
    }
  return (
    <div>

<div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        
         <Button
           onClick={()=>setModalOpen(true)}
          className="sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      {modalOpen && <SubjectModal
        onOpenChange={(o)=>setModalOpen(o)}
        onSubmit={handleSubmit}
        open={modalOpen}
      />}
        
      </div>
      </div>

      <div className="rounded-md border mt-2">
       
    
      <CustomTable
      data={subjects}
      columns={columns}
     filterState={filters}
     onPageChange={handlePagination}
     handleFilterStateChange={handleFilterChange}
      filterable={[{label:"label",type:"text"},{label:"year",type:"text"}]}
      pagination={false}
      manualPagination={true}
      totalResults = {totalResults}
      pageSize={10}
      />
       
      </div>
    
    </div>

  )
}

export default SubjectsPage