"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarClock, MessageSquare, Users, Star, FileCode2, CalendarCheck, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { formatDistanceToNow } from "date-fns";
import Loader from "../Loader";
 type ActivityItem = {
  id: number;
  type: "resource" | "project" | "event" | "achievement";
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  iconColor: string;
};
const iconMap: Record<
  ActivityItem["type"],
  { icon: LucideIcon; color: string }
> = {
  resource: {
    icon: FileCode2,
    color: "text-blue-400 bg-blue-400/10",
  },
  project: {
    icon: MessageSquare,
    color: "text-teal-400 bg-teal-400/10",
  },
  event: {
    icon: CalendarCheck,
    color: "text-amber-400 bg-amber-400/10",
  },
  achievement: {
    icon: Star,
    color: "text-purple-400 bg-purple-400/10",
  },
};
export default function ActivitySection() {
  const {toast} = useToast()

  const fetchActivities = async()=>{
    try{
      const req = await axios.get(`${BACKEND_URL}/users/dashboard/activities`,{
        headers:{
          "Authorization":`Bearer ${Cookies.get("access-token")}`
        }
      })
      const activities = req.data.activity;
const formattedActivities = activities.map((activity:any, index:number) => ({
  id: index + 1,
  type: activity.type,
  title: activity.type === "event"
    ? "Event Organized"
    : activity.type === "project"
    ? "Project Shared"
    : "Resource Contributed",
  description: activity.title,
  time: formatDistanceToNow(activity.date, { addSuffix: true }),
  icon: iconMap[activity.type as  ActivityItem["type"]].icon,
  iconColor: iconMap[activity.type as  ActivityItem["type"]].color,
}));
return formattedActivities
    }
    catch(error)
    {
      console.log(error)
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message || "Something went wrong"
      toast(
        {
          title:message,
          variant:"destructive"
        }
      )
      throw new Error(message)
    }
  }
  const {data,isFetching} = useQuery({
    queryKey:["recent-activities"],
    queryFn:fetchActivities,
    retry:false,
    refetchOnWindowFocus:false
  })
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription className="text-slate-400">
          Your latest interactions and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
      {isFetching ?<Loader/>:  <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 border-l border-slate-800" />
          <div className="space-y-6">
            {data && data.map((activity:any) => (
              <div key={activity.id} className="relative pl-8 -ml-2">
                <div className={cn(
                  "absolute left-0 rounded-full p-2",
                  activity.iconColor
                )}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{activity.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                  </div>
                  
                  {activity.user && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.image} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>}
      </CardContent>
    </Card>
  );
}