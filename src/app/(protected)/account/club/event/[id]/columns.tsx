"use client"

import {ColumnDef,} from "@tanstack/react-table"

import Link from "next/link"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
export type RegistrationRequestColumn = {
    _id:string,
    user_name:string,
    user_profile:string,
    user_username:string,
    
    note:string,
    date:Date,
}

export const columns:ColumnDef<RegistrationRequestColumn>[]=[
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
        accessorKey:"user_name",
        header:"Name"
            },
    {accessorKey:"user_username",
        header:"User Profile",
    cell:({row})=>{
        return <div className="text-right font-medium"><Link href={`/user/${row.getValue("user_username")}`}>{row.getValue("user_username")}</Link></div>
    }
    },
        {
            accessorKey:"note",
            header:"Applicant note"
        },
        {
            accessorKey:"date",
            header:({column})=>{
                return(
                    <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Date  <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
                )
            },

        },
      {
        id: "actions",
        cell: ({ row }) => {
          const registration = row.original
     
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                
                  <Link href={`/account/club/events/registrations/${registration._id}`} className="text-sm  hover:bg-slate-950 hover:border w-full py-2 px-5 rounded-md">View</Link>
              
                <DropdownMenuSeparator />
               
                
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
  
       
]