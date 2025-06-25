import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils"; // utility for tailwind class merging
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

const typeDescriptions: Record<string, string> = {
  hackathon: "Competitive event to build solutions in teams",
  session: "One-way or interactive speaker session",
  workshop: "Hands-on guided learning event",
  contest: "Timed competitions with tasks or quizzes",
  campaign: "Awareness or action-oriented drive",
  other: "Any other type of event",
  "ground-work": "On-ground volunteering or real-world tasks"
};

export default function Step1_EventType() {
  const { setValue, watch,formState:{errors} } = useFormContext();
  const selected = watch("type");

  const types = Object.keys(typeDescriptions);
    useEffect(()=>{console.log(selected)},[selected])
    useEffect(()=>{console.log(errors)},[errors])
  return (
    <div className="space-y-4">
      <Label className="text-xl">Select Event Type</Label>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type) => {
          const isSelected = selected === type;

          return (
            <div
              key={type}
              onClick={() =>{setValue("type",type)}}
              className={cn(
                "cursor-pointer border rounded-md p-4 shadow-sm transition-all",
                isSelected ? "border-blue-600 bg-yellow-50/10" : "hover:border-blue-300"
              )}
            >
              <div className="font-medium capitalize">{type.replace("-", " ")}</div>
              <div className="text-sm text-muted-foreground">{typeDescriptions[type]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
