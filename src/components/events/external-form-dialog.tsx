"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil } from "lucide-react";

interface Form {
  _id: string;
  label: string;
  link: string;
  form: string;
}

interface FormsDialogProps {
  mode: 'add' | 'edit';
  initialData?: Form;
  onSubmit: (data: Omit<Form, '_id'>) => void;
  trigger?: React.ReactNode;
}

export function FormsDialog({ mode, initialData, onSubmit, trigger }: FormsDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    link: initialData?.link || '',
    form: initialData?.form || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className={mode === 'add' ? "bg-yellow-400 text-slate-950 hover:bg-yellow-500" : "border-yellow-400 text-yellow-400"}
            variant={mode === 'add' ? "default" : "outline"}
            size={mode === 'add' ? "default" : "sm"}
          >
            {mode === 'add' ? (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add External Form
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">
            {mode === 'add' ? 'Add New Form' : 'Edit Form'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-white">Label</Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter form label"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link" className="text-white">Link</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter form link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form" className="text-white">Form</Label>
              <Input
                id="form"
                name="form"
                value={formData.form}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter form details"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-500">
            {mode === 'add' ? 'Add Form' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}