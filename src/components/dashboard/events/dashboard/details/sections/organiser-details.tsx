// OrganiserDetailsSection.tsx
import { useEventDashboard } from "@/context/dashboard/useContext";
import React from "react";

const OrganiserDetailsSection = () => {
  const {data} = useEventDashboard()!
  const organiserDetails = data.organiserDetails
  const organisers = organiserDetails?.organisers || [];
  const guidelines = organiserDetails?.guidelines || [];

  return (
    <div className="bg-[#111] text-white p-6 space-y-6 rounded-md border border-[#333]">
      {organisers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Organisers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {organisers.map((org: any, idx: number) => (
              <div key={idx} className="bg-[#1a1a1a] p-3 rounded-md border border-gray-700 text-center">
                <img src={org.image} alt={org.name} className="h-24 w-24 object-cover mx-auto rounded-full mb-2" />
                <div className="font-semibold">{org.name}</div>
                <p className="text-sm text-gray-400">{org.position}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {guidelines.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Guidelines</h2>
          <ul className="space-y-3">
            {guidelines.map((g: any, idx: number) => (
              <li key={idx} className="border-l-4 border-blue-600 bg-[#1a1a1a] p-3 rounded-md">
                <div className="font-semibold text-white">{g.title}</div>
                <p className="text-sm text-gray-400">{g.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrganiserDetailsSection;
