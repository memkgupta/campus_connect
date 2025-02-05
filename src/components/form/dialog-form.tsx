import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
type FieldType = 'text' | 'number' | 'email' | 'password';

// Define the field configuration interface
export interface FieldConfig {
  name: string; // Unique identifier for the field
  label: string; // Label displayed above the input
  type: FieldType; // Input type
  placeholder?: string; // Placeholder text (optional)
  validation: z.ZodType<any>; // Validation schema using Zod
}
// Define the props for the DynamicDialogForm
interface DialogFormProps {
  fields: FieldConfig[]; // Array of field configurations
  onSubmit: (data: Record<string, any>) => Promise<boolean>; // Callback for form submission
  triggerText: string; // Text for the dialog trigger button
}

export const DialogForm: React.FC<DialogFormProps> = ({
  fields,
  onSubmit,
  triggerText,
}) => {
  // Generate the Zod schema dynamically based on the field configurations
  const schema = z.object(
    fields.reduce((acc, field) => {
      acc[field.name] = field.validation;
      return acc;
    }, {} as Record<string, z.ZodType<any>>)
  );

  // Initialize react-hook-form with the generated schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
const[open,setOpen]=useState(false);
  // Handle form submission
  const handleFormSubmit: SubmitHandler<z.infer<typeof schema>> = async(data) => {
    if(await onSubmit(data)){
        reset(); 
        setOpen(false);
    } // Pass the form data to the parent component
// Reset the form after submission
  };

  return (
    <Dialog open={open} onOpenChange={(o)=>setOpen(o)}>
      {/* Trigger button to open the dialog */}
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dynamic Form</DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name)}
                className="w-full"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{`${errors[field.name]?.message}`}</p>
              )}
            </div>
          ))}

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};