import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    otp:{type:String},
    verified:{type:Boolean,required:true,default:false},
    otpExpiry:{type:Date},
    password:{type:String,required:true},
    
    refresh_token:{type:String},
    role:{type:String,enum:["ADMIN","CONTRIBUTOR","USER","CLUB"],default:'USER'},
    bio:{type:String},
    interests:[String],
    
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User',userSchema);
export default User;