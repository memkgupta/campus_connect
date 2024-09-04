import { projectCategories } from "@/constants";
import mongoose from "mongoose";
const projectCategoriesEnum = projectCategories.map(categ=>categ.value);
const projectSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    category:{type:String,enum:projectCategoriesEnum,},
    title:{type:String,required:true},
    description:{type:String,required:true},
    banner:{type:String},
    images:[String],
    openForCollab:{type:Boolean,default:false},
    start:{type:Date,required:true},
    end:{type:Date},
    documentation:String,
    demo:String,
    currently_working:{type:Boolean,default:true},
    tags:[String],
    status:String,
    technologiesUsed:[String],
    lead:String,
    live_link:{type:String},
    github:{type:String},
    
    contributors:[{username:String,
        name:String,
        linkedin:String,
        role:{type:String,required:true}}]
},{timestamps:true});

const projectLogsSchema = new mongoose.Schema({
    project_id:{type:mongoose.Schema.Types.ObjectId,ref:'Project',required:true},
    description:{type:String,required:true},
    
},{timestamps:true});

const collabRequestSchema = new mongoose.Schema({
    project_id:{type:mongoose.Schema.Types.ObjectId,ref:'Project',required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    skills:[String],
    isAccepted:{type:Boolean,default:false},
    motive:{type:String,required:true},
    contact_no:{type:String},
    contact_email:{type:String}
},{timestamps:true})

export const Project = mongoose.models.Project || mongoose.model("Project",projectSchema);
export const ProjectLog = mongoose.models.ProjectLog || mongoose.model("ProjectLog",projectLogsSchema)
export const CollabRequest = mongoose.models.CollabRequest || mongoose.model("CollabRequest",collabRequestSchema)