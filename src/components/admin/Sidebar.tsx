'use client';

import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Bell,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const routes = [
  {
    label: 'Dashboard',
    icon: BarChart3,
    href: '/admin',
    color: 'text-sky-500',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/admin/users',
    color: 'text-violet-500',
  },
  {
    label: 'Resources',
    icon: FileText,
    href: '/admin/resources',
    color: 'text-pink-500',
  },
  {
    label: 'Subjects',
    icon: BookOpen,
    href: '/admin/subjects',
    color: 'text-orange-500',
  },
  {
    label: 'Announcements',
    icon: Bell,
    href: '/admin/announcements',
    color: 'text-emerald-500',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                  pathname === route.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground'
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}