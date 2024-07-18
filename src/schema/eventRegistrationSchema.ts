import { z } from "zod";

export const eventRegistrationSchema = z.object({
    clubId:z.string(),
    name:z.string().min(20).max(200),
    description:z.string().min(200).max(1000),
    dateTime:z.date(),
    location:z.string(),
    category:z.string(),
    creationTimeStamp:z.date(),
    participantsFromOutsideAllowed:z.boolean(),
});