import mongoose,{Schema} from "mongoose";

const collegeSchema = new Schema
({
name:{type:String,required:true},
emailDomain:{type:String,required:true},
university:{type:String,required:true}
});

const College = mongoose.models.College||mongoose.model('College',collegeSchema);
export default College;