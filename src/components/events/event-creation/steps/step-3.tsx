import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { Switch } from "@/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";

export default function Step3_Structure() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const isTeam = watch("basicDetails.isTeamEvent");
  const diffCollegeTeamallowed = watch("eventStructure.teamRequirements.diffCollegeTeamMembersAllowed")
  const hasRounds = watch("basicDetails.multipleRounds");
  const type = watch("type.type")
  const roundsArray = useFieldArray({
    control,
    name: "eventStructure.roundsDetails.rounds",
  });

  const timelineArray = useFieldArray({
    control,
    name: "eventStructure.timeline",
  });

  const speakers = useFieldArray({ control, name: "eventStructure.speakers" });
  const mentors = useFieldArray({ control, name: "eventStructure.mentors" });
  const judges = useFieldArray({ control, name: "eventStructure.judges" });
  const guests = useFieldArray({ control, name: "eventStructure.guests" });
  const noOfRounds = watch("eventStructure.roundsDetails.noOfRounds")

  useEffect(()=>{
    if(noOfRounds==undefined){
        setValue("eventStructure.roundsDetails.noOfRounds",0)
    }
  },[noOfRounds])
  return (
    <div className="space-y-6">
      {/* Eligibility */}
      <div>
        <Label>Eligibility Criteria</Label>
        <Textarea {...register("eventStructure.eligibility")} />
      </div>

      {/* Team Requirements (only if isTeamEvent is true) */}
      {isTeam && (
        <div className="space-y-2">
          <Label>Team Requirements</Label>
          <Input
            type="number"
            placeholder="Minimum Strength"
            {...register("eventStructure.teamRequirements.minimumStrength", { valueAsNumber: true })}
          />
          <div className="flex items-center gap-2">
            <Switch checked={diffCollegeTeamallowed} onCheckedChange={(e)=>setValue("eventStructure.teamRequirements.diffCollegeTeamMembersAllowed",e)} />
            <Label>Allow different college team members</Label>
          </div>
          <Textarea
            {...register("eventStructure.teamRequirements.otherCriterias.0")}
            placeholder="Other team criteria"
          />
        </div>
      )}

      {/* Round Details (if multipleRounds is true) */}
      {hasRounds && (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
            <Label>Total Rounds</Label>
            <Input type="number" defaultValue={1} min={1} onChange={(e)=>{setValue("eventStructure.roundDetails.noOfRounds",e.target.value)}} value={noOfRounds}/>
             
          </div>
          <div className="flex justify-between items-center">
            <Label>Rounds</Label>
            <Button type="button" disabled={noOfRounds==roundsArray.fields.length} onClick={() =>{ roundsArray.append({ title: "", description: "", isOnline: false });
     
        }}>
              + Add Round
            </Button>
          </div>

          {roundsArray.fields.map((round, idx) => (
            <div key={round.id} className="border p-4 rounded-md space-y-2">
              <Input placeholder="Round Title" {...register(`eventStructure.roundsDetails.rounds.${idx}.title`)} />
              <Textarea
                placeholder="Round Description"
                {...register(`eventStructure.roundsDetails.rounds.${idx}.description`)}
              />
              <div className="flex items-center gap-4">
                <Label>Online?</Label>
                <Switch {...register(`eventStructure.roundsDetails.rounds.${idx}.isOnline`)} />
                <Label>Elimination?</Label>
                <Switch {...register(`eventStructure.roundsDetails.rounds.${idx}.isElimination`)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Timeline</Label>
          <Button type="button" onClick={() => timelineArray.append({ start: new Date(), end: new Date(), description: "" })}>
            + Add Timeline
          </Button>
        </div>

        {timelineArray.fields.map((t, idx) => (
          <div key={t.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
          control={control}
          name={`eventStructure.timeline.${idx}.start`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-1">
              <FormLabel className="w-full text-center">Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                       date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
             
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={control}
          name={`eventStructure.timeline.${idx}.end`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-1">
              <FormLabel className="w-full text-center">End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                       date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <Textarea {...register(`eventStructure.timeline.${idx}.description`)} placeholder="What happens here?" />
          </div>
        ))}
      </div>

      {/* Guest sections (shared structure) */}
      <GuestSection title="Speakers" fieldArray={speakers} register={register} />
      {type=="hackathon" && <GuestSection title="Mentors" fieldArray={mentors} register={register} />}
      {(type=="contest" || type=="hackathon") &&<GuestSection title="Judges" fieldArray={judges} register={register} />}
      <GuestSection title="Guests" fieldArray={guests} register={register} />
    </div>
  );
}

// Reusable Guest Section Component
function GuestSection({ title, fieldArray, register }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>{title}</Label>
        <Button
          type="button"
          onClick={() => fieldArray.append({ name: "", image: "", about: "", category: "speaker" })}
        >
          + Add
        </Button>
      </div>
      {fieldArray.fields.map((g: any, idx: number) => (
        <div key={g.id} className="border p-4 rounded space-y-2">
          <Input placeholder="Name" {...register(`${fieldArray.name}.${idx}.name`)} />
          <Input placeholder="Image URL" {...register(`${fieldArray.name}.${idx}.image`)} />
          <Textarea placeholder="About" {...register(`${fieldArray.name}.${idx}.about`)} />
          <select className="w-full border rounded p-2" {...register(`${fieldArray.name}.${idx}.category`)}>
            <option value="speaker">Speaker</option>
            <option value="mentor">Mentor</option>
            <option value="chief-guest">Chief Guest</option>
            <option value="judge">Judge</option>
          </select>
        </div>
      ))}
    </div>
  );
}
