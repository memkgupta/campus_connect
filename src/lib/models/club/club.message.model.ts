import mongoose, { Schema } from "mongoose";

const clubMessageSchema = new Schema({
    club:{type:mongoose.Schema.Types.ObjectId,ref:'Club'},
    message:{type:String,required:true},
    email:{type:String,required:true},
    subject:{type:String,required:true},
    organisation:{type:String},
    name:{type:String,required:true}
},{timestamps:true})

const ClubMessage = mongoose.models.ClubMessage || mongoose.model('ClubMessage',clubMessageSchema);
export default ClubMessage