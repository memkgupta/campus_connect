import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { CategorizedTasks, ClubMember } from '@/types/club-dashboard';
import React, { useEffect, useState } from 'react'
import TaskCard from './task-card';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CustomForm from '@/components/utils/forms/custom-form';
import { FormField } from '@/components/utils/forms/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Paperclip, PencilIcon, XIcon } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from '@/constants';
import { useClub } from '@/hooks/useClubContext';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import { setSelectedTask, updateTask } from '@/lib/slices/clubSlice';
const TaskTable = ({allowEditing}:{allowEditing:boolean}) => {
    const tasks = useAppSelector(state=>state.club.tasks);
   
  
    const [sortedTasks,setSortedTasks] = useState<CategorizedTasks>({
        completed:[],
        in_progress:[],
        todo:[]
    })
    useEffect(()=>{
          const sorted = tasks.data.tasks.reduce<CategorizedTasks>((acc, task) => {
                acc[task.status] = acc[task.status] || [];
                acc[task.status].push(task);
                return acc;
              }, { todo: [], in_progress: [], completed: [] });
        setSortedTasks(sorted)
    },[tasks.data.tasks])
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-12'>
       <ViewTaskDialog/>
       <CompleteTaskDialog/>
        {/* pending */}
        <div className='bg-gray-900 rounded-md p-6 '>
        <p className='text-white font-bold text-xl mb-12'>Todo</p>
        {sortedTasks.todo.map(t=><TaskCard allowEditing={allowEditing} task={t} key={t._id}/>)}
        </div>
        {/* In Process */}
        <div className='bg-gray-900 rounded-md p-6'>
        <p className='text-white font-bold text-xl mb-12'>In Progress</p>
          {sortedTasks.in_progress.map(t=><TaskCard allowEditing={allowEditing} task={t} key={t._id}/>)}
        </div>
        {/* Completed */}
        <div className='bg-gray-900 rounded-md p-6'>
          <p className='text-white font-bold text-xl mb-12'>Completed</p>
          {sortedTasks.completed.map(t=><TaskCard allowEditing={allowEditing} task={t} key={t._id}/>)}
        </div>
      </div>
  )
}

export default TaskTable

