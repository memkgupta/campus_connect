import mongoose,{Schema} from "mongoose";

const pyqSchema = new Schema({
   branch:{type:String,required:true},
   code:{type:String,required:true},
   collegeYear:{type:String,required:true,enum:['1','2','3','4']},
   sessionYear:{type:String,required:true},
   file:{type:String,required:'true'},
   university:{type:String,required:'true'},
   contributor:{type:Schema.Types.ObjectId,ref:'User'}
})
const PYQ = mongoose.models.PYQ||mongoose.model('PYQ',pyqSchema);
export default PYQ;