import mongoose, { Schema } from "mongoose";

const clubRecruitmentSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    isApplicationsOpen:{type:Boolean,required:true,default:true},
    teams:[{
        type:String
    }],
    deadline:{type:Date,required:true},
    poster:{type:String,required:true},
    form:{type:mongoose.Schema.Types.ObjectId,ref:'Form'}
})

const ClubRecruitment = mongoose.models.ClubRecruitment || mongoose.model("ClubRecruitment",clubRecruitmentSchema);

export default ClubRecruitment
