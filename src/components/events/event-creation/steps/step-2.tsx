import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect } from "react";

export default function Step2_BasicDetails() {
  const {
    control,
    setValue,
    watch
  } = useFormContext();

  const isOnline = watch("basicDetails.isOnline");
  const isTeamEvent = watch("basicDetails.isTeamEvent");
  const isFree = watch("basicDetails.isFree");
  const multipleRounds = watch("basicDetails.multipleRounds");
  const endDate = watch("basicDetails.endDate");
  const startDate = watch("basicDetails.startDate");
  const registrationDeadline = watch("basicDetails.registrationDeadline");
  const participantsFromOutsideAllowed = watch("basicDetails.participantsFromOutsideAllowed");

  useEffect(() => {
    if (
      isTeamEvent === undefined &&
      isFree === undefined &&
      multipleRounds === undefined &&
      isOnline === undefined
    ) {
      setValue("basicDetails.isTeamEvent", false);
      setValue("basicDetails.isOnline", false);
      setValue("basicDetails.isFree", false);
      setValue("basicDetails.multipleRounds", false);
    }
  }, [isTeamEvent, isFree, multipleRounds, isOnline]);

  return (
    <div className="grid gap-4">

      {/* Title */}
      <FormField
        control={control}
        name="basicDetails.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter event title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={control}
        name="basicDetails.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Event description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Venue */}
      <FormField
        control={control}
        name="basicDetails.venue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. Main Auditorium" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Start Date */}
      <FormField
        control={control}
        name="basicDetails.startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}>
                    {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* End Date */}
      <FormField
        control={control}
        name="basicDetails.endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}>
                    {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Registration Deadline */}
      <FormField
        control={control}
        name="basicDetails.registrationDeadline"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Registration Deadline</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}>
                    {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Switches */}
      <div className="grid grid-cols-2 gap-4">
        {[
          ["basicDetails.isOnline", "Is Online", isOnline],
          ["basicDetails.isTeamEvent", "Is Team Event", isTeamEvent],
          ["basicDetails.isFree", "Is Free", isFree],
          ["basicDetails.multipleRounds", "Multiple Rounds", multipleRounds],
          ["basicDetails.participantsFromOutsideAllowed", "Outside Participants Allowed", participantsFromOutsideAllowed]
        ].map(([name, label, value]) => (
          <FormField
            key={name}
            control={control}
            name={name as any}
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel className="text-sm font-medium">{label}</FormLabel>
                <FormControl>
                  <Switch
                    checked={!!value}
                    onCheckedChange={(val) => setValue(name as any, val)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>

      {/* Category */}
      <FormField
        control={control}
        name="basicDetails.category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Max Participants */}
      <FormField
        control={control}
        name="basicDetails.maxParticipants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Participants (optional)</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={10} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
}
