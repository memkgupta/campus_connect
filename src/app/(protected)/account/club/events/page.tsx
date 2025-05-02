"use client"
import ClubAdminEventDashboard from '@/components/club/admin/admin-event-dashboard'
import AllEventsPage from '@/components/club/all-events-page'
import TeamLeadDashboard from '@/components/club/lead/TeamLeadDashboard'
import MemberEventDashboard from '@/components/club/member/member-event-dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useClub } from '@/hooks/useClubContext'
import { PlusIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Events = () => {
  const clubContext = useClub()
  return (
  <>
 {
  clubContext.selectedClub?(
<>
{
  ["admin","president","vice-president"].includes(clubContext.selectedClub.role) && <ClubAdminEventDashboard/>
}
{
  clubContext.selectedClub.role === "team-lead" && <TeamLeadDashboard/>
}
{
  clubContext.selectedClub.role==="team-member" && <MemberEventDashboard/>
}
</>
  ):
  (
    <>
    </>
  )
 }
 </>
  )
}

export default Events