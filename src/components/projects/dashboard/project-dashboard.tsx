"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./project-overview";
import { ProjectAnalytics } from "./project-analytics";
import { ProjectDocumentation } from "./project-documentation";
import { ProjectSettings } from "./project-settings";
import { ProjectCollaborators } from "./project-collaborators";

export function ProjectDashboard({project_id}:{project_id:string}) {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="overview" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <ProjectOverview />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <ProjectAnalytics />
        </TabsContent>
        <TabsContent value="documentation" className="space-y-4">
          <ProjectDocumentation />
        </TabsContent>
        <TabsContent value="collaborators" className="space-y-4">
          <ProjectCollaborators />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <ProjectSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}