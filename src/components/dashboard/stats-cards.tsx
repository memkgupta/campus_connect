"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  FileCode2, 
  MessageSquare, 
  Users, 
  CalendarCheck 
} from "lucide-react";
type StatsProps = {
  resources: number;
  events: number;
  projects: number;
  collaborations?: number; // optional
};


export default function StatsCards({ resources, events, projects, collaborations }: StatsProps) {
  const stats = [
    {
      title: "Resources Contributed",
      value: resources,
      icon: FileCode2,
      color: "from-blue-600 to-blue-400"
    },
    {
      title: "Events Attended",
      value: events,
      icon: CalendarCheck,
      color: "from-amber-600 to-amber-400"
    },
    {
      title: "Projects Shared",
      value: projects,
      icon: MessageSquare,
      color: "from-teal-600 to-teal-400"
    },
    {
      title: "Collaborations",
      value: collaborations !== undefined ? collaborations : "Coming soon",
      icon: Users,
      color: "from-purple-600 to-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-900 border-slate-800 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">{stat.title}</span>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>

            {/* Mini sparkline chart placeholder */}
            <div className="h-6 mt-4 flex items-end space-x-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-sm w-1"
                  style={{
                    height: `${Math.max(4, Math.floor(Math.random() * 24))}px`,
                  }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}