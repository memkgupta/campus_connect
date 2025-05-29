// app/checkin/page.tsx
'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic'
import axios from 'axios'
import { BACKEND_URL_V2 } from '@/constants'
import Cookies from 'js-cookie'
// Optional QR Scanner




export default function CheckInPage() {
  const [registrationId, setRegistrationId] = useState('')
  const [registration, setRegistration] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const fetchRegistration = async (id: string) => {
    setLoading(true)
    try {
      const res = await axios.get(`${BACKEND_URL_V2}/events/registrations/check-in/fetch`,{params:{
        regCode:registrationId
      },
    headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
    }})
      setRegistration(res.data.registration)
      setMessage(null)
    } catch (err: any) {
      setMessage('Registration not found')
      setRegistration(null)
    }
    setLoading(false)
  }

  const handleCheckIn = async () => {
    if (!registration) return
    console.log(registration)
    try {
      await axios.post(`${BACKEND_URL_V2}/events/registrations/check-in/mark`,
        {},{params:{
        id:registration._id
      },
    headers:{
        "Authorization":`Bearer ${Cookies.get("access-token")}`
    }}
      )
      setRegistration({ ...registration, checkedIn: true })
      setMessage('Checked in successfully!')
    } catch (err) {
      setMessage('Error during check-in')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Event Check-In</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Enter Registration ID"
          value={registrationId}
          onChange={(e) => setRegistrationId(e.target.value)}
        />
        <Button onClick={() => fetchRegistration(registrationId)} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch'}
        </Button>
        <Button variant="secondary" onClick={() => setScanning(!scanning)}>
          {scanning ? 'Close Scanner' : 'Scan QR'}
        </Button>
      </div>


      {message && <p className="text-sm text-red-600">{message}</p>}

      {registration && (
        <Card>
          <CardHeader>
            <CardTitle>Registration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>ID:</strong> {registration.id}</p>
            <p><strong>Name:</strong> {registration.name}</p>
            <p><strong>Email:</strong> {registration.email}</p>
            <p><strong>Status:</strong> {registration.checkedIn ? '✅ Checked In' : '❌ Not Checked In'}</p>

            {!registration.checkedIn && (
              <Button className="mt-4" onClick={handleCheckIn}>
                Confirm Check-In
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
