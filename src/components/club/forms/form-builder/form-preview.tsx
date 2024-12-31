'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { type Field } from '@/types/index';

interface FormPreviewProps {
  fields: Field[];
}

export function FormPreview({ fields }: FormPreviewProps) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        Add form fields to see the preview
      </div>
    );
  }

  return (
    <form className="space-y-6">
      {fields.map((field) => (
        <div key={field._id} className="space-y-2">
          <Label
            htmlFor={`preview-${field._id}`}
            className="flex items-center gap-1"
          >
            {field.fieldLabel}
            {field.isRequired && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </Label>

          {field.fieldType === 'text' && (
            <Input
              id={`preview-${field._id}`}
              placeholder={field.placeholder}
              required={field.isRequired}
              className="bg-slate-950"
            />
          )}

          {field.fieldType === 'textarea' && (
            <Textarea
              id={`preview-${field._id}`}
              placeholder={field.placeholder}
              required={field.isRequired}
              className="bg-slate-950"
            />
          )}

          {field.fieldType === 'number' && (
            <Input
              id={`preview-${field._id}`}
              type="number"
              placeholder={field.placeholder}
              required={field.isRequired}
              className="bg-slate-950"
            />
          )}

          {field.fieldType === 'date' && (
            <Input
              id={`preview-${field._id}`}
              type="date"
              required={field.isRequired}
              className="bg-slate-950"
            />
          )}

          {field.fieldType === 'select' && field.options && (
            <Select>
              <SelectTrigger className="bg-slate-950">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option, i) => (
                  <SelectItem key={i} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.fieldType === 'radio' && field.options && (
            <RadioGroup>
              {field.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${field._id}-${i}`} />
                  <Label htmlFor={`radio-${field._id}-${i}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {field.fieldType === 'checkbox' && (
            <div className="flex items-center space-x-2">
              <Checkbox id={`preview-${field._id}`} required={field.isRequired} />
              <Label htmlFor={`preview-${field._id}`}>{field.placeholder}</Label>
            </div>
          )}

          {field.fieldType === 'image' && (
            <Input
              id={`preview-${field._id}`}
              type="file"
              accept="image/*"
              required={field.isRequired}
              className="bg-slate-950"
            />
          )}
        </div>
      ))}
    </form>
  );
}