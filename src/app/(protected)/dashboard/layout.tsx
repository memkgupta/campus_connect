import { DashboardSidebar } from '@/components/dashboard/events/event-dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { MenuIcon } from 'lucide-react'
import React from 'react'

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
          <SidebarProvider>
                    <DashboardSidebar /> 
                    <SidebarTrigger>
                        <MenuIcon />
                    </SidebarTrigger>
                    <div className='w-full p-12'>
                    {children}
                    </div>
                </SidebarProvider>
      
    </div>
  )
}

export default DashboardLayout