"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Participant {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
  checkInTime?: string;
}

// Mock data - replace with actual data source
const participants: Participant[] = [
  {
    id: "REG001",
    name: "John Doe",
    email: "john@example.com",
    ticketType: "VIP",
    checkedIn: true,
    checkInTime: "2024-03-21 09:30",
  },
  {
    id: "REG002",
    name: "Jane Smith",
    email: "jane@example.com",
    ticketType: "Regular",
    checkedIn: false,
  },
];

interface ParticipantListProps {
  searchQuery: string;
}

export function ParticipantList({ searchQuery }: ParticipantListProps) {
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-slate-900 border-yellow-500/20">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-slate-800/50">
            <TableHead className="text-slate-400">ID</TableHead>
            <TableHead className="text-slate-400">Name</TableHead>
            <TableHead className="text-slate-400">Email</TableHead>
            <TableHead className="text-slate-400">Ticket</TableHead>
            <TableHead className="text-slate-400">Status</TableHead>
            <TableHead className="text-slate-400">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParticipants.map((participant) => (
            <TableRow key={participant.id} className="hover:bg-slate-800/50">
              <TableCell className="text-yellow-500">{participant.id}</TableCell>
              <TableCell className="text-slate-200">{participant.name}</TableCell>
              <TableCell className="text-slate-200">{participant.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
                  {participant.ticketType}
                </Badge>
              </TableCell>
              <TableCell>
                {participant.checkedIn ? (
                  <Badge className="bg-green-500/20 text-green-500">
                    Checked In
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    Not Checked In
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {participant.checkedIn ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Undo
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check In
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}