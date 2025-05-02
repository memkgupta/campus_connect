import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomImage from '@/components/ui/image';
import { BACKEND_URL } from '@/constants';
import { useClub } from '@/hooks/useClubContext';
import axios, { AxiosError } from 'axios';
import { BuildingIcon, CalendarIcon, ClipboardIcon, ClockIcon, FlagIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
const AdminEventDetails = ({event_id}:{event_id:string}) => {
    const clubContext = useClub();
    const fetchEvent = async () => {
      if (clubContext.selectedClub?._id) {
        try {
        
          const res = await axios.get(
            `${BACKEND_URL}/club/events/dashboard/${event_id}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("access-token")}`,
              },
              params: { club_id: clubContext.selectedClub?._id },
            }
          );
          const data = res.data.data;
      
          // setIsRegistered(data.registered)
         
          return data;
        } catch (error) {
         
          const axiosError = error as AxiosError<any>;
          if (axiosError.response) {
            if (axiosError.status !== 500) {
              toast({
                title: axiosError.response.data.message,
                variant: "destructive",
              });
            } else {
              toast({
                title: "Some error occured",
                variant: "destructive",
              });
            }
          }
  
          return Promise.reject("Some error occured");
        } 
      } else {
        return Promise.reject("Inavlid session");
      }
    };
  
  const {data,isLoading} =  useQuery({
      queryKey: [event_id],
      queryFn: fetchEvent,
      retry: false,
      refetchOnWindowFocus: false,
    });
  
  return (
    <div>
    {/* Event Details */}
  {isLoading || !data ?<Loader/>:
  
  (
    <div >
    <div className="relative w-full h-64 mb-6">
      <CustomImage
        src={data.banner}
        alt={data.name}
        className="rounded-lg"
      />
    </div>

    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="space-x-2">
          {data.isTeamEvent && (
            <Badge variant="secondary">Team Event</Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle>Event Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span>
              {new Date(data.dateTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-muted-foreground" />
            <span>
              {new Date(data.dateTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-muted-foreground" />
            <span>{data.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BuildingIcon className="h-5 w-5 text-muted-foreground" />
            <span>{data.venue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FlagIcon className="h-5 w-5 text-muted-foreground" />
            <span>{data.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-muted-foreground" />
            <span>Max Capacity: {data.maxCapacity}</span>
          </div>
          {data.participantsFromOutsideAllowed && (
            <div className="flex items-center space-x-2">
              <UserPlusIcon className="h-5 w-5 text-muted-foreground" />
              <span>Open to outside participants</span>
            </div>
          )}
          {data.isAcceptingVolunteerRegistrations && (
            <div className="flex items-center space-x-2">
              <ClipboardIcon className="h-5 w-5 text-muted-foreground" />
              <span>Accepting volunteer registrations</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
        </CardHeader>
        <CardContent>
          {data.forms?.length > 0 ? (
            data.forms.map(
              (_form: { _id: string; formName: string }) => {
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle>{_form.formName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/account/club/events/forms/${_form._id}`}
                        className="bg-yellow-300 p-2 rounded-md text-black"
                      >
                        View
                      </Link>
                    </CardContent>
                  </Card>
                );
              }
            )
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Registration form</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <p>No Form added</p>
                  
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.external_forms &&
          data.external_forms.map((form: any) => (
            <Card
              key={form._id}
              className="bg-slate-900 border-slate-800"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">
                      {form.label}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      {data.external_forms && data.external_forms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">
            No forms available. 
          </p>
        </div>
      )}
    </div>
  </div>
  )}
  </div>
  )
}

export default AdminEventDetails