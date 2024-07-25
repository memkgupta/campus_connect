"use client"
import { useState } from "react";

export default function usePagination(){
    const [pagination,setPagination] = useState({
        pageIndex:1,
        pageSize:10
    })
    const {pageIndex,pageSize} = pagination
    return {
        limit: pageSize,
        onPaginationChange: setPagination,
        pagination,
        skip: pageSize * pageIndex,
      };
}