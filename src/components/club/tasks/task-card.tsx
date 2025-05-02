import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import CustomForm from '@/components/utils/forms/custom-form'
import { FormField } from '@/components/utils/forms/types'
import { BACKEND_URL } from '@/constants'
import { useClub } from '@/hooks/useClubContext'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ClubMember, ClubTask } from '@/types/club-dashboard'
import axios, { AxiosError } from 'axios'
import { format } from 'date-fns'
import { ArrowUpRight, Paperclip, PencilIcon, Square, SquareActivityIcon, SquareCheck, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from '@/components/ui/use-toast'
import { setSelectedTask, updateTask } from '@/lib/slices/clubSlice'
import { Checkbox } from '@/components/ui/checkbox'
const TaskCard = ({ task,allowEditing }: { task: ClubTask,allowEditing?:boolean }) => {
 
  
    const dispatch = useAppDispatch()

  

  return (
    
    <Card  className=" min-w-[300px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className='mt-2 ml-2'>
     
         
            <span onClick={()=>{task.status!=="completed"&&dispatch(setSelectedTask({task:task,purpose:"complete"}))}}>{task.status!=="completed"?<Square />:<SquareCheck/>}</span>
           
       
      </div>
      <CardHeader className="flex  p-3">
        <CardTitle className="flex-1 text-lg truncate">{task.title}</CardTitle>
        <Badge
          className={`${task.status === "todo" ? "bg-yellow-300" : task.status === "in_progress" ? "bg-orange-400" : "bg-green-400"} max-w-20`}
        >
          {task.status}
        </Badge>
      </CardHeader>
      <CardContent className="px-3 py-0">
        <CardDescription className="text-sm truncate">{task.description?.slice(0, 120)}...</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between px-3 py-2">
        <Badge className={`${task.dueDate! < new Date() ? "bg-orange-500" : "bg-green-400"}`}>
          {format(task.dueDate!!, "PPP")}
        </Badge>
      </CardFooter>
      
    <span onClick={()=>{dispatch(setSelectedTask({task:task,purpose:allowEditing?"view-edit":"view"}))}} className='text-end'><ArrowUpRight/></span>
    </Card>
   
  
  );
};

export default TaskCard;
