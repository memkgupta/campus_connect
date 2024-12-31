import { eventCategories } from "@/constants";
import mongoose,{mongo, Schema} from "mongoose";
const eventCategoriesEnum = eventCategories.map(categ=>categ.value);
const eventSchema = new Schema({
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isTeamEvent:{type:Boolean,required:true,default:false},
    isPublished:{type:Boolean,default:false},
    name: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    venue:{type:String,required:true},
    category: { type: String, enum: eventCategoriesEnum, required: true },
    banner:{type:String,required:true},
    participantsFromOutsideAllowed:{type:Boolean,required:true,default:false},
    isAcceptingVolunteerRegistrations:{type:Boolean,default:false},
    maxCapacity:{type:Number,required:true,default:100},
    creationTimestamp: { type: Date, default: Date.now },
    forms:[{
        label:{type:String,required:true},
        form:{type:mongoose.Schema.Types.ObjectId,ref:'Forms'},
        link:{type:String}
    }],
    registrationForm:{type:mongoose.Schema.Types.ObjectId,ref:'Forms'},
    club:{type:Schema.Types.ObjectId,ref:'Club'}
},{timestamps:true});
const eventRegistrationSchema =new Schema({
    event:{type:Schema.Types.ObjectId,ref:'Event',required:true},
    submission:{type:Schema.Types.ObjectId,ref:'FormSubmission'},
    user:{type:Schema.Types.ObjectId,ref:'User',required:true},
    isAccepted:{type:Boolean,default:false,required:true},
    applicationNote:{type:String,required:true},
    status:{type:String,default:'pending',enum:['pending','rejected','accepted']},
    registrationType:{type:String,enum:['volunteer','participant']},
    rsvp:{type:Schema.Types.ObjectId,ref:'RSVP',default:null},
    volunteerType:{type:String,enum:["general","technical"]},
    registrationTimestamp:{type:Date,default:Date.now},
    links:[{type:String,url:String}],
    resume:{type:String,default:null},
},{timestamps:true});
const rsvpSchema = new Schema({
event:{type:Schema.Types.ObjectId,ref:'Event',required:true},
isAccepted:{type:Boolean,default:false},
status:{type:String,default:'pending',enum:['pending','rejected','accepted']},
user:{type:Schema.Types.ObjectId,ref:'User',required:true},
eventRegistration:{type:Schema.Types.ObjectId,ref:'EventRegistration',required:true},

},{timestamps:true});
const passSchema = new Schema({
    event:{type:mongoose.Schema.Types.ObjectId,ref:'Event'},
    isValid:{type:Boolean,default:true},
    registration:{type:mongoose.Schema.Types.ObjectId,ref:'EventRegistration'}
});
export const Event = mongoose.models.Event||mongoose.model('Event',eventSchema);
export const EventRegistration = mongoose.models.EventRegistration||mongoose.model('EventRegistration',eventRegistrationSchema);
export const RSVP = mongoose.models.RSVP||mongoose.model('RSVP',rsvpSchema);