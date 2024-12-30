"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Book, Clock } from "lucide-react";

interface Resource {
  _id: string;
  label: string;
  type: string;
  uploadedBy: string;
  updatedAt?: string;
}

const resourceIcons = {
  quantum: Book,
  lectures: FileText,
};

export default function RecentResources({ resources }: { resources: Resource[] }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => {
            const Icon = resourceIcons[resource.type as keyof typeof resourceIcons] || FileText;
            
            return (
              <div
                key={resource._id}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <Icon className="w-5 h-5 text-yellow-500 mt-1" />
                <div className="flex-1">
                  <h3 className="text-slate-200 font-medium">{resource.label}</h3>
                  <p className="text-sm text-slate-400">By {resource.uploadedBy}</p>
                  {resource.updatedAt && (
                    <p className="text-xs text-slate-500 mt-1">
                      Updated {new Date(resource.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}