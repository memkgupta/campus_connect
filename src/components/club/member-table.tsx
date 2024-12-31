"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditMemberDialog } from "./edit-member-dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";

export function MemberTable() {
  const [selectedMember, setSelectedMember] = useState<any>(null);
    const fetchMembers = async()=>{
        try {
            const res = await axios.get(`${BACKEND_URL}/club/members`,{headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            }})
return res.data.members;
        } catch (error) {
            toast({
                title:"Some error occured",
                variant:"destructive"
            })
            return Promise.reject("Som error occured")
        }
    }
  const {data:members,isLoading} = useQuery({
        queryKey:['members'],
        queryFn:fetchMembers
    })
  return (
    <div className="rounded-md border border-slate-800">
     {isLoading?( (<div className="w-full flex justify-center">
            <Loader2 className="animate-spin text-gray-400"/>
        </div>)): <Table>
        <TableHeader className="bg-slate-900">
          <TableRow>
            <TableHead className="text-yellow-400">Name</TableHead>
            <TableHead className="text-yellow-400">Email</TableHead>
            <TableHead className="text-yellow-400">Role</TableHead>
            <TableHead className="text-yellow-400">Team</TableHead>
            <TableHead className="text-yellow-400">Joined Date</TableHead>

            <TableHead className="text-yellow-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {(
            <TableBody>
            {members&&members.map((member:any) => (
              <TableRow key={member._id} className="border-slate-800">
                <TableCell className="font-medium text-white">{member.name}</TableCell>
                <TableCell className="text-slate-300">{member.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                    {member.crole}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300">{member.team}</TableCell>
                <TableCell className="text-slate-300">
                  {format(new Date(member.joinedAt), "PP")}
                </TableCell>
              
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950"
                    onClick={() => setSelectedMember(member)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>}
      {selectedMember && (
        <EditMemberDialog
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}