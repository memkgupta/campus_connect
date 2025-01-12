"use client";

import { Bell, BookOpen, Calendar, FileText, VideoIcon } from "lucide-react";
import { CourseCard } from "@/components/ui/course-card";
import { EventCard } from "@/components/ui/event-card";
import { ResourceCard } from "@/components/ui/resource-card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import { useSession } from "@/hooks/useSession";
import CurrentCourses from "@/components/feed/current-courses";
import RecentResources from "@/components/feed/recent-resources";
import EventsList from "@/components/feed/events-list";
export default function Home() {
  const {isAuthenticated,user,feed} = useSession()

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {!feed?(<Loader/>):(
         <div className="min-h-screen bg-slate-950">
         <div className="container mx-auto px-4 py-8">
           <div className="flex items-center gap-3 mb-8">
             <VideoIcon className="w-8 h-8 text-yellow-500" />
             <h1 className="text-3xl font-bold text-yellow-500">Learning Feed</h1>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-6">
               <CurrentCourses courses={feed.currentCourses} />
               <RecentResources resources={feed.recentResources} />
             </div>
             <div className="space-y-6">
               <EventsList
                 registeredEvents={feed.registeredEvents}
                 upcomingEvents={feed.upcomingEvents}
               />
             </div>
           </div>
         </div>
       </div>
      )}
    </div>
  );
}

const announcements = [
  {
    title: "Campus Library Extended Hours",
    content: "The main library will remain open until midnight during finals week.",
    date: "2 hours ago"
  },
  {
    title: "New Online Learning Resources",
    content: "Access to LinkedIn Learning is now available for all students.",
    date: "1 day ago"
  }
];

const courses = [
  {
    title: "Advanced Mathematics",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    nextClass: "Tomorrow, 10:00 AM"
  },
  {
    title: "Computer Science 101",
    instructor: "Prof. Michael Chen",
    progress: 60,
    nextClass: "Wednesday, 2:00 PM"
  },
  {
    title: "World History",
    instructor: "Dr. James Wilson",
    progress: 45,
    nextClass: "Thursday, 11:00 AM"
  }
];

const events = [
  {
    title: "Tech Career Fair",
    date: "May 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Student Center"
  },
  {
    title: "Guest Lecture: AI Ethics",
    date: "May 18, 2024",
    time: "2:00 PM - 3:30 PM",
    location: "Auditorium A"
  },
  {
    title: "Student Club Meetup",
    date: "May 20, 2024",
    time: "5:00 PM - 6:30 PM",
    location: "Room 302"
  }
];

const resources = [
  {
    title: "Calculus Chapter 5 Notes",
    type: "PDF Document",
    uploadedBy: "Dr. Johnson",
    date: "Updated 2 days ago",
    downloadUrl: "#"
  },
  {
    title: "Programming Basics Lecture",
    type: "Video Recording",
    uploadedBy: "Prof. Chen",
    date: "Updated 3 days ago",
    downloadUrl: "#"
  },
  {
    title: "History Essay Guidelines",
    type: "Word Document",
    uploadedBy: "Dr. Wilson",
    date: "Updated 1 week ago",
    downloadUrl: "#"
  }
];