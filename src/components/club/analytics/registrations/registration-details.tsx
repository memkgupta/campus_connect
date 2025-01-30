// import { RegistrationDocument } from "@/app/(protected)/account/club/registrations/analytics/registrations/[id]/types";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { RegistrationDocument } from "@/types/types";
import { format } from "date-fns";
import { AtSign,Calendar } from "lucide-react";



export function RegistrationDetails({ registration }: {registration:RegistrationDocument}) {
    return (
        <Card className="bg-slate-950 border-yellow-500">
        {/* Event Banner Section */}
        <div className="relative h-48 w-full">
          <CustomImage
            src={registration.event.banner} 
            alt={registration.event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
  
        {/* Event Details */}
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold text-yellow-400">
            {registration.event.name}
          </CardTitle>
          <p className="text-yellow-300/80">{registration.event.description}</p>
          <div className="flex items-center gap-2 text-yellow-500">
            <Calendar className="w-4 h-4" />
            <time className="text-sm">
              {format(new Date(registration.event.dateTime), "PPP 'at' p")}
            </time>
          </div>
        </CardHeader>
  
        <CardContent className="space-y-8">
          {/* User Profile Section */}
          <div className="p-6 rounded-lg bg-slate-900/50 border border-yellow-500/20">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Registrant Details</h3>
            <div className="flex items-center gap-4">
              <CustomImage
                src={registration.user.profile} 
                alt={registration.user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500"
              />
              <div className="space-y-1">
                <h4 className="font-semibold text-yellow-400">{registration.user.name}</h4>
                <p className="text-sm text-yellow-500">{registration.user.email}</p>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <AtSign className="w-4 h-4" />
                  {registration.user.username}
                </div>
              </div>
            </div>
          </div>
  
          {/* Registration Response Section */}
          <div className="p-6 rounded-lg bg-slate-900/50 border border-yellow-500/20">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Registration Response</h3>
            <div className="space-y-4">
              {registration.registrationForm[0].fields.map((field) => (
                <div key={field._id} className="space-y-2">
                  <label className="text-sm text-yellow-500">{field.fieldLabel}</label>
                  <div className="p-3 rounded-md bg-slate-900 border border-yellow-500/20 text-yellow-400">
                    {field.fieldType === 'textarea' ? (
                      <div className="whitespace-pre-wrap">
                        {registration.submission.submissionData[field._id]}
                      </div>
                    ) : (
                      registration.submission.submissionData[field._id]
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      );
}