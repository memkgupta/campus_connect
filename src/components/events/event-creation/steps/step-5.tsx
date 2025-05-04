import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Step5_OrganiserGuidelines() {
  const { register, control } = useFormContext();

  const organisers = useFieldArray({
    control,
    name: "organiserDetails.organisers",
  });

  const guidelines = useFieldArray({
    control,
    name: "organiserDetails.guidelines",
  });

  return (
    <div className="space-y-8">

      {/* Organisers */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xl">Organisers</Label>
          <Button type="button" onClick={() => organisers.append({ name: "", level: 1, position: "", image: "" })}>
            + Add Organiser
          </Button>
        </div>

        {organisers.fields.map((organiser, idx) => (
          <div key={organiser.id} className="border p-4 rounded-md space-y-2">
            <Input
              placeholder="Name"
              {...register(`organiserDetails.organisers.${idx}.name`)}
            />
            <Input
              placeholder="Position"
              {...register(`organiserDetails.organisers.${idx}.position`)}
            />
            <Input
              type="number"
              placeholder="Level"
              {...register(`organiserDetails.organisers.${idx}.level`, { valueAsNumber: true })}
            />
            <Input
              placeholder="Image URL"
              {...register(`organiserDetails.organisers.${idx}.image`)}
            />
          </div>
        ))}
      </div>

      {/* Guidelines */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xl">Guidelines</Label>
          <Button type="button" onClick={() => guidelines.append({ title: "", description: "" })}>
            + Add Guideline
          </Button>
        </div>

        {guidelines.fields.map((guide, idx) => (
          <div key={guide.id} className="border p-4 rounded-md space-y-2">
            <Input
              placeholder="Title"
              {...register(`organiserDetails.guidelines.${idx}.title`)}
            />
            <Textarea
              placeholder="Description"
              {...register(`organiserDetails.guidelines.${idx}.description`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
