"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import axios from "axios"
// import { toast } from "react-toastify"
import FileUpload from "@/components/utils/files/file-upload"
import { ClubContext } from "@/context/ClubContext"
import { BACKEND_URL, eventCategories } from "@/constants"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { ImageEditor } from "@/components/imageSelector/image-selector"
// Mock event categories enum
const eventCategoriesEnum = [
  "Conference",
  "Workshop",
  "Seminar",
  "Networking",
  "Other",
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  dateTime: z.date({
    required_error: "A date and time is required.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  venue: z.string().min(2, {
    message: "Venue is required.",
  }),
  category: z.enum(eventCategories.map(e=>e.value) as [string, ...string[]], {
    required_error: "Please select an event category.",
  }),
  
  isTeamEvent: z.boolean().default(false),
  participantsFromOutsideAllowed: z.boolean().default(false),
  isAcceptingVolunteerRegistrations: z.boolean().default(false),
  maxCapacity: z.number().min(1, {
    message: "Max capacity must be at least 1.",
  }),
  external_forms: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      form: z.string().optional(),
      link: z.string().url("Link must be a valid URL").optional(),
    })
  ),
})

export default function AddEventForm() {
  const toast = useToast()
  const[isSubmitting,setIsSubmitting] = React.useState(false);
  const [bannerUrl,setBannerUrl] = React.useState<string|null>(null)
  const clubContext = React.useContext(ClubContext)
  // clubContext
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isTeamEvent: false,
      participantsFromOutsideAllowed: false,
      isAcceptingVolunteerRegistrations: false,
      maxCapacity: 100,
      external_forms: [],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "external_forms",
  })
  const router = useRouter()
 async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, you would send this data to your backend
 try {
  if(bannerUrl==null) {
    toast.toast({
      title:"Banner is required"
    })
    return;
  }
  const res = await axios.post(`${BACKEND_URL}/events/add-event`,{...values,banner:bannerUrl,clubId:clubContext?._id},{headers:{
    "Authorization":`Bearer ${Cookies.get('access-token')}`
  },params:{
    club_id:clubContext?._id
  }});
  if(res.data.success){
    toast.toast({
      title:"Event Created Successfully"
    })
    router.push(`/club/events/${res.data._id}`)
  }
 } catch (error) {
  toast.toast({
    title:"Some error occured"
  })
 }

  }

  return (
    <div
     className="p-24">
  <ImageEditor size={{width:900,height:300}} preview={bannerUrl} isRound={false} type="banner" title={`Profile image for event`} setImage={(url)=>setBannerUrl(url)}/>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date and Time</FormLabel>
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
                        field.value.toLocaleString()
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3">
                    <Input
                      type="time"
                      onChange={(e) => {
                        const date = field.value || new Date()
                        const [hours, minutes] = e.target.value.split(':')
                        date.setHours(parseInt(hours), parseInt(minutes))
                        field.onChange(date)
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="Enter event venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isTeamEvent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Team Event</FormLabel>
                <FormDescription>
                  Is this event for teams?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="participantsFromOutsideAllowed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allow Outside Participants</FormLabel>
                <FormDescription>
                  Can participants from outside join?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAcceptingVolunteerRegistrations"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Accept Volunteer Registrations</FormLabel>
                <FormDescription>
                  Are you accepting volunteer registrations?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
         <div>
          <h3 className="mb-4 text-lg font-medium">Additional Forms</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 space-y-4">
              <FormField
                control={form.control}
                name={`external_forms.${index}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`external_forms.${index}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Link</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Remove Form
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ label: "", link: "" })}
          >
            Add Form
          </Button>
        </div>

        <FormField
          control={form.control}
          name="maxCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Capacity</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        <Button type="submit">Create Event</Button>
      </form>
    </Form>
     </div>
  )
}