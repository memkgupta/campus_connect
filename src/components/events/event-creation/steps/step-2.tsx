import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

export default function Step2_BasicDetails() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
    watch
  } = useFormContext();
  const isOnline = watch("basicDetails.isOnline");
  const isTeamEvent = watch("basicDetails.isTeamEvent");
  const isFree = watch("basicDetails.isFree");
  const multipleRounds = watch("basicDetails.multipleRounds");
  const endDate = watch("basicDetails.endDate")
  const startDate = watch("basicDetails.startDate")
  const registrationDeadline = watch("basicDetails.registrationDeadline")
  const participantsFromOutsideAllowed = watch("basicDetails.participantsFromOutsideAllowed")
useEffect(()=>{
    if(isTeamEvent == undefined && isFree==undefined && multipleRounds==undefined && isOnline ==undefined){
        setValue("basicDetails.isTeamEvent",false)
        setValue("basicDetails.isOnline",false)
        setValue("basicDetails.isFree",false)
        setValue("basicDetails.multipleRounds",false)
    }
},[
    isTeamEvent,isFree,multipleRounds,isOnline
])
  return (
    <div className="grid gap-4">
      <div>
        <Label>Title</Label>
        <Input {...register("basicDetails.title")} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("basicDetails.description")} />
      </div>

      <div>
        <Label>Venue</Label>
        <Input {...register("basicDetails.venue")} />
      </div>

{/* dates */}
<div className="flex justify-between">
<div className="">
      <FormField
          control={control}
          name="startDate"
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
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      {startDate ? (
                        format(startDate, "PPP")
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
                    selected={startDate}
                    onSelect={(e)=>{
                        setValue("basicDetails.startDate",e)
                    }}
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
      </div>

      <div className="">
    
        <FormField
          control={control}
          name="endDate"
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
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      {endDate ? (
                        format(endDate, "PPP")
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
                    selected={endDate}
                    onSelect={(e)=>{
                        setValue("basicDetails.endDate",e)
                    }}
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
      </div>

      <div className="">
      <FormField
          control={control}
          name="registrationDeadline"
          render={({ field }) => (
            <FormItem className="flex items-center ">
              <FormLabel className="w-full text-center">Registration Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !registrationDeadline && "text-muted-foreground"
                      )}
                    >
                      {registrationDeadline ? (
                        format(registrationDeadline, "PPP")
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
                    selected={registrationDeadline}
                    onSelect={(e)=>{
                        setValue("basicDetails.registrationDeadline",e)
                    }}
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
      </div>
</div>
<div className="flex justify-between">
<div className="flex items-center gap-2">
        <Label>Is Online</Label>
        <Switch checked={isOnline} onCheckedChange={(value) => setValue("basicDetails.isOnline", value)} />
      </div>

      <div className="flex items-center gap-2">
        <Label>Is Team Event</Label>
        <Switch  checked={isTeamEvent} onCheckedChange={(value) => setValue("basicDetails.isTeamEvent", value)} />
      </div>

      <div className="flex items-center gap-2">
        <Label>Is Free</Label>
        <Switch checked={isFree} onCheckedChange={(value) => setValue("basicDetails.isFree", value)} />
      </div>
      <div className="flex items-center gap-2">
      <Label>Multiple Rounds</Label>
        <Switch checked={multipleRounds} onCheckedChange={(value)=>setValue("basicDetails.multipleRounds",value)} />
       
      </div>
      <div className="flex items-center gap-2">
      <Label>Outside participants Allowed</Label>
        <Switch checked={participantsFromOutsideAllowed} onCheckedChange={(value)=>setValue("basicDetails.participantsFromOutsideAllowed",value)} />
       
      </div>
</div>
    

      <div>
        <Label>Category</Label>
        <Input {...register("basicDetails.category")} />
      </div>

      <div>
        <Label>Max Participants (optional)</Label>
        <Input min={10} defaultValue={10} type="number" {...register("basicDetails.maxParticipants", { valueAsNumber: true })} />
      </div>

     
    </div>
  );
}