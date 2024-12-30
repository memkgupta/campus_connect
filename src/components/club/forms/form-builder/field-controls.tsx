'use client';

import { Button } from '@/components/ui/button';
import {
  Type,
  AlignLeft,
  Hash,
  Calendar,
  List,
  CheckSquare,
  Circle,
  Image as ImageIcon,
} from 'lucide-react';
import { type Field } from '@/types/index';

const FIELD_TYPES = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'textarea', icon: AlignLeft, label: 'Text Area' },
  { type: 'number', icon: Hash, label: 'Number' },
  { type: 'date', icon: Calendar, label: 'Date' },
  { type: 'select', icon: List, label: 'Select' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { type: 'radio', icon: Circle, label: 'Radio' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
] as const;

interface FieldControlsProps {
  onAddField: (type: Field['fieldType']) => void;
}

export function FieldControls({ onAddField }: FieldControlsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {FIELD_TYPES.map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 hover:text-yellow-400 hover:border-yellow-400"
          onClick={() => onAddField(type)}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}