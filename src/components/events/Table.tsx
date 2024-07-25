import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
const TableComponent = ({checkbox,columns, data, className, onSort, onFilter, pagination}:{columns:string[],data:any,className:string,onSort:()=>void,pagination?:{currentPage:number,onPrev:()=>void,onNext:()=>void,totalPages:number},checkbox?:{
  bulkActions:{label:string,id:string,onAction:()=>Promise<any>}[]
},onFilter:()=>void}) => {
  return (
    <Table>

    </Table>
  )
}

export default TableComponent