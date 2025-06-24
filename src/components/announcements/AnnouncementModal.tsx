"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";

interface AnnouncementModalProps {
  announcement: {
    _id: string;
    title: string;
    description: string;
    details?: string;
    from?: "Admin" | "HOD" | "FACULTY" | "EXAM-CELL";
    tags?: string[];
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    createdAt: string;
    createdBy?: { name: string };
    attachements: {
      title: string;
      linkUrl?: string;
      uploadRef?: { url: string };
    }[];
  };
  trigger?: React.ReactNode;
}

export function AnnouncementModal({ announcement, trigger }: AnnouncementModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="outline">View Announcement</Button>}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">{announcement.title}</DialogTitle>
            {announcement.from && (
              <Badge variant="outline" className="text-xs">
                {announcement.from}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p className="text-sm">{announcement.description}</p>
          {announcement.details && <p className="whitespace-pre-line">{announcement.details}</p>}

          {announcement.tags && announcement.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {announcement.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs pt-2">
            <span>
              {announcement.startDate
                ? format(new Date(announcement.startDate), "dd MMM yyyy")
                : ""}
              {" - "}
              {announcement.endDate
                ? format(new Date(announcement.endDate), "dd MMM yyyy")
                : "Ongoing"}
            </span>
            <span className="text-right truncate max-w-[150px]">
              By: {announcement.createdBy?.name || "Anonymous"}
            </span>
          </div>

          {announcement.attachements.length > 0 && (
            <div className="pt-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Attachments:</p>
              <ul className="list-disc list-inside text-sm">
                {announcement.attachements.map((att, i) => (
                  <li key={i}>
                    <a
                      href={att.linkUrl || att.uploadRef?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {att.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
