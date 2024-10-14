import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, UserPlus, MessageSquare } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

 type Props = {
    id:string,
        events:{ id: string, name: string, date: Date, attendees: number }[],
        members: { id:string, name: string, role: string }[],
        recruitmentStats:{   applicants: number,
            interviewed: number,
            accepted: number,},
            messages:{id: string, sender: string, content: string}[]
 }
export default function ClubDashboard({id,events,members,recruitmentStats,messages}:Props) {

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-yellow-100">
      <h1 className="text-4xl font-bold mb-8 text-yellow-300">Campus Connect Club Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-slate-800 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-300">
              <CalendarDays className="mr-2 text-yellow-500" /> Upcoming Events
            </CardTitle>
            <CardDescription className="text-yellow-100/70">Overview of scheduled club events</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-yellow-200">{event.name}</p>
                    <p className="text-sm text-yellow-100/50">{}</p>
                  </div>
                  <Badge className="bg-yellow-500 text-slate-900">{event.attendees} attendees</Badge>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 bg-yellow-500 text-slate-900 hover:bg-yellow-600">View All Events</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-300">
              <Users className="mr-2 text-yellow-500" /> Club Members
            </CardTitle>
            <CardDescription className="text-yellow-100/70">Active members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-yellow-500 text-slate-900">
                      <AvatarImage src={`/placeholder.svg?text=${member.name.charAt(0)}`} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-yellow-200">{member.name}</span>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-300">{member.role}</Badge>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 bg-yellow-500 text-slate-900 hover:bg-yellow-600">Manage Members</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-300">
              <UserPlus className="mr-2 text-yellow-500" /> Recruitment
            </CardTitle>
            <CardDescription className="text-yellow-100/70">Current recruitment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-yellow-300">{recruitmentStats.applicants}</p>
                <p className="text-sm text-yellow-100/50">Applicants</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-300">{recruitmentStats.interviewed}</p>
                <p className="text-sm text-yellow-100/50">Interviewed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-300">{recruitmentStats.accepted}</p>
                <p className="text-sm text-yellow-100/50">Accepted</p>
              </div>
            </div>
            <Button className="w-full mt-6 bg-yellow-500 text-slate-900 hover:bg-yellow-600">View Applications</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-300">
              <MessageSquare className="mr-2 text-yellow-500" /> Recent Messages
            </CardTitle>
            <CardDescription className="text-yellow-100/70">Latest communications within the club</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {messages.map((message) => (
                <li key={message.id} className="border-b border-yellow-500/30 pb-2 last:border-b-0">
                  <p className="font-semibold text-yellow-200">{message.sender}</p>
                  <p className="text-sm text-yellow-100/70">{message.content}</p>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 bg-yellow-500 text-slate-900 hover:bg-yellow-600">Open Message Board</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}