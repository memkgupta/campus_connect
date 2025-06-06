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
  UploadCloud
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
 


export const DashboardSidebar = () => {
   const clubContext = useClub();
   const searchParams = useSearchParams();
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
title:"My Registrations",
url:"/dashboard/my-registrations",
icon:TicketCheck
        },
        {
            title:"Notifications",
            url:`/dashboard/notifications`,
            icon:BellDot
        },
        {
      title:"My Resources",
      url:"/dashboard/my-resources",
      icon:FoldersIcon
    },
    {
      title:"Contributions",
      url:"/dashboard/contributions",
      icon:UploadCloud
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
       
      ],
    },
  ]
    const dispatch = useAppDispatch()
  return (
    <Sidebar className='mt-12'>
      <SidebarContent>
      <div className="px-3 py-2">
      {/* <Select onValueChange={(value) => { clubContext.handleChangeSelectedClub(value)}} defaultValue={clubContext.clubs.find(b=>b._id===clubContext.selectedClub?._id)?._id}>
        <SelectTrigger className="w-full mb-6">
          <SelectValue placeholder="Select a business">
            <div className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              {clubContext.selectedClub 
                ? clubContext.clubs.find(b => b._id === clubContext.selectedClub?._id)?.title
                : clubContext.clubs[0].title
              }
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-56">
          <SelectGroup>
            {clubContext.clubs.map((club) => (
              <SelectItem key={club._id} value={club._id}>
                {club.title}
              </SelectItem>
            ))}
            <SelectItem value="add-new" className="text-primary">
              + Add Club
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select> */}
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
