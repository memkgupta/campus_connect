    
import { z } from "zod";

export const fieldSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.string(),
    placeholder: z.string().optional(),
    options: z.array(z.object({
        value:z.string(),
        label:z.string()
    }).or(z.string())).optional(),
    required: z.boolean().optional(),
    lte:z.union([z.date(),z.number()]).optional(),
    gte:z.union([z.date(),z.number()]).optional(),
    defaultValue: z.union([
      z.string(),
      z.boolean(),
      z.array(z.string()),
      z.number(),
      z.date()
    ]).optional(), // Define valid types explicitly
  });
  

export type FormField = z.infer<typeof fieldSchema>;