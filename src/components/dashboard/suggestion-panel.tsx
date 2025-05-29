"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarClock, FileCode, Users, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "../ui/use-toast";


export default function SuggestionsPanel() {
  const { toast } = useToast();
  
  const handleAction = (type: string, name: string) => {
    const actions = {
      join: "Joined",
      follow: "Following",
      rsvp: "RSVP'd to",
    };
    
    toast({
      title: `Success!`,
      description: `You're now ${actions[type as keyof typeof actions]} ${name}`,
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle>Suggestions</CardTitle>
        <CardDescription className="text-slate-400">
          Discover new connections and opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-slate-800">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onJoin={() => handleAction("join", project.title)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="people" className="space-y-4">
            {people.map((person) => (
              <PersonCard 
                key={person.id} 
                person={person} 
                onFollow={() => handleAction("follow", person.name)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRSVP={() => handleAction("rsvp", event.title)}
              />
            ))}
          </TabsContent>
        </Tabs> */}
        Coming soon
      </CardContent>
    </Card>
  );
}

// Project Card Component
function ProjectCard({ project, onJoin }: { 
  project: typeof projects[0], 
  onJoin: () => void 
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex-shrink-0 p-2 rounded-md bg-blue-500/10">
        <FileCode className="h-5 w-5 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{project.title}</h4>
        <p className="text-xs text-slate-400 truncate">{project.description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onJoin}>
        Join
      </Button>
    </div>
  );
}

// Person Card Component
function PersonCard({ person, onFollow }: { 
  person: typeof people[0], 
  onFollow: () => void 
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <Avatar className="h-9 w-9">
        <AvatarImage src={person.avatar} alt={person.name} />
        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium">{person.name}</h4>
        <p className="text-xs text-slate-400 truncate">{person.department}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onFollow}>
        Follow
      </Button>
    </div>
  );
}

// Event Card Component
function EventCard({ event, onRSVP }: { 
  event: typeof events[0], 
  onRSVP: () => void 
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex-shrink-0 p-2 rounded-md bg-amber-500/10">
        <CalendarClock className="h-5 w-5 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{event.title}</h4>
        <p className="text-xs text-slate-400 truncate">{event.date}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onRSVP}>
        RSVP
      </Button>
    </div>
  );
}

// Sample data
const projects = [
  {
    id: 1,
    title: "AI Research Group",
    description: "Working on machine learning projects",
    members: 12,
  },
  {
    id: 2,
    title: "Campus App",
    description: "Building mobile app for college resources",
    members: 8,
  },
  {
    id: 3,
    title: "Robotics Club",
    description: "Engineering automation solutions",
    members: 15,
  },
];

const people = [
  {
    id: 1,
    name: "Priya Kumar",
    department: "Computer Science, 3rd Year",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 2,
    name: "Rahul Singh",
    department: "Electrical Engineering, 2nd Year",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
  {
    id: 3,
    name: "Aisha Patel",
    department: "Biotechnology, 4th Year",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
];

const events = [
  {
    id: 1,
    title: "Tech Fest 2025",
    date: "March 15-16, 2025",
    attendees: 450,
  },
  {
    id: 2,
    title: "Coding Workshop",
    date: "Next Monday, 2:00 PM",
    attendees: 65,
  },
  {
    id: 3,
    title: "Industry Panel",
    date: "February 28, 2025",
    attendees: 120,
  },
];