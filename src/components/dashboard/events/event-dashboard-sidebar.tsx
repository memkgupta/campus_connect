"use client"
import React from 'react'
import { 
  Building2, 
  FileText, 
  Users, 
  CreditCard, 
  Package, 
  Settings,
  ChevronDown,
  UserCog,
  CreditCard as PlanIcon,
  Plus,
  Home,
  FileIcon,
  FolderClosedIcon,
  SettingsIcon,
  ListChecks,
  CalendarCheck,
  Calendar,
  TicketCheck,
  BellDot,
  FoldersIcon,
  UploadCloud,
  UserIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"

 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { RootState } from '@/lib/store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { useClub } from '@/hooks/useClubContext'
import { usePathname, useSearchParams } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
 


export const DashboardSidebar = () => {
 
const { user } = useSession();

const menuItems = [
  {
    group: "Event",
    items: [
      {
        title: "Dashboard",
        url: `/dashboard`,
        icon: Home,
      },
      {
        title: "Events",
        url: `/dashboard/events`,
        icon: CalendarCheck,
      },
      {
        title: "My Registrations",
        url: "/dashboard/my-registrations",
        icon: TicketCheck,
      },
      {
        title: "Notifications",
        url: `/dashboard/notifications`,
        icon: BellDot,
      },
      {
        title: "My Resources",
        url: "/dashboard/my-resources",
        icon: FoldersIcon,
      },
      {
        title: "Contributions",
        url: "/dashboard/contributions",
        icon: UploadCloud,
      },
    ],
  },

  {
    group: "Account",
    items: [
      {
        title: "Account",
        url: `/dashboard/account`,
        icon: SettingsIcon,
      },
      // Only include admin if user is ADMIN
      ...(user?.role === "ADMIN"
        ? [
            {
              title: "Admin",
              url: `/admin`,
              icon: UserIcon,
            },
          ]
        : []),
    ],
  },
];

    const dispatch = useAppDispatch()
  return (
    <Sidebar className='mt-12'>
      <SidebarContent>
      <div className="px-3 py-2">

        </div>


        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
