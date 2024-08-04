import { projectCategories } from "@/constants";
import mongoose from "mongoose";
const projectCategoriesEnum = projectCategories.map(categ=>categ.value);
const projectSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    category:{type:String,enum:projectCategoriesEnum,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    banner:{type:String},
    images:[String],
    openForCollab:{type:Boolean,default:false},
    start:{type:Date,required:true},
    end:{type:Date},
    currently_working:{type:Boolean,default:true},
    tags:[String],
    live_link:{type:String},
    github:[{id:Number,title:String,link:String,required:true}],
    demo:{type:String},
    contributors:[{user_id:mongoose.Schema.Types.ObjectId,
        role:{type:String,enum:["lead","contributor"],required:true}}]
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