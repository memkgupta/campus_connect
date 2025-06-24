"use client";

import { useState } from 'react';
import { Search, Bell, Calendar, Users, BookOpen, Award, TrendingUp, MapPin, Clock, ChevronRight, AlertTriangle, Star, MessageSquare, FileText, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from '@/hooks/useSession';
import { AnnouncementModal } from '@/components/announcements/AnnouncementModal';
import Link from 'next/link';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const criticalAlerts = [
    {
      id: 1,
      title: "Assignment Due Today",
      subject: "Data Structures",
      time: "11:59 PM",
      type: "urgent"
    },
    {
      id: 2,
      title: "Exam Tomorrow",
      subject: "Physics 101",
      time: "9:00 AM",
      type: "warning"
    }
  ];

//   const upcomingEvents = [
//   {
//     _id: "1",
//     type: "hackathon",
//     basicDetails: {
//       title: "CodeX 2025",
//       startDate: "2025-07-05T10:00:00.000Z",
//       endDate: "2025-07-07T18:00:00.000Z",
//     },
//     organiserDetails: {
//       organisers: [
//         {
//           name: "Dr. Rahul Mehta",
//           level: 1,
//           position: "Professor, CSE Dept.",
//           image: "/images/rahul-mehta.png",
//         },
//         {
//           name: "Sneha Kapoor",
//           level: 2,
//           position: "Event Coordinator",
//           image: "/images/sneha-kapoor.jpg",
//         },
//       ],
//     },
//   },
//   {
//     _id: "2",
//     type: "workshop",
//     basicDetails: {
//       title: "ML Bootcamp for Beginners",
//       startDate: "2025-07-10T09:30:00.000Z",
//       endDate: "2025-07-10T16:30:00.000Z",
//     },
//     organiserDetails: {
//       organisers: [
//         {
//           name: "Prof. Anjali Sharma",
//           level: 1,
//           position: "HOD, AI & ML",
//           image: "/images/anjali-sharma.png",
//         },
//       ],
//     },
//   },
//   {
//     _id: "3",
//     type: "campaign",
//     basicDetails: {
//       title: "Clean Campus Drive",
//       startDate: "2025-07-12T08:00:00.000Z",
//       endDate: "2025-07-12T12:00:00.000Z",
//     },
//     organiserDetails: {
//       organisers: [
//         {
//           name: "Eco Club",
//           level: 3,
//           position: "Club Organizer",
//           image: "/images/eco-club.png",
//         },
//       ],
//     },
//   },
//   {
//     _id: "4",
//     type: "session",
//     basicDetails: {
//       title: "Resume & LinkedIn Optimization",
//       startDate: "2025-07-15T14:00:00.000Z",
//       endDate: "2025-07-15T16:00:00.000Z",
//     },
//     organiserDetails: {
//       organisers: [
//         {
//           name: "Harsh Vardhan",
//           level: 2,
//           position: "Career Counsellor",
//           image: "/images/harsh-vardhan.jpg",
//         },
//       ],
//     },
//   },
// ]

//   const todayEvents = [
//     {
//       id: 1,
//       title: "Career Workshop",
//       time: "2:00 PM",
//       location: "Room 205",
//       attendees: 45
//     },
//     {
//       id: 2,
//       title: "Study Group",
//       time: "4:30 PM",
//       location: "Library",
//       attendees: 8
//     }
//   ];

//  const announcements:Announcement[] = [
//   {
//     _id: "665fa123456789abcdef0001",
//     title: "⚠️ Exam Schedule Released",
//     description: "Final semester exam dates have been released by the Exam Cell.",
//     details: `Make sure to check the official document and mark your calendars accordingly. No rescheduling will be allowed after the deadline.`,
//     from: "EXAM-CELL",
//     tags: ["exam", "schedule", "important"],
//     startDate: "2025-07-01T10:00:00.000Z",
//     endDate: "2025-07-10T17:00:00.000Z",
//     isActive: true,
//     createdAt: "2025-06-21T09:00:00.000Z",
//     createdBy: {
//       name: "Prof. R. Mehta",
//     },
//     attachements: [
//       {
//         title: "Exam Schedule PDF",
//         uploadRef: { url: "https://cdn.example.com/docs/exam-schedule.pdf" },
//       },
//     ],
//   },
//   {
//     _id: "665fa123456789abcdef0002",
//     title: "🎉 Hackathon 2025 Registrations Open",
//     description: "Participate in the biggest coding event of the year.",
//     details: `Registrations are now open for CodeStorm 2025. Form teams, build projects, and win prizes worth ₹1,00,000!\n\nDeadline: July 15th.`,
//     from: "FACULTY",
//     tags: ["hackathon", "event", "techfest"],
//     startDate: "2025-07-20T09:00:00.000Z",
//     endDate: "2025-07-22T20:00:00.000Z",
//     isActive: true,
//     createdAt: "2025-06-20T15:30:00.000Z",
//     createdBy: {
//       name: "Ms. Pooja Sharma",
//     },
//     attachements: [
//       {
//         title: "Hackathon Poster",
//         uploadRef: { url: "https://cdn.example.com/images/hackathon-poster.jpg" },
//       },
//       {
//         title: "Registration Link",
//         linkUrl: "https://codestorm2025.dev/register",
//       },
//     ],
//   },
//   {
//     _id: "665fa123456789abcdef0003",
//     title: "🛠️ Maintenance Notice: Library Server",
//     description: "The library portal will be temporarily unavailable due to maintenance.",
//     details: `Scheduled downtime: June 25, 10 PM to June 26, 6 AM.\n\nAll eBook and journal services will be restored post-maintenance.`,
//     from: "Admin",
//     tags: ["maintenance", "library", "downtime"],
//     startDate: "2025-06-25T22:00:00.000Z",
//     endDate: "2025-06-26T06:00:00.000Z",
//     isActive: true,
//     createdAt: "2025-06-19T11:15:00.000Z",
//     createdBy: {
//       name: "IT Support",
//     },
//     attachements: [],
//   },
//   {
//     _id: "665fa123456789abcdef0004",
//     title: "📢 Orientation Program for 1st Years",
//     description: "All newly admitted students must attend the orientation session.",
//     details: `Welcome to the institute!\n\nThe orientation program will cover academic policies, faculty intros, club overviews, and more.`,
//     from: "HOD",
//     tags: ["orientation", "freshers"],
//     startDate: "2025-07-05T09:00:00.000Z",
//     endDate: "2025-07-05T14:00:00.000Z",
//     isActive: true,
//     createdAt: "2025-06-22T13:00:00.000Z",
//     createdBy: {
//       name: "Dr. Neha Verma",
//     },
//     attachements: [
//       {
//         title: "Orientation Schedule",
//         uploadRef: { url: "https://cdn.example.com/docs/orientation-schedule.pdf" },
//       },
//       {
//         title: "Welcome Video",
//         linkUrl: "https://youtube.com/watch?v=welcome-video",
//       },
//     ],
//   },
// ];


  const quickStats = [
    { label: "Courses", value: "6", icon: BookOpen, color: "text-primary" },
    { label: "Due Soon", value: "3", icon: AlertTriangle, color: "text-accent" },
    { label: "Groups", value: "2", icon: Users, color: "text-green-400" },
    { label: "Points", value: "1.2K", icon: Award, color: "text-purple-400" }
  ];



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-primary/20 text-primary border-primary/30';
      case 'competition': return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'workshop': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cultural': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };
 const {isAuthenticated,user,feed} = useSession()
 const {recentActivities,upcomingEvents,topRecentAnnouncements:announcements} = feed
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Critical Alerts Bar */}
        {/* {criticalAlerts.length > 0 && (
          <section className="mb-4 sm:mb-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-2 sm:space-x-3 glass-card p-2 sm:p-3 border-l-4 border-l-red-500 bg-red-500/5 hover-lift cursor-pointer">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.subject} • {alert.time}</p>
                  </div>
                  <Badge variant="outline" className={`${getAlertColor(alert.type)} text-xs`}>
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )} */}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Column - Quick Stats & Today's Events */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            {/* <Card className="glass-card animate-slide-in">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 xl:gap-0 xl:space-y-3">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between xl:justify-between p-2 xl:p-0 rounded-lg xl:rounded-none bg-muted/10 xl:bg-transparent">
                      <div className="flex items-center space-x-2">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Today's Events */}
            {/* <Card className="glass-card animate-slide-in">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="p-2 sm:p-3 rounded-lg bg-accent/10 border border-accent/20 hover-lift cursor-pointer">
                    <h4 className="font-medium text-sm mb-1 truncate">{event.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card> */}

            {/* Recent Activity */}
           <Card className="glass-card animate-slide-in">
  <CardHeader className="pb-2 sm:pb-3">
    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
      <MessageSquare className="w-4 h-4 mr-2" />
      Recent Activity
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-2 sm:space-y-3">
    {recentActivities.map((activity, index) => (
      <div key={index} className="flex items-start space-x-2">
        <Avatar className="w-6 h-6 flex-shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {activity.createdBy?.name?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs">
            <span className="font-medium">{activity.createdBy?.name}</span>{' '}
            <span className="text-muted-foreground">added a new {activity.type}</span>{' '}
            <span className="font-medium truncate inline-block max-w-20 sm:max-w-none">{activity.title}</span>
          </p>
          <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
        </div>
      </div>
    ))}
  </CardContent>
