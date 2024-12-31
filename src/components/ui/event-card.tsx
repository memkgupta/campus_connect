"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
}

export function EventCard({ title, date, time, location }: EventCardProps) {
  return (
    <Card className="bg-navy-800 hover:bg-navy-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Calendar className="h-4 w-4 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-300">
          <p>{date}</p>
          <p>{time}</p>
          <p className="text-gray-400">{location}</p>
        </div>
      </CardContent>
    </Card>
  );
}