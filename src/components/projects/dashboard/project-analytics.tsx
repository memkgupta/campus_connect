"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const barData = [
  { name: "Mon", commits: 4, prs: 2, issues: 6 },
  { name: "Tue", commits: 3, prs: 1, issues: 4 },
  { name: "Wed", commits: 7, prs: 3, issues: 8 },
  { name: "Thu", commits: 5, prs: 2, issues: 5 },
  { name: "Fri", commits: 6, prs: 4, issues: 3 },
];

const pieData = [
  { name: "Frontend", value: 45 },
  { name: "Backend", value: 30 },
  { name: "Documentation", value: 15 },
  { name: "Testing", value: 10 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function ProjectAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>
            Breakdown of commits, pull requests, and issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="hsl(var(--chart-1))" />
                <Bar dataKey="prs" fill="hsl(var(--chart-2))" />
                <Bar dataKey="issues" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Distribution</CardTitle>
            <CardDescription>
              Distribution of work across different areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>
              Important project metrics and KPIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Code Coverage", value: "87%" },
                { label: "Build Success Rate", value: "95%" },
                { label: "Average Response Time", value: "2.3s" },
                { label: "Active Contributors", value: "12" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}