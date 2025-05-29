"use client";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, BookMarked, Link as LinkIcon, ExternalLink, Bookmark, Clock, Star } from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    description: "Comprehensive guide to ML basics and algorithms",
    type: "Course",
    url: "https://example.com/ml-course",
    savedDate: "2024-03-15",
    category: "Academic",
    status: "In Progress",
    progress: 45,
  },
  {
    id: 2,
    title: "React Best Practices 2024",
    description: "Latest React patterns and optimization techniques",
    type: "Article",
    url: "https://example.com/react-2024",
    savedDate: "2024-03-10",
    category: "Technical",
    status: "Saved",
  },
  {
    id: 3,
    title: "Campus Placement Preparation",
    description: "Complete roadmap for placement preparation",
    type: "Guide",
    url: "https://example.com/placement-prep",
    savedDate: "2024-03-08",
    category: "Career",
    status: "Completed",
    progress: 100,
  },
];

export default function ResourcesPage() {
  return (

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Resources</h1>
            <p className="text-sm text-slate-400">Manage your saved learning materials and references</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                className="pl-8 bg-slate-800 border-slate-700"
              />
            </div>
        
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-800 mb-4">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {["academic", "technical", "career"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources
                  .filter((r) => r.category.toLowerCase() === category)
                  .map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

  );
}

function ResourceCard({ resource }: { resource: typeof resources[0] }) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {resource.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-400 line-clamp-2">
              {resource.description}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-slate-800">
            {resource.type}
          </Badge>
          <Badge
            variant="secondary"
            className={
              resource.status === "Completed"
                ? "bg-green-500/10 text-green-400"
                : resource.status === "In Progress"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-slate-800"
            }
          >
            {resource.status}
          </Badge>
        </div>

        {resource.progress !== undefined && (
          <div className="mb-4">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${resource.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{resource.progress}% Complete</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-400">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            <span>Saved {resource.savedDate}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}