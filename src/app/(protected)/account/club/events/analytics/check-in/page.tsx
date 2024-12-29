"use client";

import { SearchParticipant } from "@/components/club/analytics/check-in/search-participants";
import { QRScanner } from "@/components/club/analytics/check-in/qr-scanner";
import { ParticipantList } from "@/components/club/analytics/check-in/participant-list";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function CheckIn() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8">Check-in Portal</h1>
        
        <Card className="bg-slate-900 border-yellow-500/20">
          <Tabs defaultValue="search" className="p-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="search" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">
                Search
              </TabsTrigger>
              <TabsTrigger value="scan" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">
                Scan QR
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-6">
              <SearchParticipant onSearch={setSearchQuery} />
            </TabsContent>
            
            <TabsContent value="scan" className="mt-6">
              <QRScanner />
            </TabsContent>
          </Tabs>
        </Card>

        <ParticipantList searchQuery={searchQuery} />
      </div>
    </div>
  );
}