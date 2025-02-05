"use client"
import { BACKEND_URL } from '@/constants'
import axios from 'axios'
import React from 'react'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import { UserCard } from '@/components/admin/UserCard'
import Loader from '@/components/loader'
const ViewUserPage = ({params}:{params:{id:string}}) => {
    const fetchUserData = async()=>{
        const req = await axios.get(
            `${BACKEND_URL}/admin/users/${params.id}`,{headers:{
                "Authorization":`Bearer ${Cookies.get('access-token')}`
            }}
            
        )
        return req.data;
    }
    const {data,isLoading} =useQuery({
        queryKey:[params.id,'user-by-id'],
        queryFn:fetchUserData
    })
  return (
    <div className=''>
     {isLoading ? (<Loader/>) :    <UserCard user={data.user[0]}/>}
    </div>
  )
}

export default ViewUserPage