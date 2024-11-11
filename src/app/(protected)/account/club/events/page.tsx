import AllEventsPage from '@/components/club/AllEventsPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Events = () => {
  return (
    <div className="flex h-screen flex-col">
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-2xl font-bold">Club Event Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search..."
          className="w-64"
       
        />
        <Link href={"/account/club/create-event"} className='bg-yellow-400 text-black rounded-md p-4 flex justify-between'>
          <PlusIcon className="mr-2 h-4 w-4" /> New Event
        </Link>
      </div>
    </header>
    <main className="flex-1 overflow-auto p-6">
      <AllEventsPage />
    </main>
  </div>
  )
}

export default Events