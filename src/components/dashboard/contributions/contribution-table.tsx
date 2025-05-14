// components/ContributionTable.tsx

import React, { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { CustomTable } from '@/components/ui/custom-table'
import { BACKEND_URL, resourceTypes } from '@/constants'
import { useDebounceCallback } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'

const ContributionTable = () => {
      const [filters,setFilters] = React.useState({
       title:"",
       category:"",
       page:1
      });
      const [total,setTotal] = useState(0)
      const {toast}= useToast()
     const debounced = useDebounceCallback(setFilters,500);
  const handleFilterChange = (name:string,value:string)=>{
debounced((prev)=>({...prev,[name]:value}))
  }
const handlePageChange = ({pageNumber,totalResults}:{pageNumber:number,totalResults:number})=>{
debounced({...filters,page:pageNumber})
}
const fetchContributions = async()=>{
try {
   
const res = await axios.get(`${BACKEND_URL}/users/my-contributions`,{
  headers:{
    "Authorization":`Bearer ${Cookies.get('access-token')}`
  },
  params:filters
});
const data = res.data;
setTotal(data.totalContributions);
return data.contributions
    
  } catch (error) {
    toast({
      title:'Some error occured',
      variant:'destructive'
    })
    return Promise.reject('Some error occured')
  }

}
const {data:contributions,isFetching} = useQuery<any>({
    queryKey:[{...filters}],
    queryFn:fetchContributions,
    retry:false,
    refetchOnWindowFocus:false
})
  return (
    <>

    <CustomTable
        pagination={true}
        manualPagination={true}
        data={contributions}
        pageSize={50}
        filterable={[{
        label:"title",type:"text"
        },{
            label:"category",type:"select",options:resourceTypes
        }]}
        isLoading = {isFetching}
        columns={columns}
        onPageChange={handlePageChange}
        handleFilterStateChange={handleFilterChange}
    />
    </>
 
  )
}

export default ContributionTable
