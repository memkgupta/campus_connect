"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEventRegistration } from "@/context/event_registration/EventRegistrationContext"
import { useEventContext } from "@/context/EventContext"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

const SimpleEventRegistrationDetails = () => {
  const { data: registration } = useEventRegistration()
  const {
    name,
    email,
    phoneNo,
    
    status,
    isApproved,
    registrationTimestamp,
    collegeDetails,
    _id,
  } = registration.registrationDetails

  const { data } = useEventContext()
  const event = data?.basicDetails

  return (
   <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <h2 className="text-3xl font-bold text-center text-white">
    Your Registration Details
  </h2>

  {/* Responsive Container for Card + Pass */}
  <div className="flex flex-col md:flex-row gap-6">
    {/* Left: Card */}
    <Card className="flex-1 bg-muted dark:bg-zinc-900 dark:text-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Event Details</CardTitle>
        <div className="max-w-[500px]">
          <CardDescription className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {event?.title}
          </CardDescription>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          <span className="font-medium">Event Date:</span>{" "}
          {event && format(new Date(event?.startDate), "PPP")}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-xs text-muted-foreground mb-4">
          <span className="font-medium">Registration ID:</span> {_id}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="bg-zinc-800 text-white">
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{name}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
            <Badge
              className={cn(
                "ml-auto",
                status === "completed" ? "bg-green-600" : "bg-yellow-600"
              )}
            >
              {status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Phone:</span> {phoneNo}
            </div>
            <div>
              <span className="font-medium">Registered At:</span>{" "}
              {registrationTimestamp &&
                format(new Date(registrationTimestamp), "PPP")}
            </div>
            <div>
              <span className="font-medium">College:</span>{" "}
              {collegeDetails.collegeName}
            </div>
            <div>
              <span className="font-medium">Year:</span> {collegeDetails.year}
            </div>
            <div>
              <span className="font-medium">Approval:</span>{" "}
              <Badge
                className={cn(
                  isApproved ? "bg-emerald-600" : "bg-red-600"
                )}
              >
                {isApproved ? "Approved" : "Not Approved"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Right: Pass Card */}
  {data?.passGenerated && <div className="md:w-[260px] flex-shrink-0">
      <div className="h-full border border-dashed rounded-xl p-4 bg-zinc-800 text-center">
        <p className="text-sm mb-3 text-muted-foreground">Your Event Pass</p>
        <Button variant="secondary" className="rounded-md w-full">
          Show Pass
        </Button>
      </div>
    </div>}
  </div>
</div>

  )
}

export default SimpleEventRegistrationDetails
