"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "PYQ's",
    href: "/resources/pyq",
    description:
      "Previous Year papers of aktu university",
  },
  {
    title: "Question Bank",
    href: "/resources/question-bank",
    description:
      "Question banks subjectwise for each subjects.",
  },
  {
    title: "Lectures",
    href: "/resources/lectures",
    description:
      "Online lectures sorted for you subjectwise and topicwise",
  },
  {
    title: "Notes",
    href: "/resources/notes",
    description: "Subjectwise and chapterwise notes for each year.",
  },
  {
    title: "Short Notes",
    href: "/resources/short-notes",
    description:
      "Short Notes for quick revision",
  },
  {
    title: "Quantum",
    href: "/resources/quantum",
    description:
      "Subjectwise quantum",
  },
]
const projects:{title: string; href: string; description: string }[]=[
    {
        title: "Showcase your project",
        href: "/projects/submit",
        description:
          "Showcase your project to the community",
      },
      {
        title: "Take inspiration",
        href: "/projects/view",
        description:
          "Not getting an idea for your next project ? Take inspirations from others",
      },
      {
        title: "Find a project partner",
        href: "/projects/partners",
        description:
          "Find a project partner for your next big thing",
      },
]
export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <Link href={"/events"} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Events
            </NavigationMenuLink>
            </Link>
      
          
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid bg-slate-950 rounded-md w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* projects */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid bg-slate-950 rounded-md w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {projects.map((project) => (
                <ListItem
                  key={project.title}
                  title={project.title}
                  href={project.href}
                >
                  {project.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
            
          <Link href="/guides" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Guides
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800 hover:text-accent-foreground focus:bg-slate-800 focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
