import mongoose,{Schema} from "mongoose"

const notesSchema = new Schema({
    branch:{type:String,required:true},
    label:{type:String,required:true},
    code:{type:String,required:true},
    collegeYear:{type:String,required:true,enum:['1','2','3','4']},
    file:{type:String,required:'true'},
   university:{type:String,required:'true'},
   contributor:{type:Schema.Types.ObjectId,ref:'User'}
});

const NOTES = mongoose.models.NOTES||mongoose.model("NOTES",notesSchema);
export default NOTES;