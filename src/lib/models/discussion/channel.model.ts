import mongoose, { Mongoose, Schema } from "mongoose";

const channelSchema = new Schema({
    name:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    rules:[{type:String,required:true}],
    admin:{type:mongoose.Schema.Types.ObjectId,ref:"User",unique:true},
    isActive:{type:Boolean,default:false},
    
},{
    timestamps:true
})

const Channel = mongoose.models.Channel || mongoose.model("Channel")

export default Channel;