</Card>

          </div>

          {/* Right Column - Announcements & College Events */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Announcements */}
            <Card className="glass-card animate-fade-in">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                    <span className="truncate">Latest Announcements</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">
                    View All <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
  {announcements.map((announcement:Announcement) => (
    <div
      key={announcement._id}
      className="p-3 sm:p-4 rounded-lg border-l-4 border-blue-500 hover-lift cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-semibold text-sm flex-1 min-w-0">
          {announcement.title}
        </h4>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground">
            {new Date(announcement.createdAt).toLocaleDateString()}
          </span>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {announcement.description}
      </p>

      <div className="flex items-center justify-between">
         <span className="text-xs text-muted-foreground truncate flex-1 min-w-0 pr-2">
          {announcement.from}
        </span>
        <span className="text-xs text-muted-foreground truncate flex-1 min-w-0 pr-2">
          {announcement.createdBy?.name || "Unknown Author"}
        </span>
        <AnnouncementModal announcement={announcement} trigger={<Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs flex-shrink-0"
        >
          Read More
        </Button>}/>
      </div>
    </div>
  ))}
</CardContent>
            </Card>

            {/* College Events */}
          <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent" />
            <span className="truncate">Upcoming Events</span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">
            View Calendar <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {upcomingEvents.map((event) => {
          const startDate = new Date(event.basicDetails!.startDate)
          const endDate = new Date(event.basicDetails!.endDate)
          const daysLeft = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          const mainOrganiser = event.organiserDetails?.organisers?.[0]

          return (
            <div
              key={event._id}
              className="glass-card p-3 sm:p-4 hover-lift cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base mb-1 text-center sm:text-left">
                        <span className="truncate">{event.basicDetails?.title}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground text-center sm:text-left">
                        {mainOrganiser?.position || "Organised Event"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="capitalize self-center sm:self-start flex-shrink-0"
                    >
                      {event.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center justify-center sm:justify-start">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>
                        {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{mainOrganiser?.name || "Organiser"}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{event.basicDetails?.isOnline? "Online" : "Campus"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-between gap-3">
                    <Link href={`/events/${event._id}`}  className="h-7 px-3 text-xs">
                     View Details
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {daysLeft > 0 ? `${daysLeft} days left` : "Today"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
          </div>
        </div>
      </div>
    </div>
  );
}