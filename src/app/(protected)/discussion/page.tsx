"use client"
import React, { useState } from 'react'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowBigDown, ArrowBigUp, MessageSquare, Search } from 'lucide-react'
const DiscussionPage = () => {

  const channels = [
    "Technology",
    "Science",
    "Gaming",
    "Movies",
    "Music",
    "Books",
    "Sports",
    "Cooking",
    "Travel",
    "Photography",
  ]

  const posts = [
    {
      id: 1,
      title: "Just finished my first Next.js project!",
      author: "dev_newbie",
      channel: "Technology",
      upvotes: 152,
      downvotes: 23,
      comments: 47,
    },
    {
      id: 2,
      title: "New study shows promising results for cancer treatment",
      author: "science_enthusiast",
      channel: "Science",
      upvotes: 1243,
      downvotes: 56,
      comments: 203,
    },
    {
      id: 3,
      title: "What's your favorite indie game of 2023?",
      author: "gamer123",
      channel: "Gaming",
      upvotes: 89,
      downvotes: 12,
      comments: 76,
    },
  ]
  
  return (
    <div>
         <div className="min-h-screen bg-gray-900">
      <header className="sticky top-0 z-10 bg-gray-900 shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input className="pl-8" placeholder="Search discussions..." type="search" />
            </div>
          </div>
        
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex gap-8">
        <aside className="w-64 hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Channels</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4 space-y-2">
                  {channels.map((channel) => (
                    <Link
                      key={channel}
                      className="block px-2 py-1 rounded hover:bg-gray-700"
                      href="#"
                    >
                      {channel}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
        <div className="flex-1 space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.channel}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost">
                      <ArrowBigUp className="w-5 h-5" />
                    </Button>
                    <span>{post.upvotes - post.downvotes}</span>
                    <Button size="sm" variant="ghost">
                      <ArrowBigDown className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <Button variant="outline">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
    </div>
  )
}

export default DiscussionPage