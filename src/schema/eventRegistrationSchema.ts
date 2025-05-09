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


export const teamSchema = z.object({
    minimumStrength:z.string().transform((v)=>parseInt(v)),
    diffCollegeTeamMembersAllowed:z.boolean().default(false).optional(),
    otherCriterias:z.string().array().default([]).optional(),
});
export const roundsSchema = z.object({
  

        title:z.string(),
        description:z.string(),
        isOnline:z.boolean(),
        isElimination:z.boolean().optional()

});
export const ticketingSchema = z.object({
    tickets:z.object(
        {
            title:z.string(),
            price:z.number(),
            description:z.string(),
        }
    ).array(),
    description:z.string().optional()
});
export const timeLineSchema = z.object({
    start:z.union([z.date(),z.string()]),
    end:z.union([z.date(),z.string()]),
    description:z.string()
})
export const prizeSchema = z.object({
    title:z.string(),
    description:z.string(),
    type:z.enum(["cash","swags","voucher","goods"]),
})
export const guestSchema = z.object({
    name:z.string(),
    image:z.string(),
    about:z.string(),
 
});
export const sponsorsSchema = z.object({
 
 
    name:z.string().min(10),
    description:z.string().min(10),
    level:z.number(),
    logo:z.string().min(10),
  

})
export const organiserSchema = z.object({
    name:z.string(),
    level:z.number(),
    position:z.string(),
    image:z.string()
})
export const guidelineSchema = z.object({
    title:z.string(),
    description:z.string(),

})
//step 1

// step 2
export const eventCreationBasicDetailsSchema = z.object({
    title:z.string().min(20).max(200),
    description:z.string().min(100).max(2000),
    venue:z.string(),
    startDate:z.date(),
    endDate:z.date(),
    isOnline:z.boolean(),
    participantsFromOutsideAllowed:z.boolean(),
    isTeamEvent:z.boolean(),
    category:z.union([z.enum(["entreprenurship","technical","cultural","social"]),z.string()]),
    isFree:z.boolean(),
    maxParticipants:z.number().optional(),
    registrationDeadline:z.date(),
    multipleRounds:z.boolean()
})
// step3
export const eventCreationEventStructureSchema = z.object({
    eligibility:z.string(),
    teamRequirements:teamSchema.optional(),
    roundsDetails:roundsSchema.array().optional(),
    speakers:guestSchema.array().optional(),
    timeline:timeLineSchema.array().optional(),
    judges:guestSchema.array().optional(),
    mentors:guestSchema.array().optional(),
    guests:guestSchema.array().optional()
})
//step4
export const eventCreationMonetoryDetailsSchema = z.object({
 
    ticketDetails:ticketingSchema.optional(),
    prizes:prizeSchema.array().optional(),
    sponsors:sponsorsSchema.array().optional(),
})
//step 5
export const eventCreationOrganiserDetailsSchema = z.object({
    organisers:organiserSchema.array(),
    guidelines:guidelineSchema.array(),
})

// complete event schema
export const eventCreationSchema = z.object({
    type:z.string(),
    basicDetails:eventCreationBasicDetailsSchema,
    eventStructure:eventCreationEventStructureSchema,
    monetaryDetails:eventCreationMonetoryDetailsSchema,
    organiserDetails:eventCreationOrganiserDetailsSchema
});