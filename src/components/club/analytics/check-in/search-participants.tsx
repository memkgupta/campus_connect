"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchParticipantProps {
  onSearch: (query: string) => void;
}

export function SearchParticipant({ onSearch }: SearchParticipantProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        placeholder="Search by name, email, or registration ID..."
        className="pl-10 bg-slate-800 border-yellow-500/20 text-slate-200 placeholder:text-slate-400"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}