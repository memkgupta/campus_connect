"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-slate-900 p-6 border-yellow-500/20">
      <div className="flex items-center gap-4">
        <Icon className="w-8 h-8 text-yellow-500" />
        <div className="flex-1">
          <p className="text-slate-400">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-yellow-500">{value}</p>
            {trend && (
              <span className={`text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}