"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  title: string;
  type: string;
  uploadedBy: string;
  date: string;
  downloadUrl: string;
}

export function ResourceCard({ title, type, uploadedBy, date, downloadUrl }: ResourceCardProps) {
  return (
    <Card className="bg-navy-800 hover:bg-navy-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-yellow-400" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-300">
          <p>Type: {type}</p>
          <p>Uploaded by: {uploadedBy}</p>
          <p className="text-gray-400">{date}</p>
        </div>
      </CardContent>
    </Card>
  );
}