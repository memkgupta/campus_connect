import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Book } from 'lucide-react';

const subjectSchema = z.object({
  label: z.string().min(1, 'Subject name is required'),
  value: z.string().min(1, 'Subject value is required'),
  code:z.string().min(1, 'Subject value is required'),
  year:z.number().min(1).max(5),
  _id:z.string().optional(),
branch:z.string(),
   id:z.string()
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubjectFormData) => void;
  initialData?: {
    label: string;
    value: string;
    id: string;
    _id?:string;
    year:number;
    code?:string;
    branch?:string
  };
}

export function SubjectModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: SubjectModalProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: initialData 
  });

  const handleFormSubmit = (data: SubjectFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };
// console.log(initialData?._id)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            {initialData ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="label">Subject Name</Label>
            <Input
              id="label"
              {...register('label')}
              placeholder="e.g., Engineering Mathematics 1"
            />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              Subject Value
              <span className="text-sm text-muted-foreground ml-2">
                (used as identifier)
              </span>
            </Label>
            <Input
              id="value"
              {...register('value')}
              placeholder="e.g., maths-1"
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}