import mongoose,{Schema} from "mongoose";

const clubSchema = new Schema({
    college:{type:Schema.Types.ObjectId,ref:'College',required:true},
    clubEmail:{type:String,required:true},
    clubDescription:{type:String,required:true},
    clubLogo:{type:String,required:true},
    contactPhone:{type:String,required:true},
    clubName:{type:String,required:true},
    isVerified:{type:Boolean,required:true,default:false}
});

const Club = mongoose.models.Club || mongoose.model('Club',clubSchema);
export default Club;