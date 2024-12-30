"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCard } from "./TableCard";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type Submission = {
  _id:string,
  userDetails:{
    username:string,
    name:string,
    email:string
  },
  submittedAt:Date
}
export function SubmissionsTable({submissions,viewAll}:{submissions:Submission[],viewAll:boolean}) {
  return (
    <TableCard viewAll={viewAll} title="Form Submissions" viewAllHref="/account/club/events/analytics/form-responses">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-slate-800/50">
            <TableHead className="text-slate-400">ID</TableHead>
            <TableHead className="text-slate-400">Name</TableHead>
            <TableHead className="text-slate-400">Email</TableHead>
            <TableHead className="text-slate-400">Date</TableHead>
            <TableHead className="text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub._id} className="hover:bg-slate-800/50">
              <TableCell className="text-yellow-500">{sub._id}</TableCell>
              <TableCell className="text-slate-200"><Link href={`/user/${sub.userDetails.username}`}>{sub.userDetails.name}</Link></TableCell>
              <TableCell className="text-slate-200">{sub.userDetails.email}</TableCell>
           
              <TableCell className="text-slate-200">{format(sub.submittedAt,"dd/mm/yyyy")}</TableCell>
              <TableCell className="text-slate-200"> <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sub._id)}
            >
              Copy event ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link href={`/account/club/events/analytics/form-responses/${sub._id}`}>View Details</Link></DropdownMenuItem>
          
          </DropdownMenuContent>
        </DropdownMenu></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}