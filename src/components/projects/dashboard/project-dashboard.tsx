"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./project-overview";
import { ProjectAnalytics } from "./project-analytics";
// import { ProjectDocumentation } from "./project-documentation";
import { ProjectSettings } from "./project-settings";
import { ProjectCollaborators } from "./project-collab-requests";
import ProjectContributors from "./project-contributors";
import { useQueryState } from "nuqs";

export function ProjectDashboard({project_id}:{project_id:string}) {
  const [activeTab, setActiveTab] = useQueryState("tab",{defaultValue:"overview"});
  
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
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <ProjectOverview />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <ProjectAnalytics />
        </TabsContent>
        {/* <TabsContent value="documentation" className="space-y-4">
          <ProjectDocumentation />
        </TabsContent> */}
        <TabsContent value="collaborators"  className="space-y-4">
          <ProjectCollaborators project_id={project_id} />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <ProjectSettings />
        </TabsContent>
        <TabsContent value="contributors" className="space-y-4">
          <ProjectContributors project_id={project_id}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}