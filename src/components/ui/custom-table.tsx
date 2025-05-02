import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    OnChangeFn,
    PaginationState,
  } from '@tanstack/react-table';
  import { useState } from 'react';
  import { ArrowUpIcon,ArrowDownIcon } from 'lucide-react';

import { Input } from './input';
import ComboBox from './combobox-custom';
import { TableBody, TableCell, TableHeader, TableRow } from './table';
import Loader from '../Loader';

export interface FilterState{
  [key:string]:any
}

  interface TableProps<T> {
    data: T[];
    isLoading?:boolean,
    columns: ColumnDef<T>[];
    sortable?: string[];
    filterable?: {label:string,options?:{value:string,label:string,id:string}[],type:string}[];
    pagination?: boolean;
    manualPagination?:boolean
    pageSize?: number;
    onPageChange?:({pageNumber,totalResults}:{pageNumber:number,totalResults:number})=>void
    totalResults?:number,
    filterState?:FilterState
    handleFilterStateChange?:(name:string,value:any)=>void
  }
  
  export function CustomTable<T>({
    data,
    totalResults,
    isLoading,
    columns,
    onPageChange,
    sortable = [],
    filterable = [],
    pagination = false,
    manualPagination=true,
    pageSize = 10,

   handleFilterStateChange
  }: TableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);


  
    const processedColumns = columns.map((column) => ({
      ...column,
   
     
    }));
    const [page,setPage] = useState(1);
    const table = useReactTable({
      data,
      columns: processedColumns,
      state: {
        sorting,
     
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      manualPagination:manualPagination,
      rowCount:totalResults,
      pageCount:totalResults&&(Math.ceil(totalResults/10)),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    });
  
    return (
      <div className="p-4">
        {filterable &&handleFilterStateChange && filterable.length > 0 && (
          <div className="mb-4">
            {
             filterable.map((filter)=>{
                return(
                  <>
                 
                 <FilterInput type={filter.type} label={filter.label} onFilterChange={handleFilterStateChange} options={filter.options} />

                  </>
                )
              })
            }
          </div>
        )}
  
        {data?<div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                     
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center cursor-pointer">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
                          desc: <ArrowDownIcon className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
       {isLoading?(<Loader/>):     <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                     
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>}
          </table>
        </div>:(<Loader/>)}
  
        {manualPagination &&totalResults && onPageChange&&(
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => {setPage(page-1);onPageChange({pageNumber:page,totalResults:totalResults})}}
                disabled={page==1}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                onClick={() => {setPage(page+1);onPageChange({pageNumber:page,totalResults:totalResults})}}
                disabled={page>=(Math.ceil(totalResults/10))}
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Page{' '}
                <strong>
                  {page} of{' '}
                  {Math.ceil(totalResults/10)}
                </strong>
              </span>
          
            </div>
          </div>
        )}
      </div>
    );
  }

  export function FilterInput({type,label,onFilterChange,options}:{type:string,label:string,onFilterChange:(name:string,value:string)=>void,options?:{value:string,label:string,id:string}[]}){
   switch(type){
    case "text":
      return(
        <Input type='text' placeholder={label} className='my-5' onChange={(e)=>onFilterChange(label,e.target.value)}>
        
        </Input>
      )
      case "select":
        return(
          <select className='bg-slate-950 rounded-md p-3'>
         <option className='text-white' value={""}>{"All"}</option>
         {
          options!.map((o)=>{
return(
  <option value={o.value} key={o.id} className='text-white'>{o.label}</option>
)
          })
         }
          </select>
        )
        default : return ".."
   }
  }