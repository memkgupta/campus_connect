"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// Import field schema
import { fieldSchema, FormField as FormFieldType } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Define Props
type Props = {
  fields: FormFieldType[];
  submitText?:string // Array of field configurations
  onSubmit: (data: Record<string, any>) => void; // Callback for form submission
  submitDisabled?:boolean
};

const CustomForm = ({ fields,submitText, onSubmit,submitDisabled}: Props) => {


  // Define form using Zod schema and default values from JSON
  const form = useForm({
    resolver: zodResolver(z.object(fields.reduce((acc, field) => {
      acc[field.name] = field.type === "multiselect" || field.type ==="multi-combo" 
        ? z.array(z.string()).refine((value) => value.some((item) => item))
        : field.type === "checkbox" 
        ? z.boolean() :field.type==="switch"?z.boolean():
         field.type==="number"?z.number():
         field.type==="date"?z.date()
        : z.string();
      return acc;
    }, {} as Record<string, any>))),
    defaultValues: fields.reduce((values, field) => {
      return { ...values, [field.name]: field.defaultValue  };
    }, {}),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as never}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="mr-2">{field.label}{field.required && <span className="text-red-500">*</span>}</FormLabel>
               
                  {field.type === "text" && <FormControl><Input  placeholder={field.placeholder} {...formField} /></FormControl>}
                  {field.type === "textarea" && <FormControl><Textarea placeholder={field.placeholder} {...formField} /></FormControl>}
                  {field.type === "select" && field.options && (
                 <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                 <FormControl>
                   <SelectTrigger>
                     <SelectValue placeholder={field.placeholder} />
                   </SelectTrigger>
                 </FormControl>
                 <SelectContent>
                 {field.options?.map(option=>(
<SelectItem value={typeof option ==="string"?option:option.value} key={typeof option ==="string"?option:option.value}>{typeof option ==="string"?option:option.label}</SelectItem>
                 )) }
                 </SelectContent>
               </Select>
                  )}
                  {field.type === "checkbox" && (
                    <FormControl>
  <Checkbox checked={formField.value} onCheckedChange={formField.onChange} />
                    </FormControl>
                  
                  )}
                  {field.type === "multiselect" && field.options && (
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                      {field.options.map((option) => (
                         <FormField
                         key={typeof option ==="string"?option:option.value}
                         control={form.control}
                         name={field.name as never}
                         render={({ field }) => {
                           return (
                             <FormItem
                               key={typeof option ==="string"?option:option.value}
                               className="flex flex-row items-start space-x-3 space-y-0"
                             >
                               <FormControl>
                                 <Checkbox
                                 // @ts-ignore
                                   checked={field.value?.includes(option)}
                                   onCheckedChange={(checked) => {
                                     return checked
                                       ? field.onChange([...field.value, option])
                                       : field.onChange(
                                        //@ts-ignore
                                           field.value?.filter(
                                             (value:string) => value !== option
                                           )
                                         )
                                   }}
                                 />
                               </FormControl>
                               <FormLabel className="text-sm font-normal">
                                 {typeof option ==="string"?option:option.label}
                               </FormLabel>
                             </FormItem>
                           )
                         }}
                       />
                      ))}
                    </div>
                    </FormControl>
                  )}
                  {field.type==="combo"&&field.options&&(
                     <Popover>
                     <PopoverTrigger asChild>
                       <FormControl>
                         <Button
                           variant="outline"
                           role="combobox"
                           className={cn(
                             "w-[200px] justify-between",
                             !formField.value && "text-muted-foreground"
                           )}
                         >
                           {formField.value
                             ? (field.options as {label:string,value:string}[]).find(
                                 (option) => option.value === formField.value
                               )?.label
                             : field.placeholder}
                           <ChevronsUpDown className="opacity-50" />
                         </Button>
                       </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-[200px] p-0">
                       <Command>
                         <CommandInput
                           placeholder="Search ..."
                           className="h-9"
                         />
                         <CommandList>
                           <CommandEmpty>No result found.</CommandEmpty>
                           <CommandGroup>
                             {(field.options as {label:string,value:string}[]).map((option) => (
                               <CommandItem
                                 value={(option as any).label }
                                 key={(option as any).value}
                                 onSelect={() => {
                                   form.setValue(field.name as never,option.value as never )
                                 }}
                               >
                                 {(option as any).label}
                                 <Check
                                   className={cn(
                                     "ml-auto",
                                     option.value === formField.value
                                       ? "opacity-100"
                                       : "opacity-0"
                                   )}
                                 />
                               </CommandItem>
                             ))}
                           </CommandGroup>
                         </CommandList>
                       </Command>
                     </PopoverContent>
                   </Popover>
                  )}
               {field.type==="date" && (
                <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !formField.value && "text-muted-foreground"
                      )}
                    >
                      {formField.value ? (
                        format(formField.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formField.value}
                    onSelect={formField.onChange}
                    disabled={(date) =>
                     (field.lte ?date>field.lte:false)|| date < new Date("1900-01-01")||(field.gte!=undefined?(date<field.gte):false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
               )}
               {field.type==="number"&&(
                <FormControl><Input type="number" placeholder={field.placeholder} {...formField}/></FormControl>
               )}
               {field.type==="switch" &&(
                <FormControl>
                  <Switch
                  value={formField.value}
                
                  onCheckedChange={formField.onChange}
                  />
                </FormControl>
               )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex gap-4">
          <Button disabled={submitDisabled!==undefined?submitDisabled:false} type="submit">{submitText?submitText:"Submit"}</Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomForm;
