"use client"
import React, { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, User2, Bell, Search, GraduationCap, Home, Calendar, BookOpen, Users, Settings, LogOut, Book } from "lucide-react"
import { Button } from "./ui/button"
import { NavigationMenuDemo } from "./navigation-menu"
import Sidebar from "./Sidebar"
import SearchBar from "./search-bar"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { useSession } from "@/hooks/useSession"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { navResourceOptions } from "@/constants"

function Navbar() {
  const { user, isAuthenticated,logout } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="hidden xs:block min-w-0">
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                  Campus Connect
                </h1>
                <p className="text-xs text-muted-foreground -mt-0.5 sm:-mt-1 hidden sm:block">Your College Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-6 flex-1 justify-center max-w-2xl">
              <NavigationMenuDemo />
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md mx-4 xl:mx-6">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
              {/* Search Button - Mobile/Tablet */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 hover:bg-muted/50"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-8 w-8 sm:h-10 sm:w-10 hover:bg-muted/50"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* User Section */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-muted/50">
                      <Avatar className="h-7 w-7 sm:h-9 sm:w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarImage src={user.profile || ""} alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-xs sm:text-sm">
                         JD
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52 sm:w-56 glass-card" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                     <Link className="flex items-center" href={`/dashboard`}>
                      <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Dashboard</span>
                     </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                    <Link className="flex items-center" href={`/dashboard/account`}>
                      <User2 className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Profile</span>
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                   <Link className="flex items-center" href={`/dashboard/my-resources`}>
                      <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>My Courses</span>
                   </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Schedule</span>
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuSeparator /> */}
                    {/* <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Settings</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={()=>{logout()}} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex text-sm px-3 h-8 sm:h-9">
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9">
                    <Link href="/auth/sign-up" className="truncate">
                      <span className="hidden sm:inline">Get Started</span>
                      <span className="sm:hidden">Join</span>
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden h-8 w-8 sm:h-10 sm:w-10 hover:bg-muted/50 ml-1 sm:ml-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile/Tablet Search Bar */}
          
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 px-3 py-2 sm:py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm sm:text-base">Dashboard</span>
                </Link>
                <Accordion type="multiple" >
  <AccordionItem value="resources">
    <AccordionTrigger className="text-sm font-medium flex items-center w-fit"> 
      <span className="flex items-center gap-2 text-sm"><Book className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform"></Book>Resources</span>
    </AccordionTrigger>
    <AccordionContent>
      {navResourceOptions.map(option=>( <div className="p-1"><Link
              key={option.href}
              href={option.href}
              className="text-sm text-muted-foreground hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              {option.title}
            </Link></div>))}
    </AccordionContent>
  </AccordionItem>
</Accordion>
                <Link 
                  href="/events" 
                  className="flex items-center space-x-3 px-3 py-2 sm:py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm sm:text-base">Events</span>
                </Link>
             
                
                {/* Mobile-only Navigation Items */}
                <div className="xl:hidden pt-2 border-t border-border/20">
                  <Link 
                    href="/dashboard/account" 
                    className="flex items-center space-x-3 px-3 py-2 sm:py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm sm:text-base">Profile</span>
                  </Link>
                  {/* <Link 
                    href="/settings" 
                    className="flex items-center space-x-3 px-3 py-2 sm:py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm sm:text-base">Settings</span>
                  </Link> */}
                </div>

                {!isAuthenticated && (
                  <div className="pt-3 border-t border-border/40">
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                      <Button variant="outline" className="flex-1 xs:flex-none text-sm" onClick={() => setIsMenuOpen(false)}>
                        <Link href="/auth/sign-in" className="w-full">Sign In</Link>
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold text-sm" onClick={() => setIsMenuOpen(false)}>
                        <Link href="/auth/sign-up" className="w-full">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="pt-3 border-t border-border/40">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Log out
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:hidden pb-3 sm:pb-4">
            <SearchBar />
          </div>
          </div>
        )}
      </nav>

      {/* Progress Bar */}
      <ProgressBar
        height="3px"
        color="hsl(270, 100%, 50%)"
        disableSameURL
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}

export default Navbar