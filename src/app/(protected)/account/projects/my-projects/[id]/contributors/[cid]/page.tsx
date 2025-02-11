"use client"
import { toast } from '@/components/ui/use-toast'
import { BACKEND_URL } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { UserCircle, Trash2, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'
const ProjectContributorsPage = ({params}:{params:{id:string,cid:string}}) => {
  const fetchContributor = async()=>{
try {
  const req = await axios.get(`${BACKEND_URL}/projects/contributors/view`,{
    params:{
      pid:params.id,
      cid:params.cid
    },
    headers:{
      "Authorization":`Bearer ${Cookies.get("access-token")}`
    }
  })
  return req.data.contributor;
} catch (error) {
  const axiosError = error as AxiosError<any>
  const message = axiosError.response?.data.message||"Some error occured";
  toast({
    title:message,
    variant:"destructive"
  });
  return Promise.reject("Some error occured")
}
}
  // const [role, setRole] = useState(contributor.role);
  const [isDisabled, setIsDisabled] = useState(false);
const router = useRouter();
  
    const {data:contributor,isLoading} = useQuery({
        queryKey:["contributor",params.cid],
        queryFn:fetchContributor,
        retry:false,
        refetchOnWindowFocus:false
    })
    const handleRoleChange = async (updatedRole: string) => {
  try {
    setIsDisabled(true)
    await axios.put(`${BACKEND_URL}/projects/contributors/${contributor._id}`, { role: updatedRole },{
      headers:{
          "Authorization":`Bearer ${Cookies.get("access-token")}`
      },
      params:{
          pid:params.id
      }
  });
  toast({
    title:"Updated"
  })
  } catch (error) {
    const axiosError = error as AxiosError<any>
    const message = axiosError.response?.data.message||"Some erorr occured";
    toast({
      title:message,
      variant:"destructive"
    })
    
  }
  finally{
    setIsDisabled(false)
  }
    }
  
    const handleRemove = async () => {
  try {
    setIsDisabled(true)
     const req =  await axios.delete(`${BACKEND_URL}/projects/contributors/${contributor._id}`,{
            headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            },
            params:{
                pid:params.id
            }
        });
        toast({
          title:"Deleted"
        })
        router.replace(`/account/my-projects/${params.id}?tab=contributors`)
  } catch (error) {
    const axiosError = error as AxiosError<any>
    const message = axiosError.response?.data.message||"Some erorr occured";
    toast({
      title:message,
      variant:"destructive"
    })
    
  }
  finally{
    setIsDisabled(false)
  }
    }
  return (
    <div>
      {isLoading?<Loader/>: <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-card-foreground">
              {contributor.userDetails[0].name}
            </h2>
            <p className="text-muted-foreground">@{contributor.userDetails[0].username}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="text-card-foreground font-medium">{contributor.role}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>
                  Change the role of this contributor.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue={contributor.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project ID */}
        <div>
          <p className="text-sm text-muted-foreground">Project ID</p>
          <p className="text-card-foreground font-mono text-sm">
            {contributor.project_id}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Contributor
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the
                  contributor from the project.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemove}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  </div>}
    </div>
  )
}

export default ProjectContributorsPage