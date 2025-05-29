import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomImage from '@/components/ui/image';
import { useEventDashboard } from '@/context/dashboard/useContext';
import { format } from 'date-fns';
import { BuildingIcon, CalendarIcon, ClockIcon, FlagIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const EventBasicDetails = () => {
  const {data:event} = useEventDashboard()!
  const data = event.basicDetails;
  return (
    <div >
    <div className="relative w-full h-64 mb-6">
      <CustomImage
        src={data.banner}
        alt={data.title}
        className="rounded-lg"
      />
    </div>

    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="space-x-2">
          {data.isTeamEvent && (
            <Badge variant="secondary">Team Event</Badge>
          )}
        </div>
        <div className="space-x-2">
          {data.isMulitpleRounds && (
            <Badge variant="secondary">Multiple Rounds</Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span>
              {format(data.startDate,"PPP")}
            </span>
            <span>-</span>
            <span>
                {format(data.endDate,"PPP")}
            </span>
          </div>
         
          
          <div className="flex items-center space-x-2">
            <BuildingIcon className="h-5 w-5 text-muted-foreground" />
            <span>{data.venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FlagIcon className="h-5 w-5 text-muted-foreground" />
            <span>{data.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
            <span>Max Capacity: {data.maxCapacity}</span>
          </div>
          {data.participantsFromOutsideAllowed && (
            <div className="flex items-center space-x-2">
              <UserPlusIcon className="h-5 w-5 text-muted-foreground" />
              <span>Open to outside participants</span>
            </div>
          )}
         
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className=''>
            <div className=''>
          <p className='text-sm text-gray-400 break-words whitespace-pre-wrap '>{data.description}</p>

            </div>
        </CardContent>
      </Card>
    

   
    </div>
  </div>
  )
}

export default EventBasicDetails