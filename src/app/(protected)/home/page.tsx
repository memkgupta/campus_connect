"use client";

import { Bell, BookOpen, Calendar, FileText } from "lucide-react";
import { CourseCard } from "@/components/ui/course-card";
import { EventCard } from "@/components/ui/event-card";
import { ResourceCard } from "@/components/ui/resource-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Announcements Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold">Announcements</h2>
          </div>
          <div className="bg-navy-800 rounded-lg p-6">
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="border-b border-navy-700 last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                  <p className="text-gray-300">{announcement.content}</p>
                  <p className="text-sm text-gray-400 mt-2">{announcement.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Courses Section */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Current Courses</h2>
            </div>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </section>
        </div>

        {/* Recent Resources Section */}
        <section className="mt-12">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="h-6 w-6 text-yellow-400" />
            <h2 className="text-2xl font-bold">Recent Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </section>
      </div>
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