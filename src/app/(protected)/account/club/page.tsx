"use client"
import Loader from '@/components/Loader';
import { useToast } from '@/components/ui/use-toast';
import { ClubContext } from '@/context/ClubContext'

import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react'

import * as z from "zod"

import {  useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { editClubSchema } from '@/schema/editClubSchema';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, PlusCircle, Trophy, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { BACKEND_URL } from '@/constants';
import Cookies from 'js-cookie';
import { useSession } from '@/hooks/useSession';
import Link from 'next/link';
import CustomImage from '@/components/ui/image';
import { useClub } from '@/hooks/useClubContext';
import ClubDashboard from '@/components/club/admin/club-dahsboard';
import TeamLeadDashboard from '@/components/club/lead/TeamLeadDashboard';
import MemberDashboard from '@/components/club/member/MemberDashboard';
const Page = () => {
  const {toast} = useToast();

  
    const clubContext = useClub()

   




  return (
   <>
    {clubContext.selectedClub?(
    <div className='flex flex-col min-h-[90vh] items-center '>
    {clubContext.selectedClub ? (
       <div className="min-h-screen bg-slate-950">
    {
      ["admin","president","vice-president"].includes(clubContext.selectedClub.role) && <ClubDashboard/>
    }
    {
      clubContext.selectedClub.role==="team-lead" && <TeamLeadDashboard/>
    }
    {
      clubContext.selectedClub.role==="team-member" && <MemberDashboard/>
    }
     </div>
     ):(
      <div className='bg-slate-800 rounded-md p-4 my-auto mx-auto w-2/4  flex flex-col items-center'>
        <p className='text-center'>You have not registered your club yet</p>
        <Link className={`text-yellow-400 text-xs antialiased text-center`} href={"/account/register-a-club"}>Register now</Link>
      </div>
     )}
    </div>
    ):(
      <Loader/>
    )}
   </>
  )
}

export default Page