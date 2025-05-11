'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useEventDashboard } from '@/context/dashboard/useContext';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { BACKEND_URL_V2 } from '@/constants';
import Cookies from 'js-cookie';
export default function AssignmentDialog({isEditing,initialData,handleUpdate}:{isEditing?:boolean,initialData?:any,handleUpdate?:(updated:any)=>void}) {
    const {data:event,setData} = useEventDashboard()!
    const {toast} = useToast()
    const[submitting,setSubmitting] = useState(true)
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState([
    { title: '', description: '', url: '' },
  ]);
  const [formData, setFormData] = useState<{
    title:string,
    leadOnly:boolean,
    description:string,
    submissionDeadline?:Date,
    form:string
  }>(initialData?initialData:{
    title: '',
    leadOnly: false,
    description: '',
    submissionDeadline: new Date(),
    form: '',
  });

  const updateLink = (index: number, key: string, value: string) => {
    const updated = [...links];
    updated[index][key as keyof {title:string,description:string,url:string}] = value;
    setLinks(updated);
  };

  const addLink = () => {
    setLinks([...links, { title: '', description: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
  };

  const handleSubmit = async() => {
    const fullData = { ...formData, links,event:event._id };
    try{
setSubmitting(true)
const req = await axios.post(`${BACKEND_URL_V2}/events/assignments/${isEditing?"update-assignment":"add-assignment"}`,
    fullData,
    {
        headers:{
            "Authorization":`Bearer ${Cookies.get("access-token")}`
        },
        params:{
            event_id:event._id,
            assignment_id:initialData?._id
        }
    }
);
const assignment = req.data.assignment;
toast({title:"Assignment added"})
if(isEditing && handleUpdate){
handleUpdate(assignment)
}
else{
    setData({
    ...event,assignments:[...event.assignments,assignment]
})
}


    }
    catch(error:any){
        console.log(error)
        const aError = error as AxiosError<any>
        const message = aError.response?.data.message || "Some error occured";
            toast({
                title:message,
                variant:"destructive"
            })
    }
    finally{
setSubmitting(false)
    }
   
  };
const forms = event.forms;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{isEditing?"Edit":"Add"} Assignment </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing?"Edit":"Add"} Assignment</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <div className="space-y-2">
          <Label>Assignment Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter title"
          />
        </div>

        {/* Lead Only */}
        <div className="flex items-center justify-between">
          <Label>Lead Only</Label>
          <Switch
            checked={formData.leadOnly}
            onCheckedChange={(val) => setFormData({ ...formData, leadOnly: val })}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description"
          />
        </div>

        {/* Deadline */}
      <div className="space-y-2">
  <Label>Submission Deadline</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-full justify-start text-left font-normal",
          !formData.submissionDeadline && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formData.submissionDeadline ? (
          format(formData.submissionDeadline, "PPP")
        ) : (
          <span>Pick a date</span>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={formData.submissionDeadline}
        onSelect={(date) =>
          setFormData({ ...formData, submissionDeadline: date ?? undefined })
        }
        initialFocus
      />
    </PopoverContent>
  </Popover>
</div>

        {/* Form (Select) */}
        <div className="space-y-2">
          <Label>Form</Label>
          <Select
         value={formData.form}
            onValueChange={(val) => setFormData({ ...formData, form: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a form" />
            </SelectTrigger>
            <SelectContent>
                {forms.map((form:any)=>(
                    <SelectItem value={form._id}>{form.formName}</SelectItem>
                ))}
             
            </SelectContent>
          </Select>
        </div>

        {/* Links Array */}
        <div className="space-y-2">
          <Label>Links</Label>
          {links.map((link, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-end">
              <Input
                placeholder="Title"
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value)}
              />
              <Input
                placeholder="Description"
                value={link.description}
                onChange={(e) => updateLink(index, 'description', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addLink}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Link
          </Button>
        </div>

        <Button onClick={handleSubmit} className="mt-4 w-full">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
