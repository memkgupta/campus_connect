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


const teamSchema = z.object({
    minimumStrength:z.number(),
    diffCollegeTeamMembersAllowed:z.boolean(),
    otherCriterias:z.string().array(),
});
const roundsSchema = z.object({
    noOfRounds:z.number(),
    rounds:z.object({
        title:z.string(),
        description:z.string(),
        isOnline:z.boolean(),
        isElimination:z.boolean().optional()
    }).array()
});
const ticketingSchema = z.object({
    tickets:z.object(
        {
            title:z.string(),
            price:z.number(),
            description:z.string(),
        }
    ).array(),
    description:z.string().optional()
});
const timeLineSchema = z.object({
    start:z.date(),
    end:z.date(),
    description:z.string()
})
const prizeSchema = z.object({
    title:z.string(),
    description:z.string(),
    type:z.enum(["cash","swags","voucher","goods"]),
})
const guestSchema = z.object({
    name:z.string(),
    image:z.string(),
    about:z.string(),
    category:z.enum(["speaker","mentor","chief-guest","judge"])
});
const sponsorsSchema = z.object({
    levels:z.object(
        {title:z.string(),level:z.number()}
    ),
    sponsors:z.object({
        name:z.string(),
    description:z.string(),
    level:z.number(),
    logo:z.string(),
  
    }).array()
})
const organiserSchema = z.object({
    name:z.string(),
    level:z.number(),
    position:z.string(),
    image:z.string()
})
const guidelineSchema = z.object({
    title:z.string(),
    description:z.string(),

})
//step 1
export const eventCreationEventTypeSchema=z.object({
    type:z.enum(["hackathon","session","workshop","contest","campaign","other","ground-work"])
})
// step 2
export const eventCreationBasicDetailsSchema = z.object({
    title:z.string().min(20).max(200),
    description:z.string().min(100).max(2000),
    venue:z.string(),
    startDate:z.date(),
    endDate:z.date(),
    isOnline:z.boolean(),
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
    roundsDetails:roundsSchema.optional(),
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
    sponsors:sponsorsSchema,
})
//step 5
export const eventCreationOrganiserDetailsSchema = z.object({
    organisers:organiserSchema.array(),
    guidelines:guidelineSchema.array(),
})

// complete event schema
export const eventCreationSchema = z.object({
    type:eventCreationEventTypeSchema,
    basicDetails:eventCreationBasicDetailsSchema,
    eventStructure:eventCreationEventStructureSchema,
    monetaryDetails:eventCreationMonetoryDetailsSchema,
    organiserDetails:eventCreationOrganiserDetailsSchema
});