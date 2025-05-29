'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { eventCreationMonetoryDetailsSchema } from '@/schema/eventRegistrationSchema';
import { updateEventSection } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useEventDashboard } from '@/context/dashboard/useContext';


export default function EditMonatoryDetails() {
  const {data,setData} = useEventDashboard()!
  const form = useForm({
    resolver: zodResolver(eventCreationMonetoryDetailsSchema),
    defaultValues: data.monetaryDetails
  });
const {toast} = useToast()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = form;

  const tickets = useFieldArray({ control, name: 'ticketDetails.tickets' });
  const prizes = useFieldArray({ control, name: 'prizes' });
  const sponsors = useFieldArray({ control, name: 'sponsors' });

  const isFree =data.basicDetails.isFree;
  const type = data.type

  const onSubmit = async(update:any) => {
    try{
      const {event,message} = await updateEventSection("monetary",update,data._id)
      setData(event)
      toast({
        title:message,
      
      })
    }
    catch(error:any){
      toast({
        title:error.message,
        variant:"destructive"
      })
    }
   
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Ticket Section */}
        {!isFree && (
          <div className="space-y-4">
            <FormField
              control={control}
              name="ticketDetails.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Info about tickets..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <Label>Tickets</Label>
              <Button
                type="button"
                onClick={() => tickets.append({ title: '', price: 0, description: '' })}
              >
                + Add Ticket
              </Button>
            </div>

            {tickets.fields.map((ticket, idx) => (
              <div key={ticket.id} className="border p-4 rounded-md space-y-2">
                <FormField
                  control={control}
                  name={`ticketDetails.tickets.${idx}.title`}
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
                  name={`ticketDetails.tickets.${idx}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`ticketDetails.tickets.${idx}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* Prizes Section */}
        {(type === 'hackathon' || type === 'contest') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Prizes</Label>
              <Button
                type="button"
                onClick={() =>
                  prizes.append({ title: '', description: '', type: 'cash' })
                }
              >
                + Add Prize
              </Button>
            </div>

            {prizes.fields.map((prize, idx) => (
              <div key={prize.id} className="border p-4 rounded-md space-y-2">
                <FormField
                  control={control}
                  name={`prizes.${idx}.title`}
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
                  name={`prizes.${idx}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`prizes.${idx}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select prize type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="swags">Swags</SelectItem>
                          <SelectItem value="voucher">Voucher</SelectItem>
                          <SelectItem value="goods">Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}

        {/* Sponsors Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Sponsors</Label>
            <Button
              type="button"
              onClick={() =>
                sponsors.append({
                  name: '',
                  description: '',
                  logo: '',
                  level: 1
                })
              }
            >
              + Add Sponsor
            </Button>
          </div>

          {sponsors.fields.map((s, idx) => (
            <div key={s.id} className="border p-4 rounded-md space-y-2">
              <FormField
                control={control}
                name={`sponsors.${idx}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sponsor name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`sponsors.${idx}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Sponsor description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`sponsors.${idx}.logo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`sponsors.${idx}.level`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
