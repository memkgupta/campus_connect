"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/ui/custom-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogContent } from "@/components/ui/alert-dialog";
//@ts-ignore
import Loader from "@/components/Loader";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { headers } from "next/headers";
import { useRouter, useSearchParams } from "next/navigation";
 type CollaboratorRequest = {
  _id: string;
  user_id: string;
  skills: string[];
  contact_no: string;
  contact_email:string;
  name:string;
  role:string;
  status:string;
  createdAt:Date,
  username:string;
};

// const collaboratorRequests: CollaboratorRequest[] = [
//   {
//     id: "1",
//     name: "Sarah Wilson",
//     email: "sarah.wilson@example.com",
//     role: "Developer",
//     status: "pending",
//     requestDate: "2024-03-20",
//   },
//   {
//     id: "2",
//     name: "Michael Chen",
//     email: "michael.chen@example.com",
//     role: "Designer",
//     status: "approved",
//     requestDate: "2024-03-19",
//   },
//   {
//     id: "3",
//     name: "Emma Thompson",
//     email: "emma.t@example.com",
//     role: "Product Manager",
//     status: "rejected",
//     requestDate: "2024-03-18",
//   },
//   {
//     id: "4",
//     name: "James Rodriguez",
//     email: "james.r@example.com",
//     role: "Developer",
//     status: "pending",
//     requestDate: "2024-03-17",
//   },
// ];


export function ProjectCollaborators({project_id}:{project_id:string}) {
  const params = useSearchParams();
  const tab = params.get("tab")
  const [requests, setRequests] = useState<CollaboratorRequest[]>([]);
  const [totalResults,setTotalResults] = useState(0);
  const [sfilters,setFilters] = useState({
     name:"",
     username:"",
     role:"",
     skills:[],
     page:1
  });
  const debouncedFilters = useDebounceCallback(setFilters,500);
  const handleFilterChange = (name:string,value:any)=>{
   
    debouncedFilters((prev)=>({...prev,[name]:value}))
  }
  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setRequests(requests.map(request =>
      request._id === id ? { ...request, status: newStatus } : request
    ));
  };
  const handlePagination =(state:{pageNumber:number,totalResults:number})=>{
    debouncedFilters((prev) => {
      // Ensure `updater` is correctly applied
      
      return { ...prev, page: state.pageNumber};
    });
  } 
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500">Rejected</Badge>;
      default:
        return null;
    }
  };
  const fetchRequests = async(filters:any)=>{
    try {
      const req = await axios.get(`${BACKEND_URL}/projects/collaborate/requests`,{
        params:{...filters,pid:project_id},
        headers:{"Authorization":`Bearer ${Cookies.get("access-token")}`}
      })
      setTotalResults(req.data.totalResults);
      setRequests(req.data.requests);
      return req.data.requests;
    } catch (error) {
      const axiosError = error as AxiosError<any>
      const message = axiosError.response?.data.message || "Some error occured";
      toast({
        title:message,
        variant:"destructive"
      });
      return Promise.reject("Some error occured")
    }
  }
const {data,isLoading} = useQuery<CollaboratorRequest[]>({
  queryKey:["project-collab-requests",sfilters,tab],
  
  queryFn:async()=>await fetchRequests(sfilters),
  
  retry:false,
  refetchOnMount:true,
  refetchOnWindowFocus:false
})
const [selectedRequest,setSelectedRequest] = useState<string|null>(null)
const columns: ColumnDef<CollaboratorRequest>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => row.original.skills.join(", "), // Display skills as comma-separated values
  },
  {
    accessorKey: "contact_email",
    header: "Email",
  },
  {
    accessorKey: "contact_no",
    header: "Contact No",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(), // Format the date
  },
  {
    accessorKey:"_id",
    header:"Action",
    cell:({row})=>
    (<CollaboratorModal project_id={project_id} id={row.original._id}/>)
  }
];  
return (
    <div className="space-y-6">
     { <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Collaboration Requests</CardTitle>
              <CardDescription>
                Manage access requests to your project
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Collaborator
            </Button>
          </div>
        </CardHeader>
        <CardContent>
         
          <CustomTable
          data={requests}
          
          columns={columns}
          filterState={sfilters}
          handleFilterStateChange={handleFilterChange}
          onPageChange={handlePagination}
          filterable={[{label:"name",type:"text"},{label:"username",type:"text"}]}
          pagination={false}
          manualPagination={true}
          totalResults={totalResults}
          pageSize={10}
          />
        {selectedRequest &&  <CollaboratorModal project_id={project_id} id={selectedRequest}></CollaboratorModal>}
        </CardContent>
      </Card>}
    </div>
  );
}

