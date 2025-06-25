"use client"
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
    const {isAuthenticated} = useSession()
    const router = useRouter()
    if(isAuthenticated) router.replace(`/dashboard`)
  return (
    <div>
        {children}
    </div>
  )
}

export default AuthLayout