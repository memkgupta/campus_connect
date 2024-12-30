"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface Course {
  _id: string;
  takenLectures: number;
  totalLectures: number;
  label: string;
  uploadedBy: string;
}

export default function CurrentCourses({ courses }: { courses: Course[] }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-yellow-500 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Current Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
          <div key={course._id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-200">{course.label}</span>
              <span className="text-yellow-500">
                {course.takenLectures}/{course.totalLectures} lectures
              </span>
            </div>
            <Progress 
              value={(course.takenLectures / course.totalLectures) * 100} 
              className="bg-slate-800"
            />
            <p className="text-xs text-slate-400">Uploaded by {course.uploadedBy}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}