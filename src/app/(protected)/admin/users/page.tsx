// pages/users.tsx
'use client'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Cookies from 'js-cookie';

import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import { toast } from '@/components/ui/use-toast';
import { useDebounceCallback } from 'usehooks-ts';
import Loader from '@/components/loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
export interface User {
    _id: string;
    profile: string;
    name: string;
    email: string;
    username: string;
    createdAt: string;
  }
  
  export interface Filters {
    name: string;
    username: string;
    email: string;
    dateRange: {
      start: Date | undefined;
      end: Date | undefined;
    };
  }



const UsersPage = () => {
//   const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [filters, setFilters] = useState<any>({
    name: '',
    username: '',
    email: '',
    page:1,
  });
  const [totalResults,setTotalResults] = useState(0);
const debouncedFilters = useDebounceCallback(setFilters,500);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    debouncedFilters((prevFilters:any) => ({
        ...prevFilters,
        [name]: value})
)
  }



  const fetchUsers = async()=>{
    try {
        const req = await axios.get(`${BACKEND_URL}/admin/users`,{params:filters,headers:{
            "Authorization":`Bearer ${Cookies.get('access-token')}`
        }});
        setTotalResults(req.data.totalResults);
        return req.data.users
    } catch (error) {
        toast({
            title:"Something went wrong",
            variant:'destructive'
        })
        return Promise.reject("Some error occured")
    }
}

const {data:users,isLoading} = useQuery({
    queryKey:['users',filters],
    queryFn:fetchUsers,
    retry:false,
    refetchOnWindowFocus:false
})

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Name"
          name="name"
        //   value={filters.name}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          placeholder="Username"
          name="username"
        //   value={filters.username}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          placeholder="Email"
          name="email"
        //   value={filters.email}
          onChange={handleFilterChange}
        />
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.start && filters.dateRange.end ? (
                <>
                  {format(filters.dateRange.start, "LLL dd, y")} - {format(filters.dateRange.end, "LLL dd, y")}
                </>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
        { filters.dateRange.end && filters.dateRange.start &&  <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.start}
              selected={[filters.dateRange.start, filters.dateRange.end]}
              onSelect={handleDateRangeChange}
            />}
          </PopoverContent>
        </Popover> */}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
     
        {
            isLoading?<Loader/>:(
           
                  users.map((user:User) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{format(new Date(user.createdAt), "MMM dd, yyyy HH:mm")}</TableCell>
              <TableCell>
                <img src={user.profile} alt={`${user.name}'s profile`} className="w-10 h-10 rounded-full" />
              </TableCell>
              <TableCell>
              <DropdownMenu>
  <DropdownMenuTrigger>...</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>

      <Link href={`/admin/users/${user._id}`}>View</Link>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />

  </DropdownMenuContent>
</DropdownMenu>
              </TableCell>
            </TableRow>
          ))
                
            )
        }
   
        </TableBody>
      </Table>
      <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={filters.page==1} onClick={()=>{setFilters({...filters,page:filters.page-1})}} />
        </PaginationItem>
       
     
        <PaginationItem>
          <PaginationNext disabled={filters.page==(Math.ceil(totalResults/10))}  onClick={()=>{setFilters({...filters,page:filters.page+1})}}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
  );
};

export default UsersPage;