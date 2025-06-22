'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Book } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const subjectSchema = z.object({
  label: z.string().min(1, 'Subject name is required'),
  value: z.string().min(1, 'Subject value is required'),
  code: z.string().min(1, 'Subject code is required'),
  year: z.coerce.number().min(1, 'Year must be between 1 and 5').max(5),
  _id: z.string().optional(),
  branch: z.string().min(1, 'Branch is required'),
  id: z.string().optional(), // Fixed: removed conflicting validation
})

type SubjectFormData = z.infer<typeof subjectSchema>

interface SubjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SubjectFormData) => void
  initialData?: Partial<SubjectFormData>
}

export function SubjectModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: SubjectModalProps) {
  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      label: initialData?.label ?? '',
      value: initialData?.value ?? '',
      code: initialData?.code ?? '',
      year: initialData?.year ?? 1,
      branch: initialData?.branch ?? '',
      id: initialData?.id ?? '',
      _id: initialData?._id,
    },
  })

  const handleFormSubmit = (data: z.infer<typeof subjectSchema>) => {
    console.log('✅ Form Submitted:', data)
    onSubmit(data)
    form.reset()
  
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-neutral-900 text-white border-neutral-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            {initialData ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5 pt-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Engineering Mathematics 1"
                      className="bg-neutral-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject Value{' '}
                    <span className="text-sm text-muted-foreground">(identifier)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., maths-1"
                      className="bg-neutral-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., MATH101"
                      className="bg-neutral-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === '' ? '' : Number(value))
                      }}
                      placeholder="e.g., 1"
                      min="1"
                      max="5"
                      className="bg-neutral-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., CSE"
                      className="bg-neutral-800 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional: Add ID field if needed */}
            {initialData?.id && (
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Subject ID"
                        className="bg-neutral-800 text-white"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
        
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="bg-neutral-800 text-white border-neutral-600 hover:bg-neutral-700"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {initialData ? 'Update' : 'Add'} Subject
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}