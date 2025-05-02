import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Step4_MonetaryDetails() {
  const { register, control, setValue, watch } = useFormContext();

  const tickets = useFieldArray({ control, name: "monetaryDetails.ticketDetails.tickets" });
  const prizes = useFieldArray({ control, name: "monetaryDetails.prizes" });
  const sponsors = useFieldArray({ control, name: "monetaryDetails.sponsors.sponsors" });
    const isFree = watch("eventStructure.isFree")
    const type = watch("type.type")
  return (
    <div className="space-y-6">
      {/* Ticketing Details */}
   { !isFree&&  <div className="space-y-2">
        <Label>Ticket Description (optional)</Label>
        <Textarea {...register("monetaryDetails.ticketDetails.description")} placeholder="Info about tickets..." />

        <div className="flex justify-between items-center">
          <Label>Tickets</Label>
          <Button type="button" onClick={() => tickets.append({ title: "", price: 0, description: "" })}>
            + Add Ticket
          </Button>
        </div>

        {tickets.fields.map((ticket, idx) => (
          <div key={ticket.id} className="border p-4 rounded-md space-y-2">
            <Input placeholder="Title" {...register(`monetaryDetails.ticketDetails.tickets.${idx}.title`)} />
            <Input
              type="number"
              placeholder="Price"
              {...register(`monetaryDetails.ticketDetails.tickets.${idx}.price`, { valueAsNumber: true })}
            />
            <Textarea
              placeholder="Description"
              {...register(`monetaryDetails.ticketDetails.tickets.${idx}.description`)}
            />
          </div>
        ))}
      </div>
}
      {/* Prizes */}
    {(type=="hackathon" || type=="contest") &&  <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Prizes</Label>
          <Button type="button" onClick={() => prizes.append({ title: "", description: "", type: "cash" })}>
            + Add Prize
          </Button>
        </div>

        {prizes.fields.map((prize, idx) => (
          <div key={prize.id} className="border p-4 rounded-md space-y-2">
            <Input placeholder="Title" {...register(`monetaryDetails.prizes.${idx}.title`)} />
            <Textarea placeholder="Description" {...register(`monetaryDetails.prizes.${idx}.description`)} />
            <Select
              onValueChange={(val) => setValue(`monetaryDetails.prizes.${idx}.type`, val)}
              defaultValue="cash"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Prize Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="swags">Swags</SelectItem>
                <SelectItem value="voucher">Voucher</SelectItem>
                <SelectItem value="goods">Goods</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>}

      {/* Sponsors */}
      <div className="space-y-2">
        <Label>Sponsors</Label>

        {/* Levels (you only had one object here, so keeping it simple) */}
        <Input placeholder="Sponsorship Title" {...register("monetaryDetails.sponsors.levels.title")} />
        <Input
          type="number"
          placeholder="Level Number"
          {...register("monetaryDetails.sponsors.levels.level", { valueAsNumber: true })}
        />

        <div className="flex justify-between items-center">
          <Label>Sponsor List</Label>
          <Button type="button" onClick={() => sponsors.append({ name: "", description: "", level: 1, logo: "" })}>
            + Add Sponsor
          </Button>
        </div>

        {sponsors.fields.map((s, idx) => (
          <div key={s.id} className="border p-4 rounded-md space-y-2">
            <Input placeholder="Sponsor Name" {...register(`monetaryDetails.sponsors.sponsors.${idx}.name`)} />
            <Textarea
              placeholder="Sponsor Description"
              {...register(`monetaryDetails.sponsors.sponsors.${idx}.description`)}
            />
            <Input
              placeholder="Logo URL"
              {...register(`monetaryDetails.sponsors.sponsors.${idx}.logo`)}
            />
            <Input
              type="number"
              placeholder="Sponsor Level"
              {...register(`monetaryDetails.sponsors.sponsors.${idx}.level`, { valueAsNumber: true })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
