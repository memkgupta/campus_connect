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
import { ImageEditor as ImageSelector } from '@/components/imageSelector/image-selector';
import { useState } from 'react';
interface FormFieldInputProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function FormFieldInput({ field, value, onChange, error }: FormFieldInputProps) {
  const[preview,setPreview] = useState<any>(null);
  return (
    <div className="space-y-2">
      <Label
        htmlFor={`field-${field._id}`}
        className="flex items-center gap-1"
      >
        {field.fieldLabel}
        {field.isRequired && (
          <span className="text-red-500 text-sm">*</span>
        )}
      </Label>

      {field.fieldType === 'text' && (
        <Input
          id={`field-${field._id}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`bg-slate-950 ${error ? 'border-red-500' : ''}`}
        />
      )}

      {field.fieldType === 'textarea' && (
        <Textarea
          id={`field-${field._id}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`bg-slate-950 ${error ? 'border-red-500' : ''}`}
        />
      )}

      {field.fieldType === 'number' && (
        <Input
          id={`field-${field._id}`}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={field.placeholder}
          className={`bg-slate-950 ${error ? 'border-red-500' : ''}`}
        />
      )}

      {field.fieldType === 'date' && (
        <Input
          id={`field-${field._id}`}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-slate-950 ${error ? 'border-red-500' : ''}`}
        />
      )}

      {field.fieldType === 'select' && field.options && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`bg-slate-950 ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.fieldType === 'radio' && field.options && (
        <RadioGroup value={value} onValueChange={onChange}>
          {field.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`radio-${field._id}-${option}`} />
              <Label htmlFor={`radio-${field._id}-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {field.fieldType === 'checkbox' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`field-${field._id}`}
            checked={value || false}
            onCheckedChange={onChange}
          />
          <Label htmlFor={`field-${field._id}`}>{field.placeholder}</Label>
        </div>
      )}

      {field.fieldType === 'image' && (
        // <Input
        //   id={`field-${field._id}`}
        //   type="file"
        //   accept="image/*"
        //   onChange={(e) => onChange(e.target.files?.[0])}
        //   className={`bg-slate-950 ${error ? 'border-red-500' : ''}`}
        // />
  <ImageSelector  preview={preview} isRound={false} type="image" title={``} setImage={(url)=>{setPreview(url);onChange(url)}}/>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}