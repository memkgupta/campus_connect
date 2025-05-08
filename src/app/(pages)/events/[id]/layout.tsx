"use client"
import { EventContextProvider } from '@/context/EventContext'
import React from 'react'

const EventLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <EventContextProvider>
        {children}
        </EventContextProvider>
    </div>
  )
}

export default EventLayout