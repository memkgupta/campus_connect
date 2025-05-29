import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { eventCreationEventStructureSchema } from '@/schema/eventRegistrationSchema';
import { updateEventSection } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useEventDashboard } from '@/context/dashboard/useContext';

const EditEventStructure = () => {
  const {data,setData} = useEventDashboard()!;
  const eventStructure = data.eventStructure;
  const {toast} = useToast()
  const form = useForm({
    resolver: zodResolver(eventCreationEventStructureSchema),
    defaultValues: eventStructure
  });

  const { register, control, setValue } = form;

  const roundsArray = useFieldArray({
    control,
    name: 'roundsDetails'
  });

  const timelineArray = useFieldArray({
    control,
    name: 'timeline'
  });

  const speakers = useFieldArray({ control, name: 'speakers' });
  const mentors = useFieldArray({ control, name: 'mentors' });
  const judges = useFieldArray({ control, name: 'judges' });
  const guests = useFieldArray({ control, name: 'guests' });
   const { fields, append, remove } = useFieldArray({
    control,
    name: 'teamRequirements.otherCriterias',
  })
const editSubmit = async(update:any)=>{
  try{
    console.log(update)
    const {event,message} = await updateEventSection("structure",update,data._id);
    setData(event)
    toast({
      title:message
    })
  }
  catch(error:any){
    toast({
      title:error.message
    })
  }
}
  return (
    <Form {...form}>
      <form className='grid gap-6' onSubmit={form.handleSubmit(editSubmit)}>
        {/* Eligibility */}
        <FormField
          control={control}
          name='eligibility'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eligibility</FormLabel>
              <FormControl>
                <Textarea placeholder='Eligibility Criteria' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Team Requirements */}
        {data.basicDetails.isTeamEvent && (
          <div className='space-y-2'>
            <Label>Team Requirements</Label>
          <FormField
  control={control}
  name='teamRequirements.minimumStrength'
  render={({ field }) => (
    <FormItem>
      <FormLabel>Minimum Team Strength</FormLabel>
      <FormControl>
        <Input type='number' placeholder='Minimum Strength' {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
          <FormField
  control={control}
  name="teamRequirements.diffCollegeTeamMembersAllowed"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center gap-2 space-y-0">
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel>Allow different college team members</FormLabel>
    </FormItem>
  )}
/>

 <div className="space-y-4">
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`teamRequirements.otherCriterias.${index}`}
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Textarea
                  placeholder={`Other team criteria #${index + 1}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 text-red-500"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </FormItem>
          )}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append('')}
        className="mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add More Criteria
      </Button>
    </div>
          </div>
        )}

        {/* Round Details */}
        {data.basicDetails.multipleRounds && (
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <Label>Rounds</Label>
              <Button
                type='button'
                onClick={() =>
                  roundsArray.append({
                    title: '',
                    description: '',
                    isOnline: false,
                    isElimination: false
                  })
                }
              >
                + Add Round
              </Button>
            </div>

            {roundsArray.fields.map((round, idx) => (
              <div
                key={round.id}
                className='border p-4 rounded-md space-y-2'
              >
                <Input
                  placeholder='Round Title'
                  {...register(`roundsDetails.${idx}.title`)}
                />
                <Textarea
                  placeholder='Round Description'
                  {...register(`roundsDetails.${idx}.description`)}
                />
                <div className='flex items-center gap-4'>
                  <Label>Online?</Label>
                  <Switch {...register(`roundsDetails.${idx}.isOnline`)} />
                  <Label>Elimination?</Label>
                  <Switch
                    {...register(`roundsDetails.${idx}.isElimination`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <Label>Timeline</Label>
            <Button
              type='button'
              onClick={() =>
                timelineArray.append({
                  start: new Date(),
                  end: new Date(),
                  description: ''
                })
              }
            >
              + Add Timeline
            </Button>
          </div>

          {timelineArray.fields.map((t, idx) => (
            <div key={t.id} className='grid grid-cols-1 md:grid-cols-3 gap-2'>
              {/* Start Date */}
              <FormField
                control={control}
                name={`timeline.${idx}.start`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full text-left',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick date'}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
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
                name={`timeline.${idx}.end`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full text-left',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick date'}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Textarea
                {...register(`timeline.${idx}.description`)}
                placeholder='What happens here?'
              />
            </div>
          ))}
        </div>

        {/* Guests / Speakers / Mentors / Judges */}
        <GuestSection title='Speakers' fieldArray={speakers} register={register} />
        {data.type === 'hackathon' && (
          <GuestSection title='Mentors' fieldArray={mentors} register={register} />
        )}
        {(data.type === 'hackathon' || data.type === 'contest') && (
          <GuestSection title='Judges' fieldArray={judges} register={register} />
        )}
        <GuestSection title='Guests' fieldArray={guests} register={register} />

        {/* Submit Button */}
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  );
};

function GuestSection({
  title,
  fieldArray,
  register
}: {
  title: string;
  fieldArray: any;
  register: any;
}) {
  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <Label>{title}</Label>
        <Button
          type='button'
          onClick={() =>
            fieldArray.append({
              name: '',
              image: '',
              about: '',
              category: 'speaker'
            })
          }
        >
          + Add
        </Button>
      </div>
      {fieldArray.fields.map((g: any, idx: number) => (
        <div key={g.id} className='border p-4 rounded space-y-2'>
          <Input
            placeholder='Name'
            {...register(`${fieldArray.name}.${idx}.name`)}
          />
          <Input
            placeholder='Image URL'
            {...register(`${fieldArray.name}.${idx}.image`)}
          />
          <Textarea
            placeholder='About'
            {...register(`${fieldArray.name}.${idx}.about`)}
          />
          <select
            className='w-full border rounded p-2'
            {...register(`${fieldArray.name}.${idx}.category`)}
          >
            <option value='speaker'>Speaker</option>
            <option value='mentor'>Mentor</option>
            <option value='chief-guest'>Chief Guest</option>
            <option value='judge'>Judge</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default EditEventStructure;
