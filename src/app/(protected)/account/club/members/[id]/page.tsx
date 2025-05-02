"use client"
import { toast } from '@/components/ui/use-toast';
import { BACKEND_URL } from '@/constants';
import { useClub } from '@/hooks/useClubContext'
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { format } from 'date-fns';
import CustomImage from '@/components/ui/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/utils/forms/types';
import { useAppSelector } from '@/lib/hooks';
import CustomForm from '@/components/utils/forms/custom-form';
interface MemberCardProps {
    member: {
      _id: string;
      role: string;
      team: string;
      status: string;
      joinedAt: string;
      userDetails: {
        profile: string;
        name: string;
        email: string;
        username: string;
        bio: string;
        socials: string[];
      };
    };
  }
const MemberById = ({params}:{params:{id:string}}) => {
    const clubContext = useClub();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const router = useRouter()
    const [member,setMember] = useState<any>(null);
    const handleSave = async(updatedMember: typeof member) => {
    try {
        const req = await axios.put(`${BACKEND_URL}/club/members/update`,{
            updatedMember
        },{headers:{
            "Authorization":`Bearer ${Cookies.get("access-token")}`
        },params:{
            club_id:clubContext.selectedClub?._id
        }})
        setMember({...member,updatedMember})
toast({
    title:"Updated"
})
    } catch (error) {
        const aerror = error as AxiosError<any>
        const message = aerror.response?.data.message || "Some error occured"
        toast({
            title:message,
            variant:"destructive"
        })
    }
      setIsEditOpen(false);
    };
 
    const handleRemove = async() => {
        try {
            const req = await axios.put(`${BACKEND_URL}/club/members/update`,{
             status:'Removed'
            },{headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            },params:{
                club_id:clubContext.selectedClub?._id,member_id:params.id
            }})
    toast({
        title:"Removed"
    })
    router.back();
        } catch (error) {
            const aerror = error as AxiosError<any>
            const message = aerror.response?.data.message || "Some error occured"
            toast({
                title:message,
                variant:"destructive"
            })
        }
      setIsRemoveOpen(false);
    };
  
    const fetchMember = async()=>{
        try {
            const req = await axios.get(`${BACKEND_URL}/club/members/view`,{
                headers:{
                    "Authorization":`Bearer ${Cookies.get("access-token")}`
                },
                params:{club_id:clubContext.selectedClub?._id,member_id:params.id}
            })
setMember(req.data.member)
            return req.data.member;
        } catch (error) {
            const aerror = error as AxiosError<any>
            const message = aerror.response?.data.message || "Some error occured"
            toast({
                title:message,
                variant:"destructive"
            })
            return Promise.reject("Some error occured");
        }
       
    }
   
    const {data,isLoading}=useQuery({
        queryKey:["club-member",params.id],
        queryFn:fetchMember,
        retry:false,
        refetchOnWindowFocus:false
    })
  return (
    <div>{isLoading&&<Loader/>
        
        }
  {member&&<div className="bg-slate-950 text-white p-6 rounded-2xl shadow-lg border border-yellow-400 ">
      {/* Profile Picture */}
      <div className='flex justify-between'>
      <div className="flex items-center space-x-4 flex-1">
        <CustomImage
          src={member.userDetails.profile}
          alt={member.userDetails.name}
          className="w-16 h-16 rounded-full border-2 border-yellow-400"
        />
        <div>
          <h2 className="text-lg font-semibold">{member.userDetails.name}</h2>
          <p className="text-yellow-400 text-sm">@{member.userDetails.username}</p>
        </div>
      </div>
        <div className='flex gap-2'>
           
        <EditMemberModal  onSave={handleSave} member={member} />
        <RemoveMemberModal  onConfirm={handleRemove} />
        </div>
      </div>
     

      {/* User Details */}
      <div className="mt-4">
        <p className="text-slate-300 text-sm">{member.userDetails.bio || "No bio available"}</p>
        <p className="text-slate-300 text-sm mt-1">{member.userDetails.email}</p>
      </div>

      {/* Role, Team & Status */}
      <div className="mt-4">
        <p className="text-sm">
          <span className="font-semibold text-yellow-400">Role:</span> {member.role}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-yellow-400">Team:</span> {member.team}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-yellow-400">Status:</span> {member.status}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-yellow-400">Joined:</span>{" "}
          {format(new Date(member.joinedAt), "PP")}
        </p>
      </div>

      {/* Social Links */}
      {member.userDetails.socials?.length > 0 && (
        <div className="mt-4 flex space-x-3">
          {member.userDetails.socials.map((social:any, index:any) => (
            <a
              key={index}
              href={social}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 text-xl"
            >
              {/* {social} */}
            </a>
          ))}
        </div>
      )}
    </div>}

    </div>
  )
}

export default MemberById

interface Member {

    role: string;
    team: string;
  }
  
  interface EditMemberModalProps {
    member: Member;
   
    onSave: (updatedMember: Member) => void;
  }
  
 export  const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onSave }) => {
    const [role, setRole] = useState(member.role);
    const [team, setTeam] = useState(member.team);
    const {roles,teams} = useAppSelector(state=>state.club) 
    const memberFormFields:FormField[] = [
     {
       label:"Name",
       name:"name",
       type:"text",
       placeholder:"Enter the name of member",
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
    
   ]
   const handleSubmit = async(data:any)=>{

   }
    return (
      <Dialog>
        <DialogTrigger className='bg-yellow-300 text-black rounded-md p-2'>Edit </DialogTrigger>
        <DialogContent className="bg-slate-900 text-white border border-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Edit Member</DialogTitle>
          </DialogHeader>
  
          {/* <div className="space-y-4"> */}
            {/* Role Selection */}
            {/* <div>
              <label className="text-sm text-slate-300">Role</label>
              <Select onValueChange={setRole} defaultValue={role}>
                <SelectTrigger className="w-full bg-slate-800 text-white border-yellow-400">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white">
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
  
            {/* Team Input */}
            {/* <div>
              <label className="text-sm text-slate-300">Team</label>
              <Input
                type="text"
                className="w-full bg-slate-800 text-white border-yellow-400"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div> */}
          {/* </div> */}
  <CustomForm
  fields={memberFormFields}
  onSubmit={handleSubmit}
  />
          <DialogFooter>
            <Button variant="outline" className="border-yellow-400 text-yellow-400" >
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={() => onSave({ role, team })}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  interface RemoveMemberModalProps {

    onConfirm: () => void;
  }
  
  export const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({  onConfirm }) => {
    return (
      <Dialog >
        <DialogTrigger className='bg-red-400 text-white p-2 rounded-md'>Remove</DialogTrigger>
        <DialogContent className="bg-slate-900 text-white border border-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Remove Member</DialogTitle>
          </DialogHeader>
  
          <p className="text-slate-300">Are you sure you want to remove this member? This action cannot be undone.</p>
  
          <DialogFooter>
            <Button variant="outline" className="border-yellow-400 text-yellow-400" >
              Cancel
            </Button>
            <Button className="bg-red-500 text-white hover:bg-red-600" onClick={onConfirm}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };