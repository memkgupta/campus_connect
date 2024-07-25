"use client"
 
import {
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  SortingState,ColumnFiltersState,getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import React, { Dispatch, SetStateAction, useState } from "react"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  count,
  loading,
  onPaginationChange
}:{columns:ColumnDef<TData, TValue>[],data:TData[],loading:boolean,count:number,pagination:{pageIndex:number,pageSize:number},onPaginationChange:Dispatch<SetStateAction<{
    pageIndex: number;
    pageSize: number;
}>>}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
   
      
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
      )
      const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel:getPaginationRowModel(),
    manualPagination:true,
    autoResetPageIndex:false,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    pageCount:count,
    onPaginationChange:onPaginationChange,
    
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,columnFilters,rowSelection,pagination
    },
  })
//  console.log(table.getColumn("user_name"))
  return (
 <div>
       <div className="flex items-center py-4">
    <Input
      placeholder="Filter names..."
      value={(table.getColumn("user_name")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("user_name")?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={pagination.pageIndex===0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={pagination.pageIndex>=count}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log(rowSelection)}
          disabled={Object.keys(rowSelection).length===0}
        >
          Accept Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log(rowSelection)}
          disabled={Object.keys(rowSelection).length===0}
        >
         Reject Selected
        </Button>
      </div>
    </div>
 </div>
  )
}