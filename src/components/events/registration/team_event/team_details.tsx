// components/TeamDetails.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TeamDetails = () => {
  const [selectedOption, setSelectedOption] = useState<"join" | "create" | null>(null);
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleJoin = () => {
    console.log("Joining team with code:", teamCode);
    // TODO: Call your backend API to join a team using the teamCode
  };

  const handleCreate = () => {
    console.log("Creating team with name:", teamName);
    // TODO: Call your backend API to create a team with teamName
  };

  return (
    <div className="flex w-full h-full border rounded-xl overflow-hidden shadow-lg">
      {/* Sidebar */}
      <aside className="w-1/4 bg-muted p-4 flex flex-col gap-4 border-r">
        <Button
          variant={selectedOption === "join" ? "default" : "outline"}
          onClick={() => setSelectedOption("join")}
        >
          Join Team
        </Button>
        <Button
          variant={selectedOption === "create" ? "default" : "outline"}
          onClick={() => setSelectedOption("create")}
        >
          Create Team
        </Button>
      </aside>

      {/* Main Form Area */}
      <main className="flex-1 p-6">
        {selectedOption === "join" && (
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Join a Team</h2>
            <Input
              placeholder="Enter Team Code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
            />
            <Button onClick={handleJoin}>Join</Button>
          </div>
        )}

        {selectedOption === "create" && (
          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Create a Team</h2>
            <Input
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button onClick={handleCreate}>Create</Button>
          </div>
        )}

        {!selectedOption && (
          <div className="text-gray-500">Please select an option from the sidebar.</div>
        )}
      </main>
    </div>
  );
};

export default TeamDetails;
