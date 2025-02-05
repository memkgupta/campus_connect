'use client'
import { AddProjectForm } from '@/components/projects/add-project-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {



  return (
    <div className=''>

      <AddProjectForm/>
    </div>
  )
}

export default page