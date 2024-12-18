"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor: string;
  progress: number;
  nextClass: string;
}

export function CourseCard({ title, instructor, progress, nextClass }: CourseCardProps) {
  return (
    <Card className="bg-navy-800 hover:bg-navy-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <BookOpen className="h-5 w-5 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-300 mb-4">
          <p>Instructor: {instructor}</p>
          <p>Next Class: {nextClass}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Course Progress</p>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}