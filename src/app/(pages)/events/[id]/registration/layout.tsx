"use client"
import { EventRegistrationContextProvider } from '@/context/event_registration/EventRegistrationContext'
import React, { ReactNode } from 'react'

const EventRegistrationLayout = ({children}:{children:ReactNode}) => {
  return (
   
    <EventRegistrationContextProvider>
        {children}
    </EventRegistrationContextProvider>
  )
}

export default EventRegistrationLayout