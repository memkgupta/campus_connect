import { useToast } from '@/components/ui/use-toast'
import { BACKEND_URL, BACKEND_URL_V2 } from '@/constants'
import { useEventDashboard } from '@/context/dashboard/useContext'
import axios, { AxiosError } from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import AssignmentDialog from './add_assignment_dialog'
import AssignmentList from './assignment_list'
const Assignments = () => {
    const {data,setData} = useEventDashboard()!
    const {toast} =useToast() 
   
    const addAssignment = async()=>{
        
    }

  return (
    <div className=''>
        <div className='flex justify-end mb-2'>
            <AssignmentDialog/>
        </div>
        <AssignmentList/>
    </div>
  )
}

export default Assignments