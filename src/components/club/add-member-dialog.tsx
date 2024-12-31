"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useDebounceCallback } from "usehooks-ts";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import { toast } from "../ui/use-toast";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
const [query,setQuery] = useState('');
const [isSubmitting,setIsSubmitting] = useState(false);
const debounced  = useDebounceCallback(setQuery,500);
const [formData,setFormData] = useState({

    userEmail:'',
    role:'',
    team:'',
    joinedAt:new Date(),
    status:'Active'
})
// const [clubId,setClubId] = useState()
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
  try {
    setIsSubmitting(true)
if(formData.userEmail===''||formData.role==='',formData.team===''){
    toast({
        title:"Please all the fields",
        variant:"destructive",
        color:"yellow"
    })
    setIsSubmitting(false)
    return;
}
    const res = await axios.post(`${BACKEND_URL}/club/member/add`,formData,{
        headers:{Authorization:`Bearer ${Cookies.get('access-token')}`}
    });
    if(res.data.success){
        toast({
            title:"Member added successfully",
            color:"green"
        });

    }
  } catch (error) {
    toast({
        title:"Some error occured",
        variant:"destructive"
    })
  }
  finally{
    setIsSubmitting(false);
  }
    setOpen(false);
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-400 text-slate-950 hover:bg-yellow-500">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Add New Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Role</Label>
              <Input onChange={(e)=>setFormData(prev=>({...prev,role:e.target.value}))} id="role" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input  onChange={(e)=>setFormData(prev=>({...prev,userEmail:e.target.value}))} id="email" type="email" className="bg-slate-800 border-slate-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team" className="text-white">Team</Label>
              <Input  onChange={(e)=>setFormData(prev=>({...prev,team:e.target.value}))} id="team" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-500">
            Add Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}