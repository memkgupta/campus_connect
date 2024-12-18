import mongoose, { Schema } from "mongoose";
const postVote = new Schema({
    postId:{type:Schema.Types.ObjectId,ref:'Post'},
    voteType:{type:String,required:true,enum:['up','down']},
    userId:{type:Schema.Types.ObjectId,required:true,ref:'User'},
},{timestamps:true});

const PostVote = mongoose.models.PostVote || mongoose.model("PostVote",postVote);
export default PostVote;