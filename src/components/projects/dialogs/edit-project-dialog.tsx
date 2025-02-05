import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ComboBox from "@/components/ui/combobox-custom";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
interface Field {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: string; id: string }[];
  subfields?: Field[];
}

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pid: string;
  fields: Field[];
  initialData: any;
  onSave: (data: any) => Promise<void>;
}

export default function EditDialog({
  isOpen,
  onClose,
  title,
  pid,
  fields,
  initialData,
  onSave,
}: EditDialogProps) {
  const form = useForm({
    defaultValues: initialData,
  });
  // const [selectedOption, setSelectedOption] = useState(null);
  // const [updates, setUpdates] = useState([]);
  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            {...form.register(field.name)}
            className="bg-gray-800 border-blue-900 text-white"
          />
        );
      case "textarea":
        return (
          <textarea
            {...form.register(field.name)}
            className="w-full p-2 rounded-md bg-gray-800 border-blue-900 text-white min-h-[100px]"
          />
        );
      case "date":
        return (
          <DatePicker
            selected={
              form.watch(field.name) ? new Date(form.watch(field.name)) : null
            }
            onChange={(date) => form.setValue(field.name, date)}
            className="w-full p-2 rounded-md bg-gray-800 border-blue-900 text-white"
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            {...form.register(field.name)}
            className="rounded border-blue-900"
          />
        );
      case "select":
        return (
          <select
            {...form.register(field.name)}
            className="w-full p-2 rounded-md bg-gray-800 border-blue-900 text-white"
          >
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          // <div className="z-40">
          // <ComboBox  label={field.name} options={field.options!!} stateSetter={setSelectedOption}/>

          // </div>
        );
      case "tags":
        return (
          <Input
            {...form.register(field.name)}
            placeholder="Enter comma-separated values"
            className="bg-gray-800 border-blue-900 text-white"
            onChange={(e) => {
              const values = e.target.value.split(",").map((v) => v.trim());
              form.setValue(field.name, values);
            }}
          />
        );
    
      default:
        return null;
    }
  };
  const submitEdit = async () => {
    const updates:{
      field:string,
      value:any,
      type:string
    }[] =[]
    const values = form.getValues();
   try {
    fields.forEach((field:Field,index:number)=>{
      updates.push({
        field:field.name,
        value:values[field.name],
        type:'edit'
      })
    })
    const res = await axios.put(
      `${BACKEND_URL}/projects/update`,
      {updates:updates},
      {
        params: {
          pid: pid,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("access-token")}`,
        },
      }
    );
    toast({
      title:'Project details updated Successfully',
      variant:"default"
    })
   } catch (error) {
    toast({
      title:"Some error occured",
      variant:"destructive"
    })
   }

  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={() => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">
                      {field.label}
                    </FormLabel>
                    <FormControl>{renderField(field)}</FormControl>
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 rounded-lg bg-blue-900 text-yellow-400 hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
