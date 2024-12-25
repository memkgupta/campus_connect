'use client'
import { AddMemberDialog } from '@/components/club/add-member-dialog'
import { MemberTable } from '@/components/club/member-table'
import React from 'react'

const Page = () => {

  return (
    <main className="container mx-auto px-4 py-8">
    <div className="mb-6 flex justify-between items-center">
      <AddMemberDialog />
    </div>
    <MemberTable />
  </main>
  )
}

export default Page