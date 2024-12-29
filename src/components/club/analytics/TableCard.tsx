"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface TableCardProps {
  title: string;
  children: React.ReactNode;
  viewAllHref: string;
  viewAll:boolean
}

export function TableCard({ title, children, viewAllHref,viewAll }: TableCardProps) {
  return (
    <Card className="bg-slate-900 border-yellow-500/20">
      <div className="p-6 border-b border-yellow-500/20 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-yellow-500">{title}</h2>
       {viewAll&& <Link href={viewAllHref}>
          <Button variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
            View All
          </Button>
        </Link>}
      </div>
      {children}
    </Card>
  );
}