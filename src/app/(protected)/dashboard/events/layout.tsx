"use client"
import { EventContextProvider } from '@/context/dashboard/EventContext'
import React, { ReactNode } from 'react'

const EventLayout = ({children}:{children:ReactNode}) => {
  return (
   <EventContextProvider>
    {children}
   </EventContextProvider>
  )
}

export default EventLayout