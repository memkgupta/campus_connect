// "use client"
// import { Button } from '@/components/ui/button';
// import { CustomTable } from '@/components/ui/custom-table';
// import { Dialog, DialogHeader } from '@/components/ui/dialog';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { FormField } from '@/components/utils/forms/types';
// import { useAppSelector } from '@/lib/hooks'
// import { ClubMember, ClubPermission, ClubRole } from '@/types/club-dashboard';
// import { DialogTitle } from '@headlessui/react';
// import { DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
// import { ColumnDef } from '@tanstack/react-table';
// import { CheckIcon, PencilIcon, PlusIcon, XIcon } from 'lucide-react';
// import React, { useState } from 'react'

// const RolePage = () => {
//     const {roles,members,teams} = useAppSelector(state=>state.club);
   
//     const columns: ColumnDef<ClubMember>[] = [
//         {
//           accessorKey: "name",
//           header: "Name",
//           cell: ({ row }) => <span className="font-medium text-white">{row.original.name}</span>,
//         },
       
//         {
//           accessorKey: "team",
//           header: "Team",
//           cell: ({ row }) => <span className="text-slate-300">{teams.data.find(t=>t._id===row.original.teamId)?.title}</span>,
//         },
       
//         {
//           id: "actions",
//           header: "Actions",
//           cell: ({ row }) => (
//             <div className="text-right">
//             <RolesAndPermissionsDialog member={row.original}/>
//             </div>
//           ),
//         },
//       ];
  
//   return (
//     <div>
// {!roles?.error && <CustomTable
//         data={roles.data}
//         columns={columns}
//         isLoading={roles.isLoading}
//         />}
//     </div>
//   )
// }

// export const RolesAndPermissionsDialog = ({member}:{member:ClubMember})=>{
//     const {roles} = useAppSelector(state=>state.club);
//     const [selectedRole,setSelectedRole] = useState<ClubRole|null|undefined>(roles.data.find(r=>r._id===member.role))
//     const [permissions,setPermissions] = useState<ClubPermission[]>([]);
//     const [selectedPermission,setSelectedPermission] = useState<ClubPermission|null>(null);
//     const handleAddPermission = async(data:ClubPermission)=>{

//     }

//     const handleChangeRole = async()=>{

//     }
// return(

// <Dialog>
//     <DialogTrigger className='bg-yellow-300 text-black'>View</DialogTrigger>
//     <DialogContent>
//         <DialogHeader>
//             <DialogTitle>Roles And Permissions</DialogTitle>
//         </DialogHeader>
//         {/* Role section */}
//         <div>
//         <Select onValueChange={(v)=>setSelectedRole(roles.data.find(r=>r._id===v))}>
//   <SelectTrigger className="w-[180px]">
//     <SelectValue placeholder="Roles" />
//   </SelectTrigger>
//   <SelectContent>
//     {roles.data.map(r=>(
//         <SelectItem value={r._id!!} key={r._id!!}>{r.role}</SelectItem>
//     ))}
//   </SelectContent>
// </Select>
// <Button onClick={handleChangeRole} disabled={selectedRole?._id===member.role} className='bg-yellow-400 text-black'>Save</Button>
//         </div>
//         {/* Permissions Section */}

//         <div className='overflow-y-auto'>
//             <div className='flex justify-end' hidden={selectedPermission!=null}>
//                 <Button className='bg-yellow-300' onClick={(e)=>{
//                     permissions.unshift({_id:"",action:"",resource:"",member:member._id!!})
//                 }}><PlusIcon/></Button>
//             </div>
//            {permissions.map(p=>(
//             <div key={p._id} className='flex gap-3 justify-center items-center'>
//             <Select>
//             <SelectTrigger className='w-[180px]'/>
//             <SelectValue placeholder="Action"/>
//             <SelectContent>
//                 <SelectItem value='CRUD'>CRUD</SelectItem>
//                 <SelectItem value='ASSIGN'>ASSIGN</SelectItem>
//                 <SelectItem value='READ'>READ</SelectItem>
//                 <SelectItem value='WRITE'>WRITE</SelectItem>
//                 <SelectItem value='DELETE'>DELETE</SelectItem>
//             </SelectContent>
            
//             </Select>

//             <Select>
//                 <SelectTrigger className='w-[180px]'/>
//                 <SelectValue placeholder="Resource"/>
//                 <SelectContent>
//                     <SelectItem value='TEAM_TASKS'>TASKS</SelectItem>
//                     <SelectItem value='EVENTS'>EVENTS</SelectItem>
//                     <SelectItem value='MEMBERS'>MEMBERS</SelectItem>
//                     <SelectItem value="GLOBAL_TASKS">GLOBAL TASKS</SelectItem>
//                     <SelectItem value ="ROLES&PERMISSIONS">ROLES & PERMISSIONS</SelectItem>
//                 </SelectContent>
//             </Select>
//             <div className='flex gap-2'>
//         {selectedPermission?._id!==p._id?<Button className='bg-transparent text-yellow-400'><PencilIcon/></Button>:    <Button disabled={selectedPermission?._id!==p._id} className='bg-transparent text-green-400'><CheckIcon/></Button>}
//             <Button className='bg-transparent text-red-500'><XIcon/></Button>
//             </div>
           
//             </div>
//            ))}
//         </div>
//     </DialogContent>
// </Dialog>
// )
// }

// export default RolePage

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page