// EventStructureSection.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";

const PeopleGrid = ({ title, people }: { title: string; people: any[] }) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {people.map((person, idx) => (
        <div key={idx} className="bg-[#222] rounded-xl overflow-hidden shadow-md p-3">
          <img src={person.image} alt={person.name} className="h-32 w-full object-cover rounded-md mb-2" />
          <div className="font-medium text-white">{person.name}</div>
          <p className="text-xs text-gray-400">{person.about}</p>
        </div>
      ))}
    </div>
  </div>
);

const EventStructureSection = ({ eventStructure }: { eventStructure: any }) => {
  const { eligibility, teamRequirements, roundsDetails, guests, speakers, mentors, judges } = eventStructure;

  return (
    <div className="bg-[#111] text-white p-6 space-y-6 rounded-md border border-[#333]">
      <div>
        <h2 className="text-xl font-bold mb-2">Eligibility</h2>
        <p className="text-sm text-gray-300">{eligibility}</p>
      </div>

      {teamRequirements && (
        <div>
          <h2 className="text-xl font-bold mb-2">Team Requirements</h2>
          <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
            <li>Minimum Strength: {teamRequirements.minimumStrength}</li>
            <li>Different College Members Allowed: {teamRequirements.diffCollegeTeamMembersAllowed ? "Yes" : "No"}</li>
            {teamRequirements.otherCriterias?.map((criteria: string, idx: number) => <li key={idx}>{criteria}</li>)}
          </ul>
        </div>
      )}

      {roundsDetails?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Rounds</h2>
          <div className="space-y-4">
            {roundsDetails.map((round: any, idx: number) => (
              <div key={idx} className="border border-gray-700 p-4 rounded-md bg-[#1a1a1a]">
                <div className="font-medium text-white text-lg">{round.title}</div>
                <p className="text-sm text-gray-400 mb-2">{round.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {round.isOnline && <Badge variant="secondary">Online</Badge>}
                  {round.isElimination && <Badge variant="destructive">Elimination</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {guests && <PeopleGrid title="Guests" people={guests} />}
      {speakers && <PeopleGrid title="Speakers" people={speakers} />}
      {mentors && <PeopleGrid title="Mentors" people={mentors} />}
      {judges && <PeopleGrid title="Judges" people={judges} />}
    </div>
  );
};

export default EventStructureSection;
