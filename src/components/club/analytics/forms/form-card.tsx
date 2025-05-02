"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface FormCardProps {
  _id: string;
  formName: string;

  responseCount: number;
  enabled:boolean;
}

export function FormCard({ _id, formName, responseCount, enabled }: FormCardProps) {
  return (
    <Card className="bg-slate-900 border-yellow-500/20 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-yellow-500">{formName}</h2>
        </div>
        <Badge 
          variant={enabled ? "default" : "secondary"}
          className={enabled ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-slate-300"}
        >
          {enabled?"Enabled":"Hidden"}
        </Badge>
      </div>

      
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {responseCount} responses
        </span>
        <Link href={`/account/club/events/dashboard/form-responses?fid=${_id}`}>
          <Button variant="outline" size="sm" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
            View Responses
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}