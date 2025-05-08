import { z } from "zod";

export const registrationDetailsSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  phoneNo: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number is too long" }),
  collegeDetails: z.object({
    collegeName: z.string().min(1, { message: "College name is required" }),
    year: z
      .string()
      .transform((v) => parseInt(v))
      .refine((val) => !isNaN(val) && val >= 1 && val <= 4, {
        message: "Invalid year. Year must be between 1 and 4",
      }),
  }),
});
