'use client';

import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from 'recharts';

// import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { BookOpen, Building2, Calendar, FolderGit2, Users, Users2 } from 'lucide-react';
export default function DashboardPage() {

    const fetchDashboard = async()=>{
      try {
        const req = await axios.get(`${BACKEND_URL}/admin/dashboard`,{headers:{
            "Authorization":`Bearer ${Cookies.get('access-token')}`
        }})
        return req.data
      } catch (error) {
        toast({
            title:"Some error occured",
            variant:"destructive"
        })
        return Promise.reject("Some error occured");
      }
    }

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboard,
  });

  if (isLoading) {
    return "Loading...";
  }

  const college = analytics?.analytics[0];
  
  const chartData = [
    {
      name: 'Last Month',
      Users: college?.users[0]?.lastMonthCount || 0,
      Resources: college?.resources[0]?.lastMonthCount || 0,
      Events: college?.events[0]?.lastMonthCount || 0,
      Projects: college?.projects[0]?.lastMonthCount || 0,
      Clubs: college?.clubs[0]?.lastMonthCount || 0,
    },
    {
      name: 'Previous Month',
      Users: college?.users[0]?.lastToLastMonthCount || 0,
      Resources: college?.resources[0]?.lastToLastMonthCount || 0,
      Events: college?.events[0]?.lastToLastMonthCount || 0,
      Projects: college?.projects[0]?.lastToLastMonthCount || 0,
      Clubs: college?.clubs[0]?.lastToLastMonthCount || 0,
    },
  ];

  return (
<div className='px-12'>
<div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{college?.name}</h2>
          <p className="text-muted-foreground">{college?.university}</p>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Building2 className="h-5 w-5" />
          <span>{college?.emailDomain}</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Users"
          value={college?.users[0]?.total}
          description="Active platform users"
          icon={Users}
          trend={calculateTrend(
            college?.users[0]?.lastMonthCount,
            college?.users[0]?.lastToLastMonthCount
          )}
        />
        <StatsCard
          title="Total Resources"
          value={college?.resources[0]?.total}
          description="Learning materials"
          icon={BookOpen}
          trend={calculateTrend(
            college?.resources[0]?.lastMonthCount,
            college?.resources[0]?.lastToLastMonthCount
          )}
        />
        <StatsCard
          title="Total Events"
          value={college?.events[0]?.total}
          description="Events organized"
          icon={Calendar}
          trend={calculateTrend(
            college?.events[0]?.lastMonthCount,
            college?.events[0]?.lastToLastMonthCount
          )}
        />
        <StatsCard
          title="Total Projects"
          value={college?.projects[0]?.total}
          description="Student projects"
          icon={FolderGit2}
          trend={calculateTrend(
            college?.projects[0]?.lastMonthCount,
            college?.projects[0]?.lastToLastMonthCount
          )}
        />
        <StatsCard
          title="Total Clubs"
          value={college?.clubs[0]?.total}
          description="Active clubs"
          icon={Users2}
          trend={calculateTrend(
            college?.clubs[0]?.lastMonthCount,
            college?.clubs[0]?.lastToLastMonthCount
          )}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Monthly Growth Comparison</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Users" fill="hsl(var(--chart-1))" />
              <Bar dataKey="Resources" fill="hsl(var(--chart-2))" />
              <Bar dataKey="Events" fill="hsl(var(--chart-3))" />
              <Bar dataKey="Projects" fill="hsl(var(--chart-4))" />
              <Bar dataKey="Clubs" fill="hsl(var(--chart-5))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>

</div>
  );
}

function calculateTrend(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  trend: number;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-semibold">{value}</p>
        {trend !== 0 && (
          <span
            className={`text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </Card>
  );
}
// function DashboardSkeleton() {
//   return (
//     <div className="space-y-8">
//       <Skeleton className="h-8 w-[200px]" />
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {[...Array(4)].map((_, i) => (
//           <Card key={i} className="p-6">
//             <Skeleton className="h-4 w-[100px]" />
//             <Skeleton className="h-8 w-[60px] mt-2" />
//             <Skeleton className="h-3 w-[140px] mt-1" />
//           </Card>
//         ))}
//       </div>
//       <Card className="p-6">
//         <Skeleton className="h-6 w-[200px] mb-4" />
//         <Skeleton className="h-[300px]" />
//       </Card>
//     </div>
//   );
// }