"use client";

import { FormCard } from "./form-card";

interface FormCardProps {
    _id: string;
    formName: string;
    responseCount: number;
    enabled:boolean;
  }
  
export function FormGrid({forms}:{forms:FormCardProps[]}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <FormCard key={form._id} {...form} />
      ))}
    </div>
  );
}