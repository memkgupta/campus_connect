// updated Step3_Structure.tsx with all inputs wrapped using FormField and FormControl

import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function Step3_Structure() {
  const {
    control,
    watch,
    setValue,
    register,
  } = useFormContext();

  const isTeam = watch("basicDetails.isTeamEvent");
  const diffCollegeTeamallowed = watch("eventStructure.teamRequirements.diffCollegeTeamMembersAllowed");
  const hasRounds = watch("basicDetails.multipleRounds");
  const type = watch("type.type");

  const roundsArray = useFieldArray({ control, name: "eventStructure.roundsDetails" });
  const timelineArray = useFieldArray({ control, name: "eventStructure.timeline" });
  const speakers = useFieldArray({ control, name: "eventStructure.speakers" });
  const mentors = useFieldArray({ control, name: "eventStructure.mentors" });
  const judges = useFieldArray({ control, name: "eventStructure.judges" });
  const guests = useFieldArray({ control, name: "eventStructure.guests" });

  return (
    <div className="space-y-6">
      {/* Eligibility */}
      <FormField
        control={control}
        name="eventStructure.eligibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Eligibility Criteria</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Team Requirements */}
      {isTeam && (
        <div className="space-y-2">
          <FormField
            control={control}
            name="eventStructure.teamRequirements.minimumStrength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Strength</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="flex items-center gap-2">
            <FormLabel>Allow different college team members</FormLabel>
            <FormControl>
              <Switch
                checked={diffCollegeTeamallowed}
                onCheckedChange={(e) =>
                  setValue("eventStructure.teamRequirements.diffCollegeTeamMembersAllowed", e)
                }
              />
            </FormControl>
          </FormItem>

          <FormField
            control={control}
            name="eventStructure.teamRequirements.otherCriterias.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Criteria</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Rounds */}
      {hasRounds && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Rounds</FormLabel>
            <Button
              type="button"
              onClick={() => roundsArray.append({ title: "", description: "", isOnline: false })}
            >
              + Add Round
            </Button>
          </div>

          {roundsArray.fields.map((round, idx) => (
            <div key={round.id} className="border p-4 rounded-md space-y-2">
              <FormField
                control={control}
                name={`eventStructure.roundsDetails.${idx}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`eventStructure.roundsDetails.${idx}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Round Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="flex items-center gap-4">
                <FormLabel>Online?</FormLabel>
                <FormControl>
                  <Switch {...register(`eventStructure.roundsDetails.${idx}.isOnline`)} />
                </FormControl>
                <FormLabel>Elimination?</FormLabel>
                <FormControl>
                  <Switch {...register(`eventStructure.roundsDetails.${idx}.isElimination`)} />
                </FormControl>
              </FormItem>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <FormLabel>Timeline</FormLabel>
          <Button
            type="button"
            onClick={() => timelineArray.append({ start: new Date(), end: new Date(), description: "" })}
          >
            + Add Timeline
          </Button>
        </div>

        {timelineArray.fields.map((t, idx) => (
          <div key={t.id} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {["start", "end"].map((fieldType) => (
              <FormField
                key={fieldType}
                control={control}
                name={`eventStructure.timeline.${idx}.${fieldType}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center">
                      {fieldType === "start" ? "Start Date" : "End Date"}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={control}
              name={`eventStructure.timeline.${idx}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What happens here?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      {/* Guests */}
      <GuestSection title="Speakers" fieldArray={speakers} register={register} />
      {type === "hackathon" && <GuestSection title="Mentors" fieldArray={mentors} register={register} />}
      {(type === "contest" || type === "hackathon") && (
        <GuestSection title="Judges" fieldArray={judges} register={register} />
      )}
      <GuestSection title="Guests" fieldArray={guests} register={register} />
    </div>
  );
}

function GuestSection({ title, fieldArray, register }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <FormLabel>{title}</FormLabel>
        <Button
          type="button"
          onClick={() =>
            fieldArray.append({ name: "", image: "", about: "", category: "speaker" })
          }
        >
          + Add
        </Button>
      </div>

      {fieldArray.fields.map((g: any, idx: number) => (
        <div key={g.id} className="border p-4 rounded space-y-2">
          {[
            { name: "name", type: "text", label: "Name" },
            { name: "image", type: "text", label: "Image URL" },
            { name: "about", type: "textarea", label: "About" },
          ].map(({ name, type, label }) => (
            <FormField
              key={name}
              control={fieldArray.control}
              name={`${fieldArray.name}.${idx}.${name}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    {type === "textarea" ? (
                      <Textarea {...field} />
                    ) : (
                      <Input {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={fieldArray.control}
            name={`${fieldArray.name}.${idx}.category`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select className="w-full border rounded p-2" {...field}>
                    <option value="speaker">Speaker</option>
                    <option value="mentor">Mentor</option>
                    <option value="chief-guest">Chief Guest</option>
                    <option value="judge">Judge</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
