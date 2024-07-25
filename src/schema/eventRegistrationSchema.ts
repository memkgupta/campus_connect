import { z } from "zod";

export const eventRegistrationSchema = z.object({
    // clubId:z.string(),
    name:z.string().min(20).max(200),
    description:z.string().min(200).max(1000),
    maxCapacity:z.coerce.number(),
    location:z.string(),
    // category:z.string(),
    // creationTimeStamp:z.date(),
    // participantsFromOutsideAllowed:z.boolean(),
    venueAddress:z.string().min(20)
});
