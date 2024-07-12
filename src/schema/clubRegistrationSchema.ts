import {z} from "zod"
export const clubRegistrationSchema = 
z.object({

clubEmail:z.string().email({message:"Invalid email address"}),
clubName:z.string(),
clubDescription:z.string(),
contactPhone:z.string().regex(/^[0-9]{10}$/, "Contact number must be 10 digits"),

})