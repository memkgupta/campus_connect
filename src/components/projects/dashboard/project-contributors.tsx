import { BACKEND_URL } from '@/constants'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from '@/components/ui/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounceCallback } from 'usehooks-ts'
import { CustomTable } from '@/components/ui/custom-table'
import { ColumnDef } from '@tanstack/react-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useQueryState } from 'nuqs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
export interface Contributor {
    _id:string,
    user:string,
    project_id:string,
    role:string,
    name:string,
    username:string,
    profile:string
}
interface ContributorModalProps {
    isOpen: boolean;
    onClose: () => void;
    contributor: Contributor;
  }
const ProjectContributors = ({project_id}:{project_id:string}) => {
    const [filters,setFilters] = useState({
        username:"",role:"",name:"",page:1
    })
    const [totalResults,setTotalResults] =useState(0);
    const colums:ColumnDef<Contributor>[] =[
        {
            accessorKey:"profile",
            header:"profile"
        },
        {
            accessorKey:"name",
            header:"Name"
        },
        {
            accessorKey:"role",
            header:"Role",
        },
        {
            accessorKey:"username",
            header:"Username"
        },
      {
        accessorKey:"_id",
        header:"Actions",
        cell:({row})=>{
            return(
                <Link className='bg-yellow-300 p-3 text-black' href={`/account/projects/my-projects/${project_id}/contributors/${row.original._id}`}/>
                // <ContributorModal project_id={project_id} contributor={row.original} />
            )
        }
      }

    ]
    
    const debouncedFilters = useDebounceCallback(setFilters,500);
    const handleFilterChange = (name:string,value:any)=>{
        console.log(name);
        console.log(value);
        debouncedFilters((prev)=>({...prev,[name]:value}))
      }
  const handlePagination =(state:{pageNumber:number,totalResults:number})=>{
    debouncedFilters((prev) => {
      // Ensure `updater` is correctly applied
      
      return { ...prev, page: state.pageNumber};
    });}
    const fetchContributors = async()=>{
        try {
            const req = await axios.get(`${BACKEND_URL}/projects/contributors/all`,{
                params:{
                   ...filters, pid:project_id
                },
                headers:{
                    "Authorization":`Bearer ${Cookies.get("access-token")}`
                }
            })
            setTotalResults(req.data.totalResults);
            return req.data.contributors;
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            const message = axiosError.response?.data.message || "Some error occured";
            toast({
                title:message,
                variant:'destructive'
            })
            return Promise.reject(message)
        }
    }
    const {data:contributors,isLoading} = useQuery({
        queryKey:["project-contributors",{...filters}],
        queryFn:fetchContributors,
        retry:false,
        refetchOnWindowFocus:false
    })
  return (
    <div>

<CustomTable 
data={contributors}
columns={colums}
filterState={filters}
filterable={[{label:"name",type:"text"},{label:"username",type:"text"},{label:"role",type:"text"}]}
handleFilterStateChange={handleFilterChange}
manualPagination={true}
onPageChange={handlePagination}
pageSize={10}
pagination={false}
totalResults={totalResults}/>
    </div>
  )
}
const ContributorModal = ({ project_id,contributor }:{project_id:string,contributor:Contributor}) => {
    const queryClient = useQueryClient();
  
    const [role, setRole] = useState(contributor.role);
    const [isDeleting, setIsDeleting] = useState(false);
  
    // Mutation for updating contributor
    const updateMutation = useMutation({
      mutationFn: async (updatedRole: string) => {
        await axios.put(`${BACKEND_URL}/projects/contributors/${contributor._id}`, { role: updatedRole },{
            headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            },
            params:{
                pid:project_id
            }
        });
      },
      onSuccess: () => {
        toast({
            title:"Contributor updated"
        });
        queryClient.invalidateQueries({queryKey:['project-contributors']});
        
      },
      onError: (err) => {
        const aError = err as AxiosError<any>
        const message = aError.response?.data.message||"Some error occured" 
        toast({
            title:message,
            variant:"destructive"
        });
      },
    });
  
    // Mutation for deleting contributor
    const deleteMutation = useMutation({
      mutationFn: async () => {
        await axios.delete(`${BACKEND_URL}/projects/contributors/${contributor._id}`,{
            headers:{
                "Authorization":`Bearer ${Cookies.get("access-token")}`
            },
            params:{
                pid:project_id
            }
        });
      },
      onSuccess: () => {
        toast({title:"Contributor removed!"});
        queryClient.invalidateQueries({
            queryKey:["project-contributors"]
        });
      
      },
      onError: (err) => {
        const aError = err as AxiosError<any>
        const message = aError.response?.data.message||"Some error occured" 
        toast({
            title:message,
            variant:"destructive"
        });
   
      },
    });
  
    return (
      <Dialog >
        <DialogContent className="max-w-md p-6 space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Contributor</DialogTitle>
          </DialogHeader>
  
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <img src={contributor.profile} alt={contributor.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-medium">{contributor.name}</p>
              <p className="text-sm text-gray-500">@{contributor.username}</p>
            </div>
          </div>
  
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium">Role</label>
          <Input value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={updateMutation.isPending}></Input>
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-between">
            {/* Update Button */}
            <Button
              onClick={() => updateMutation.mutate(role)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
  
            {/* Delete Button */}
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleting(true);
                deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending || isDeleting}
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };



export default ProjectContributors