export const ViewTaskDialog = ()=>{
    const clubContext = useClub()
  const [isEditing,setIsEditing] = useState(false);
  const selectedTask = useAppSelector(state=>state.club.selectedTask.data)
  const members = useAppSelector(state=>state.club.members)
      const[isSubmitting,setIsSubmitting] = useState(false);
  const task = selectedTask?.task;
const dispatch = useDispatch()
  if(!task){
    return(<></>)
  }
  const handleUpdateTask = async(data:any)=>{
    setIsSubmitting(true)
try {
const req = await axios.put(`${BACKEND_URL}/club/tasks/update/${task._id}`,data,{
    params:{
        club_id:clubContext.selectedClub?._id,
    },
    headers:{"Authorization":`Bearer ${Cookies.get("access-token")}`}
})


toast({
    title:"Updated",
    variant:"default"
})
dispatch(updateTask({...task,...data}))
setIsEditing(false);
dispatch(setSelectedTask(null));
} catch (error) {
const aError = error as AxiosError<any>
const message = aError.response?.data.message || "Some error occured";
toast({
    title:message,
    variant:"destructive"
})
}
finally{
setIsSubmitting(false)
}
}
    const priorityColors: Record<string, string> = {
        High: "bg-red-500 text-white",
        Medium: "bg-yellow-500 text-white",
        Low: "bg-green-500 text-white",
      };
      const statusColors = {
        todo: "bg-yellow-300",
        in_progress: "bg-orange-400",
        completed: "bg-green-400",
      };
  const editTaskFormFields:FormField[] = [
    {
      type:"text",label:"Title",name:"title",placeholder:"Title",required:true,defaultValue:task.title
    },
    {type:"textarea",label:"Description",name:"description",placeholder:"Describe your task",required:true,defaultValue:task.description},
    {type:"combo",label:"Assign to",name:"assignedTo",placeholder:"Assign to",required:true,
     defaultValue:(task.assignedTo as ClubMember)._id,
     options:
      members.data.members.map(m=>({label:m.name!,value:m._id!}))
    },
    {type:"select",label:"Priority",options:[{value:"high",label:"high"},{value:"medium",label:"medium"},{value:"low",label:"low"}],name:"priority",defaultValue:task.priority,placeholder:"Select Priority"},
    {type:"date",label:"Due date",name:"dueDate",placeholder:"Due Date",required:true,gte:new Date(),defaultValue:new Date(task.dueDate!!)},
    
  ]
  return(
    <Dialog open={selectedTask?.purpose.startsWith("view")} >
       
    <DialogContent className=''>
    
        <DialogTitle className='flex'>
<p className='flex-1'>
{selectedTask?.task.title}
</p>
{selectedTask?.purpose.endsWith("edit") &&selectedTask.task.status!=="completed"&&<span className='mr-12 bg-white p-1 rounded-md text-black cursor-pointer' onClick={()=>{setIsEditing(!isEditing)}}>{!isEditing?<PencilIcon/>:<XIcon/>}</span>}
      
        </DialogTitle>

    
     {isEditing?
    <CustomForm
      fields={editTaskFormFields}
      onSubmit={handleUpdateTask}
      submitDisabled={isSubmitting}
      submitText='Save Changes'
    /> :
    <>
     <Card className="w-full  transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
{/* Header */}
<CardHeader className="f p-3">
<div className="flex items-center gap-2">
  <CardTitle className="text-lg truncate">{task.title}</CardTitle>
  {task.priority && (
    <Badge className={`px-2 ${priorityColors[task.priority] || "bg-gray-400"}`}>
      {task.priority}
    </Badge>
  )}
</div>
<Badge className={`${statusColors[task.status]} w-20`}>{task.status}</Badge>
</CardHeader>

{/* Content */}
<CardContent className="px-3 py-0">
<CardDescription className="text-sm truncate">{task.description?.slice(0, 120) || "No description provided."}</CardDescription>
{task.assignedBy&&<div className='flex gap-3'>
    <p>Assigned By</p>
    <p>{(task.assignedBy as ClubMember).name}</p>
</div>}
{task.assignedTo&&<div className='flex gap-3'>
    <p>Assigned To</p>
    <p>{(task.assignedTo as ClubMember).name}</p>
</div>}
</CardContent>

{/* Footer */}
<CardFooter className="flex justify-between items-center px-3 py-2">
<div className="flex items-center gap-2">
  {task.dueDate && (
    <Badge className={`${task.dueDate < new Date() ? "bg-orange-500" : "bg-green-400"} w-24`}>
      {format(task.dueDate, "PPP")}
    </Badge>
  )}
  {task.completedAt && <Badge className="bg-blue-500 w-24">Completed: {format(task.completedAt, "PPP")}</Badge>}
</div>
<div className="flex items-center gap-2">
  {task.attachements && task.attachements.length > 0 && (
    <Button variant="ghost" size="sm" className="flex items-center gap-1">
      <Paperclip size={16} /> {task.attachements.length}
    </Button>
  )}
</div>
</CardFooter>
</Card>
    </>
    }
  <Button onClick={()=>{dispatch(setSelectedTask(null))}} >Close</Button>
    </DialogContent>

</Dialog>
  )
}

export const CompleteTaskDialog = ()=>{
  const selectedTask = useAppSelector(state=>state.club.selectedTask.data)
  const clubContext = useClub()
  const dispatch = useAppDispatch()
  const fields:FormField[] = [
    {
      label:"Comment",
      type:"textarea",
      name:"comment",
      placeholder:"Comment",
    }
    
  ]
  const [isSubmitting,setIsSubmitting] = useState(false);
  const task = selectedTask?.task;
  if(!task){
    return <></>
  }
  const open = selectedTask?.purpose==="complete"
  const handleComplete = async(data:any)=>{
    setIsSubmitting(true)
    try {
      const req = await axios.put(`${BACKEND_URL}/club/tasks/complete`,{...data,attachements:[]},{
        params:{
          club_id:clubContext.selectedClub?._id,
          task_id:task?._id
        },
        headers:{"Authorization":`Bearer ${Cookies.get("access-token")}`}
      })
      toast({title:"Task completed"})
      dispatch(updateTask({...task,status:'completed',completionComment:data.comment}))
      dispatch(setSelectedTask(null));
    } catch (error) {
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message;
      toast({
        title:message,
        variant:"destructive"
      })
    }
    finally{
      setIsSubmitting(false)
    }
  }
  return(
    <Dialog open={open} onOpenChange={(o)=>{if(!o){
      dispatch(setSelectedTask(null))
    }}}>
  
    <DialogContent>
    <DialogTitle>Complete Task</DialogTitle>
    <CustomForm submitDisabled={isSubmitting} fields={fields} onSubmit={handleComplete}/>
      <Button onClick={()=>{dispatch(setSelectedTask(null))}}>Close</Button>
    </DialogContent>

    </Dialog>
  )
}