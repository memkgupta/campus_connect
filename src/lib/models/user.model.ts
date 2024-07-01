import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    email:{type:String,required:true,unique:true,match:/^[^\s@]+@glbitm\.ac\.in$/i},
    username:{type:String,required:true,unique:true},
    otp:{type:String},
    access_token:{type:String},
    refresh_token:{type:String},
    role:{type:String,enum:["ADMIN","CONTRIBUTOR","USER","CLUB"],default:'USER'}
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User',userSchema);
export default User;