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

type CollaboratorRequest = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
};

const collaboratorRequests: CollaboratorRequest[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Developer",
    status: "pending",
    requestDate: "2024-03-20",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Designer",
    status: "approved",
    requestDate: "2024-03-19",
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    role: "Product Manager",
    status: "rejected",
    requestDate: "2024-03-18",
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.r@example.com",
    role: "Developer",
    status: "pending",
    requestDate: "2024-03-17",
  },
];

export function ProjectCollaborators() {
  const [requests, setRequests] = useState<CollaboratorRequest[]>(collaboratorRequests);

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setRequests(requests.map(request =>
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

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

  return (
    <div className="space-y-6">
      <Card>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.role}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(request.id, "approved")}
                          className="text-green-600"
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(request.id, "rejected")}
                          className="text-red-600"
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}