import mongoose, { Schema } from "mongoose";

const voteSchema = new mongoose.Schema({
    contributionId:{type:Schema.Types.ObjectId,ref:'Contribution'},
    userId:{type:Schema.Types.ObjectId,ref:'User'},
    voteType:{type:String,required:true,default:'up',enum:['up','down']}
},{timestamps:true});

const Vote = mongoose.models.Vote || mongoose.model('Vote',voteSchema);
export default Vote;