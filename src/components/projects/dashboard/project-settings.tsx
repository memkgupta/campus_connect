"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProjectSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage your project's basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input id="project-name" defaultValue="My Awesome Project" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              defaultValue="A comprehensive project management dashboard built with Next.js and shadcn/ui"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-visibility">Visibility</Label>
            <Select defaultValue="private">
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="team">Team Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive project updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "Email Notifications",
              description: "Receive project updates via email",
            },
            {
              title: "Push Notifications",
              description: "Get notified about important changes",
            },
            {
              title: "Weekly Digest",
              description: "Receive weekly project summary",
            },
          ].map((setting) => (
            <div
              key={setting.title}
              className="flex items-center justify-between space-x-2"
            >
              <div className="space-y-0.5">
                <Label>{setting.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Archive Project</Label>
              <p className="text-sm text-muted-foreground">
                Make this project read-only
              </p>
            </div>
            <Button variant="outline">Archive</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Delete Project</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project
              </p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}