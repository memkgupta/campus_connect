import { BACKEND_URL } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { CategorizedTasks, ClubTask } from '@/types/club-dashboard';
import { setTasks } from '@/lib/slices/clubSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomForm from '@/components/utils/forms/custom-form';
import { FormField } from '@/components/utils/forms/types';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useClub } from '@/hooks/useClubContext';
import TaskTable from '@/components/club/tasks/task-table';
const AdminTasksDashboard = ({event_id}:{event_id:string}) => {
 const dispatch = useAppDispatch()
 const members = useAppSelector(state=>state.club.members.data.members)
  const eid = event_id;
  const clubContext = useClub()
  const fetchTasks = async()=>{
    try {
      const req = await axios.get(`${BACKEND_URL}/club/events/tasks`,
        {params:{
          event_id:event_id,
          club_id:clubContext.selectedClub?._id,
          role:clubContext.selectedClub?.role
        },headers:{
          "Authorization":`Bearer ${Cookies.get("access-token")}`
        }}
      );
      const tasks:ClubTask[] = req.data.tasks;
    
      dispatch(setTasks(tasks))
      return req.data.tasks;
    } catch (error) {
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message||"Some error occured"
      toast({
        title:message,
        variant:"destructive"
      })
      return Promise.reject(message)
    }
  }
  const [isAssigningTask,setIsAssigningTask] = useState(false);
  const assignTask = async(data:any)=>{
    setIsAssigningTask(true)
    try {
      const req = await axios.post(`${BACKEND_URL}/club/tasks/assign`,{...data,event_id:event_id},{
        params:{club_id:clubContext.selectedClub?._id,},
        headers:{"Authorization":`Bearer ${Cookies.get("access-token")}`}
      })
      toast({
        title:"Task added",
        variant:"default"
      })
    } catch (error) {
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message;
      toast({title:message,variant:"destructive"})
    }
    finally{
setIsAssigningTask(false);
    }
  }
  const {data,isLoading} = useQuery({
    queryKey:["tasks",eid],
    queryFn:fetchTasks,
    retry:false,
    refetchOnWindowFocus:false
  })
  const assignTaskFormFields:FormField[] = [
    {
      type:"text",label:"Title",name:"title",placeholder:"Title",required:true
    },
    {type:"textarea",label:"Description",name:"description",placeholder:"Describe your task",required:true},
    {type:"combo",label:"Assign to",name:"assignedTo",placeholder:"Assign to",required:true,options:
      members.map(m=>({label:m.name!,value:m._id!}))
    },
    {type:"select",label:"Priority",options:[{value:"high",label:"high"},{value:"medium",label:"medium"},{value:"low",label:"low"}],name:"priority",defaultValue:"high",placeholder:"Select Priority"},
    {type:"date",label:"Due date",name:"dueDate",placeholder:"Due Date",required:true,gte:new Date()},
    
  ]
  // const pendingTasks = tasks.data.tasks.filter(t=>)
  return (
    <div>

<div className='flex justify-end'>
  <Dialog>
    <DialogTrigger className='bg-yellow-400 p-2 rounded-md text-black'>Add Task</DialogTrigger>
    <DialogHeader>
  
    </DialogHeader>
    <DialogContent>
    <DialogTitle>Add task</DialogTitle>
      <CustomForm
       fields={assignTaskFormFields}
       onSubmit={assignTask}
       submitText='Assign'
      />
    </DialogContent>
  </Dialog>
</div>
    {data&& <TaskTable allowEditing={true}/>}
    </div>
  )
}

export default AdminTasksDashboard