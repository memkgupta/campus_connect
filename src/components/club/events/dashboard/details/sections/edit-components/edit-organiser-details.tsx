'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { eventCreationOrganiserDetailsSchema } from '@/schema/eventRegistrationSchema';



export default function EditOrganiserDetails({data}:{data:any}) {
  const form = useForm({
    resolver: zodResolver(eventCreationOrganiserDetailsSchema),
    defaultValues: data.organiserDetails
    
  });

  const { control, register, handleSubmit, watch, formState: { errors } } = form;

  const organisers = useFieldArray({
    control,
    name: 'organiserDetails.organisers'
  });

  const guidelines = useFieldArray({
    control,
    name: 'organiserDetails.guidelines'
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Organisers Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xl">Organisers</Label>
            <Button
              type="button"
              onClick={() => organisers.append({ name: '', level: 1, position: '', image: '' })}
            >
              + Add Organiser
            </Button>
          </div>

          {organisers.fields.map((organiser, idx) => (
            <div key={organiser.id} className="border p-4 rounded-md space-y-4">
              <FormField
                control={control}
                name={`organiserDetails.organisers.${idx}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`organiserDetails.organisers.${idx}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Position" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`organiserDetails.organisers.${idx}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Level" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`organiserDetails.organisers.${idx}.image`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Guidelines Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xl">Guidelines</Label>
            <Button
              type="button"
              onClick={() => guidelines.append({ title: '', description: '' })}
            >
              + Add Guideline
            </Button>
          </div>

          {guidelines.fields.map((guide, idx) => (
            <div key={guide.id} className="border p-4 rounded-md space-y-4">
              <FormField
                control={control}
                name={`organiserDetails.guidelines.${idx}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`organiserDetails.guidelines.${idx}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
