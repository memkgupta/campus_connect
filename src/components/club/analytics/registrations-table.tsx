"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCard } from "./table-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

// const registrations = [
//   { id: "REG001", name: "John Doe", email: "john@example.com", date: "2024-03-21", status: "Confirmed", ticketType: "VIP" },
//   { id: "REG002", name: "Jane Smith", email: "jane@example.com", date: "2024-03-21", status: "Pending", ticketType: "Regular" },
//   { id: "REG003", name: "Mike Johnson", email: "mike@example.com", date: "2024-03-20", status: "Confirmed", ticketType: "VIP" },
// ];
type Registration ={
    _id:string,user:{username:string,name:string,email:string},updatedAt:Date
}
export function RegistrationsTable({registrations,eventId,viewAll}:{registrations:Registration[],eventId:string,viewAll:boolean}) {
  return (
    <TableCard viewAll={viewAll} title="Recent Registrations" viewAllHref={`/account/club/events/analytics/registrations?eid=${eventId}`}>
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
          {registrations.map((reg,index) => (
            <TableRow key={reg._id} className="hover:bg-slate-800/50">
              <TableCell className="text-yellow-500">{index}</TableCell>
              <TableCell className="text-slate-200"><Link href={`/user/${reg.user.username}`}>{reg.user.name}</Link></TableCell>
              <TableCell className="text-slate-200">{reg.user.email}</TableCell>
            
              <TableCell className="text-slate-200">{format(reg.updatedAt,"dd/mm/yyyy")}</TableCell>
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
              onClick={() => navigator.clipboard.writeText(reg._id)}
            >
              Copy event ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link href={`/account/club/events/analytics/registrations/${reg._id}`}>View Details</Link></DropdownMenuItem>
          
          </DropdownMenuContent>
        </DropdownMenu></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}