export default function CollaboratorModal({ id,project_id }: { id: string,project_id:string }) {
  const router = useRouter();  
  const fetchRequest = async()=>{
    try {
      const req = await axios.get(`${BACKEND_URL}/projects/collaborate/requests/${id}`,
        {params:{pid:project_id},headers:{
          "Authorization":`Bearer ${Cookies.get("access-token")}`
        }}
      )
      return req.data.request;
    } catch (error) {
      toast({
        title:"Something went wrong",
        variant:"destructive"
      })
      return Promise.reject("Some error occured")
    }
  }
const {data,isLoading} = useQuery({
  queryKey:["collab-request",id],
  queryFn:fetchRequest,
  retry:false,
  refetchOnWindowFocus:false,
  refetchOnMount:false,
})

const handleUpdatStatus= async(type:string)=>{
  try {
    const req = await axios.put(`${BACKEND_URL}/projects/collaborate/requests/${id}`,{
    },{params:{type:type,pid:project_id},headers:{
      "Authorization":`Bearer ${Cookies.get("access-token")}`
    }})
    
    toast({
      title:`Request ${type}`
    })
    router.push(`/account/projects/my-projects/${project_id}/add-contributor?request_id=${id}`)
  } catch (error) {
    const axiosError = error as AxiosError<any>
    const message = axiosError.response?.data.message||"Something went wrong"
    toast({
      title:message,
      variant:"destructive"
    })
  }
}

  return (
    <Dialog>
      <DialogTrigger asChild><Button>View</Button></DialogTrigger>
      <DialogContent className="bg-gray-900 border-yellow-500 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Collaboration Request</DialogTitle>
        </DialogHeader>
{isLoading?<Loader/>:
        <div className="space-y-2">
          <p><span className="font-bold text-yellow-300">Name:</span> {data.name} (@{data.username})</p>
          <p><span className="font-bold text-yellow-300">Role:</span> {data.role}</p>
          <p><span className="font-bold text-yellow-300">Skills:</span> {data.skills.join(", ")}</p>
          <p><span className="font-bold text-yellow-300">Motive:</span> {data.motive}</p>
          <p><span className="font-bold text-yellow-300">Email:</span> {data.contact_email}</p>
          <p><span className="font-bold text-yellow-300">Phone:</span> {data.contact_no}</p>
          <p><span className="font-bold text-yellow-300">Status:</span> {data.status}</p>
          <p><span className="font-bold text-yellow-300">Requested On:</span> {new Date(data.createdAt.$date).toLocaleString()}</p>
        </div>}

       {!isLoading &&data.status=="Pending"&& <div className="flex justify-end space-x-3 mt-4">
          <Button variant="outline" onClick={(e)=>handleUpdatStatus("Rejected")} className="border-yellow-500 text-yellow-500 hover:bg-yellow-600">
            Reject
          </Button>
          <Button onClick={(e)=>handleUpdatStatus("Accepted")} className="bg-yellow-500 text-gray-900 hover:bg-yellow-600">
            Accept
          </Button>
        </div>}
      </DialogContent>
    </Dialog>
  );
}