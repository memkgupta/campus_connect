'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { eventCreationBasicDetailsSchema } from '@/schema/eventRegistrationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

const EditBasicDetails = ({ data }: { data: any }) => {
  const form = useForm({
    resolver: zodResolver(eventCreationBasicDetailsSchema),
    defaultValues: data,
  })

  return (
    <Form {...form}>
      <form className="grid gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
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
                <Textarea placeholder="Enter description" {...field} />
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
                <Input placeholder="Enter venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="flex justify-between flex-wrap gap-4">
          {['startDate', 'endDate', 'registrationDeadline'].map((dateField) => (
            <FormField
              key={dateField}
              control={form.control}
              name={dateField as 'startDate' | 'endDate' | 'registrationDeadline'}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-2">
                  <FormLabel className="text-center capitalize">{dateField.replace(/([A-Z])/g, ' $1')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
        </div>

        {/* Switches */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'isOnline', label: 'Is Online' },
            { name: 'isTeamEvent', label: 'Is Team Event' },
            { name: 'isFree', label: 'Is Free' },
            { name: 'multipleRounds', label: 'Multiple Rounds' },
            { name: 'participantsFromOutsideAllowed', label: 'Outside Participants Allowed' },
          ].map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{label}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Enter category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Participants */}
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Participants (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={10}
                  placeholder="10"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <Button type='submit'>Save</Button>
      </form>
    </Form>
  )
}

export default EditBasicDetails
