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
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useDebounceCallback } from "usehooks-ts";
import { ClubMember } from "@/types/club-dashboard";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import { toast } from "../ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useClub } from "@/hooks/useClubContext";
import CustomForm from "../utils/forms/custom-form";
import { FormField } from "../utils/forms/types";
import { useAppSelector } from "@/lib/hooks";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const {invalidateQueries} = useQueryClient()
const [query,setQuery] = useState('');
const [isSubmitting,setIsSubmitting] = useState(false);
const debounced  = useDebounceCallback(setQuery,500);
const clubContext = useClub();
const {members,roles} = useAppSelector(state=>state.club);
 const memberFormFields:FormField[] = [
  {
    label:"Name",
    name:"name",
    type:"text",
    placeholder:"Enter the name of member",
    required:true,
  },
  {
    label:"Email",
    name:"email",
    type:"text",
    placeholder:"Enter registered email",
    required:true,
  },
  {
    label:"Role",
    name:"role",
    type:"select",
    placeholder:"Select the role",
    options:roles.data.map(role=>({value:role._id!!,label:role.role!!})),
    required:true 
  },
  {
    label:"Joined at",
    name:"joinedAt",
    type:"date",
    lte:new Date(),
    // gte:new Date(),
  }
]
  const handleSubmit = async(data:Record<string,any>) => {
   
if(clubContext.selectedClub?._id){
  try {
    setIsSubmitting(true)
if(data.userEmail===''||data.role==='',data.team===''||!data.joinedAt){
    toast({
        title:"Please all the fields",
        variant:"destructive",
        color:"yellow"
    })
    setIsSubmitting(false)
    return;
}
    const res = await axios.post(`${BACKEND_URL}/club/members/add`,data,{
        headers:{Authorization:`Bearer ${Cookies.get('access-token')}`},params:{
          club_id:clubContext.selectedClub?._id
        }
    });
    if(res.data.success){
        toast({
            title:"Member added successfully",
            color:"green"
        });
        setIsSubmitting(false);
        setOpen(false);
return true;
    }
  } catch (error) {
    console.log(error);
    toast({
        title:"Some error occured",
        variant:"destructive"
    })
    setIsSubmitting(false);
    
    return false;
  }
}
  
  
  };
  
const mutation = useMutation({
  mutationFn:handleSubmit,
  onSuccess:()=>
  {
    invalidateQueries({predicate:(query)=>query.queryKey[0]==="club-members"})
  }
})
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
        {/* <form onSubmit={mutation.mutate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 place-items-center">
            <div className="w-full">
              <Label>Select Role *</Label>
            <Select onValueChange={(v)=>{setFormData({...formData,role:v})}}>
  <SelectTrigger className="w-200px bg-slate-800">
    <SelectValue placeholder="Role " />
  </SelectTrigger>
  <SelectContent>
    {['President', 'Vice President', 'Secretary', 'Treasurer', 'Member', 'Head','Applicant'].map((r)=>{return(
<SelectItem value={r} key={r}>{r}</SelectItem>
    )})}
  </SelectContent>
</Select>
            </div>
            <div className="">
              <Label htmlFor="email" className="text-white">Registered User Email *</Label>
              <Input  onChange={(e)=>setFormData(prev=>({...prev,userEmail:e.target.value}))} id="email" type="email" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="w-full space-y-2">
              <Label>Joining Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
               
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full bg-slate-800 pl-3 text-left font-normal",
                        !formData.joinedAt && "text-muted-foreground"
                      )}
                    >
                      {formData.joinedAt ? (
                        format(formData.joinedAt, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
              
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.joinedAt}
                    onSelect={(d)=>d&&setFormData({...formData,joinedAt:d})}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
   
            <div className="space-y-2">
              <Label htmlFor="team" className="text-white">Team *</Label>
              <Input  onChange={(e)=>setFormData(prev=>({...prev,team:e.target.value}))} id="team" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-500">
            Add Member
          </Button>
        </form> */}
        <CustomForm
         fields={memberFormFields}
         onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}