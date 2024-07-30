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
    name:string,

    maxCapacity:string,
    location:string,
    brief_description:string,
    dateTime:Date,
}

export const columns:ColumnDef<RegistrationRequestColumn>[]=[
  
    {
        accessorKey:"name",
        header:"Name"
            },
    {accessorKey:"brief_description",
        header:"Description",
    
    },
        {
            accessorKey:"maxCapacity",
            header:"Max Capacity"
        },
        {accessorKey:"location",
            header:"location"
        },
        {
            accessorKey:"dateTime",
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
          const event = row.original
     
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
                
                  <Link href={`/account/club/events/${event._id}`} className="text-sm  hover:bg-slate-950 hover:border w-full py-2 px-5 rounded-md">View</Link>
              
                <DropdownMenuSeparator />
               
                
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
  
       
]