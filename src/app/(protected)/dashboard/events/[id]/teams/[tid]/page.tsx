"use client";
import { useToast } from '@/components/ui/use-toast';
import { BACKEND_URL_V2 } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Member, RegistrationDetails } from '@/types/events';
import Loader from '@/components/Loader';
import TeamMemberCard from '@/components/club/events/dashboard/teams/team_member_card';
import { headers } from 'next/headers';

const EventTeamPage = ({ params }: { params: { tid: string; id: string } }) => {
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();

  const fetchTeamDetails = async () => {
    try {
      const req = await axios.get(
        `${BACKEND_URL_V2}/events/admin/teams/${params.tid}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access-token")}`,
          },
          params: {
            event_id: params.id,
          },
        }
      );
      return req.data;
    } catch (error) {
      const aError = error as AxiosError<any>;
      const message = aError.response?.data.message || "Some error occurred";
      toast({
        title: message,
        variant: "destructive",
      });
    }
  };

  const handleApproveTeam = async () => {
    try {
      setApproving(true);
    const req = await axios.patch(`${BACKEND_URL_V2}/events/admin/approve-team`,{},{
      params:{
        team_id:params.tid
      },
      headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
      }
    })
    toast({
      title:"Event approved"
    })
    } catch (error) {
      console.error("Failed to approve data.team:", error);
      const aError = error as AxiosError<any>
      const message = aError.response?.data.message||"Some error occured";
      toast({title:message,variant:"destructive"})
    } finally {
      setApproving(false);
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: [params.tid],
    queryFn: fetchTeamDetails,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <>
      {isFetching ? (
        <Loader />
      ) : (
        <>
          {data&& (
            <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-gray-700 text-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{data.team.name}</h2>
                  <p className="text-sm text-gray-400">Status: {data.team.status}</p>
                </div>
                <button
                  onClick={handleApproveTeam}
                  disabled={approving || data.team.status === "approved"}
                  className={`px-4 py-2 rounded-md text-white transition ${
                    data.team.status === "approved"
                      ? "bg-green-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {approving ? "Approving..." : "Approve Team"}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Members</h3>
                <div className="space-y-4">
                  {data.team.members.map((member: Member) => (
                   <TeamMemberCard member={member} registrationDetail={data.registrationDetails.find((f:RegistrationDetails)=>f._id===member.registrationDetails._id)}/>
                  ))}
                </div>
              </div>
            </div>
          )}
          
        </>
      )}
    </>
  );
};

export default EventTeamPage;
