import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Badge } from '../ui/badge'
import CustomImage from '../ui/image'

const EventCard = ({ data, isAdmin }: { data: any, isAdmin?: boolean }) => {
  const event = data.basicDetails;

  return (
    <Card className="w-full flex flex-col md:flex-row md:items-start md:justify-between p-4 gap-4 shadow-md">
      {/* Left section: Event Info */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Badge className="w-fit bg-gray-400 opacity-75 text-xs mb-2 md:mb-0">#{event.category}</Badge>
          <p className='text-xs text-gray-400'>{dateToString(new Date(event.startDate))}</p>
        </div>

        <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>

        <CardDescription className="text-gray-600 flex items-center gap-1 text-sm">
          <MapPin size={16} /> {event.venue}
        </CardDescription>

        <p className='text-sm text-gray-700 mt-2 line-clamp-2'>
          {event.brief_description}
        </p>

        <div className='flex items-center justify-between text-sm mt-3 text-gray-500'>
          <p className='flex items-center gap-2'>
            <span className={`min-w-4 min-h-4 rounded-full ${data.totalRegistrations >= event.maxParticipants ? 'bg-red-500' : 'bg-green-400'}`}></span>
            {data.totalRegistrations} Registered
          </p>
          <p>Max {event.maxParticipants} Allowed</p>
        </div>

        {!event.participantsFromOutsideAllowed &&
          <p className='text-xs text-gray-400 mt-1 italic'>* Only college participants allowed</p>}

        <Link href={`${isAdmin ? '/account/club/event/' : '/events/'}${data._id}`} className='mt-3 w-fit bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-md text-sm font-medium'>
          View More
        </Link>
      </div>

      {/* Right section: Club Info */}
      {data.club && (
        <div className="flex flex-col items-end justify-between gap-2 min-w-[120px]">
          <p className='text-sm text-gray-200 font-medium'>{data.club.clubName}</p>
          <CustomImage src={data.club.clubLogo} className='w-10 h-10 rounded-full border border-gray-300' alt="club logo" />
        </div>
      )}
    </Card>
  )
}

export default EventCard

export function dateToString(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
