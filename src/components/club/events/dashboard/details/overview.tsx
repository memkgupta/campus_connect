import React, { useContext, useState } from 'react'
import EventBasicDetails from './sections/event-basic-details'
import EventStructureSection from './sections/structure'
import MonetaryDetailsSection from './sections/monetary-details'
import OrganiserDetailsSection from './sections/organiser-details'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { BACKEND_URL_V2 } from '@/constants'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import Loader from '@/components/Loader'
import { FileText, Layers, Users, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditBasicDetails from './sections/edit-components/edit-basic-details'
import EditEventStructure from './sections/edit-components/edit-structure'
import EditMonatoryDetails from './sections/edit-components/edit-monetary-details'
import EditOrganiserDetails from './sections/edit-components/edit-organiser-details'
import { useEventDashboard } from '@/context/dashboard/useContext'
const EventDashboardOverview = ({ event_id }: { event_id:string }) => {
  const eventContext = useEventDashboard()
   
return(

    <>
   <InnerComponent/>
    </>
)
 
}
const InnerComponent = ()=>{
    const [isEditing,setEditing] = useState<{
        section:string,
        data:any,
    }|null>(null)
    const tabs = [
         {
          id: 'basicDetails',
          label: 'Details',
          icon: FileText,
          editcomponent:<EditBasicDetails />,
          component: <EventBasicDetails  />
        },
         {
          id: 'eventStructure',
          label: 'Structure',
          icon: Layers,
            editcomponent:<EditEventStructure />,
          component: <EventStructureSection />
        },
        {
          id: 'monetaryDetails',
          label: 'Monetary Details',
          icon: Wallet,
         editcomponent:<EditMonatoryDetails />,
          component: <MonetaryDetailsSection />
        },
        {
          id: 'organiseDetails',
          label: 'Organiser Details',
          editcomponent:<EditOrganiserDetails />,
          icon: Users,
         
          component: <OrganiserDetailsSection  />
        }
      ]
    
      const [selectedTab, setSelectedTab] = useState(tabs[0].id)
    
      const renderSelectedComponent = () => {
        const current = tabs.find((tab) => tab.id === selectedTab)
        if(current && isEditing!=null && isEditing.section === current.id)
        {
            return current?.editcomponent
        }
        return current?.component
      }
    
      return (
        <div className='flex h-full w-full'>
       
    
          
            {/* Sidebar tabs */}
          <div className='w-60 border-r min-h-screen bg-[#040512] p-4'>
            <div className='flex flex-col space-y-2'>
              {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.id
  
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
              }  
            )}
            </div>
          </div>
    
          {/* Content Area */}
          <div className='flex-1 p-6 overflow-y-auto relative'>
            <Button key={selectedTab} onClick={(e)=>{
                setEditing({
                    section:selectedTab,
                    data:selectedTab
                })
            }}>Edit</Button>
            {renderSelectedComponent()}
            {isEditing && isEditing.section===selectedTab && (
                <div className='flex justify-end gap-4 mt-2'>
                    <Button onClick={()=>{
                        setEditing(null);
                    }}>
                    Cancel
                    </Button>
                    <Button>
                    Save
                    </Button>
                </div>
            )}
          </div>
            
        </div>
      )
}
export default EventDashboardOverview
