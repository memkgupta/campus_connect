"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarPlus, Search, Send } from "lucide-react";
import { useToast } from "../ui/use-toast";


export default function QuickActions() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Coming Soon",
      description: `The "${action}" feature will be available in the next update.`,
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription className="text-slate-400">
          Shortcuts to commonly used features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center gap-2 py-4 border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            onClick={() => handleAction("Create Post")}
          >
            <Send className="h-5 w-5" />
            <span className="text-xs">Create Post</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center gap-2 py-4 border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            onClick={() => handleAction("New Project")}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs">New Project</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center gap-2 py-4 border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            onClick={() => handleAction("Create Event")}
          >
            <CalendarPlus className="h-5 w-5" />
            <span className="text-xs">Create Event</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center gap-2 py-4 border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            onClick={() => handleAction("Find Collaborators")}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Find Collaborators</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}