'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { type Field } from '@/types/index';

interface FormFieldProps {
  field: Field;
  isActive: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<Field>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function FormField({
  field,
  isActive,
  onClick,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: FormFieldProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
        isActive
          ? 'bg-slate-800 border-yellow-400'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-yellow-400 capitalize">
          {field.fieldType} Field
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-yellow-400"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-yellow-400"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isActive && (
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-2">
            <Label htmlFor={`label-${field._id}`}>Field Label</Label>
            <Input
              id={`label-${field._id}`}
              value={field.fieldLabel}
              onChange={(e) => onUpdate({ fieldLabel: e.target.value })}
              className="bg-slate-950"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`placeholder-${field._id}`}>Placeholder</Label>
            <Input
              id={`placeholder-${field._id}`}
              value={field.placeholder}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="bg-slate-950"
            />
          </div>

          {(field.fieldType === 'select' || field.fieldType === 'radio') && (
            <div className="space-y-2">
              <Label>Options</Label>
              <Textarea
                value={field.options?.join('\n')}
                onChange={(e) =>
                  onUpdate({ options: e.target.value.split('\n').filter(Boolean) })
                }
                placeholder="Enter options (one per line)"
                className="bg-slate-950"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor={`required-${field._id}`}>Required Field</Label>
            <Switch
              id={`required-${field._id}`}
              checked={field.isRequired}
              onCheckedChange={(checked) => onUpdate({ isRequired: checked })}
            />
          </div>
        </div>
      )}
    </div>
  );
}