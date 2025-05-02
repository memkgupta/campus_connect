"use client"
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { CustomTable } from '@/components/ui/custom-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import CustomForm from '@/components/utils/forms/custom-form'
import { FormField } from '@/components/utils/forms/types'
import { useAppSelector } from '@/lib/hooks'
import { Team } from '@/types/club-dashboard'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import React from 'react'

const TeamsPage = () => {
  const data = useAppSelector(state=>state.club);
 const teamColumns: ColumnDef<Team>[] = [
    {
      accessorKey: "name",
      header: "Team Name",
    },
    {
      accessorKey: "lead",
      header: "Team Lead",
      cell: ({ row }) => row.original.head?.name || "N/A",
    },
    {
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => row.original.members?.length,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>
         
      
          <Dialog>
          <DialogTrigger className=''>Edit <Plus/></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Edit Team"}</DialogTitle>
        </DialogHeader>
     
        <CustomForm
        fields={teamFormFields.map((f=>({...f,defaultValue:row.original[f.name as keyof Team] as any})))}
        onSubmit={handleAddTeam}
       
        />
      </DialogContent>
    </Dialog>
        </DropdownMenuContent>
       </DropdownMenu>
      ),
    },
  ];
const teamFormFields: FormField[] = [
    {
      name: "title",
      label: "Team Name",
      type: "text",
      placeholder: "Enter team name",
      required: true,
    },
    {
      name:"description",
      label:"Enter the description",
      type:"textarea",
      placeholder:"Enter the team description",
      required:true
    },
    {
      name: "lead",
      label: "Team Lead",
      type: "select",
      placeholder: "Select team lead",
      options:data.members.data.members.map(m=>({label:m.name!!,value:m._id!!})), // Populate dynamically with users
      required: true,
    },

   
  ];
  const handleAddTeam = async(data:any)=>{
    try {
      console.log(data)
    } catch (error) {
      
    }
  }
  return (
    <div>
      <div className='flex justify-end px-12 mt-12'>
      <Dialog>
          <DialogTrigger className='bg-yellow-400 rounded-md p-2 flex items-center gap-2 text-black '>Add Team <Plus/></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Add Team"}</DialogTitle>
        </DialogHeader>
     
        <CustomForm
        fields={teamFormFields}
        onSubmit={handleAddTeam}

        />
      </DialogContent>
    </Dialog>
      </div>
    
        {/* Table */}
      {!(data.teams.error) && <CustomTable 
        columns={teamColumns}
        data={data.teams.data}
        isLoading={data.teams.isLoading}


        />}
    </div>
  )
}

export default TeamsPage