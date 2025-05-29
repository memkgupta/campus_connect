'use client';

import { useState } from 'react';
import { FormField } from './form-field';
import { FieldControls } from './field-controls';
import { FormPreview } from './form-preview';
import { type Field } from '@/types';

export function FormBuilder({id,setFields,fields}:{id:string,setFields:(fields:Field[])=>void,fields:Field[]}) {
  // const [fields, setFields] = useState<Field[]>([]);
  const [activeField, setActiveField] = useState<number | null>(null);

  const addField = (type: Field['fieldType']) => {
    const newField: Field = {
      _id: Date.now(),
      fieldType:type,
      fieldLabel: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      isRequired: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
  
    setActiveField(fields.length);
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    setActiveField(null);
  };

  const moveField = (from: number, to: number) => {
    const newFields = [...fields];
    const [removed] = newFields.splice(from, 1);
    newFields.splice(to, 0, removed);
    setFields(newFields);
    setActiveField(to);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-yellow-400 mb-6">Form Elements</h2>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FormField
              key={field._id}
              field={field}
              isActive={activeField === index}
              onClick={() => setActiveField(index)}
              onUpdate={(updates) => updateField(index, updates)}
              onRemove={() => removeField(index)}
              onMoveUp={() => index > 0 && moveField(index, index - 1)}
              onMoveDown={() => index < fields.length - 1 && moveField(index, index + 1)}
            />
          ))}
          <FieldControls onAddField={addField} />
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-yellow-400 mb-6">Form Preview</h2>
        <FormPreview fields={fields} />
      </div>
    </div>
  );
}