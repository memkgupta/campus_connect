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
const EventCard = ({data,isAdmin}:{data:any,isAdmin?:boolean}) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
<Badge className='w-24 bg-gray-400 opacity-75 text-xs'>#{data.category}</Badge>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription className='flex justify-between mt-5'>{dateToString(new Date(data.dateTime))} <p className='text-xs md:text-sm flex justify-center gap-1 text-gray-600 items-center'><MapPin size={20}/> {data.location}</p> </CardDescription>
      </CardHeader>
      <CardContent>
      <div className='flex flex-col justify-center'>
        <p className='text-md text-gray-700'>
        {data.brief_description}...
        </p>
       <div className='flex justify-between text-sm mt-3 text-gray-400'>
       <p className='flex gap-2'><span className={`min-w-5 min-h-5 rounded-full ${data.totalRegistrations>=data.maxCapacity?'bg-red-500':'bg-green-400'}`}></span> Total Registrations :- {data.totalRegistrations}</p>
       <p className='flex gap-2'>Max {data.maxCapacity}</p>
       </div>
{!data.participantsFromOutsideAllowed &&        <p className='text-xs text-gray-300'>* Only participants from our colleges are allowed</p>}
      <Link href={`${isAdmin?'/account/club/event/':'/events/'}${data._id}`} className='bg-yellow-300 hover:bg-yellow-400 rounded-md p-2 text-black mt-2 text-center'>View More</Link>
      </div>
      </CardContent>
   {data.club &&   <CardFooter className="flex justify-between">
       <p className='text-white'>{data.club.clubName}</p>
       <img src={data.club.clubLogo} className='w-8 h-8 rounded-full' alt="" />
      </CardFooter>}
    </Card>
  )
}

export default EventCard

function dateToString(date:Date){
   let string = "";
string =  string.concat((date.getDate()-1).toString()+"/")
 string  = string.concat((date.getMonth()+1).toString()+"/")
 string= string.concat(date.getFullYear().toString());
 return string;
}