import mongoose,{Schema} from "mongoose";

const subjectSchema = new Schema({
    code:{type:String,required:true},
    year:{type:String,required:true,enum:['1','2','3','4']},
    label:{type:String,required:true},
    branch:{type:String,required:true},

},{timestamps:true});

const Subject = mongoose.models.Subject||mongoose.model('Subject',subjectSchema);

export default Subject;

