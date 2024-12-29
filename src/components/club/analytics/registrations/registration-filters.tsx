"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SortAsc, SortDesc } from "lucide-react";
import type { FilterOptions } from "@/types/index";

interface RegistrationFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function RegistrationFilters({ filters, onFilterChange }: RegistrationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      
      
      <Select
        value={filters.sortBy}
        onValueChange={(value) => onFilterChange({ ...filters, sortBy: value, page: 1 })}
      >
        <SelectTrigger className="w-[180px] bg-slate-800 border-yellow-500/20 text-slate-200">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Registration Date</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        className="border-yellow-500/20 text-yellow-500"
        onClick={() => onFilterChange({
          ...filters,
          sortOrder: filters.sortOrder === "asc" ? "desc" : "asc"
        })}
      >
        {filters.sortOrder === "asc" ? (
          <SortAsc className="w-4 h-4 mr-2" />
        ) : (
          <SortDesc className="w-4 h-4 mr-2" />
        )}
        {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
      </Button>
    </div>
  );
}