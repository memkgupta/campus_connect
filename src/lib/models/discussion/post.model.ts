import mongoose, { Schema } from "mongoose";
const postSchema  = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    attachment:{type:String,required:true},
    author: { type:Schema.Types.ObjectId, ref: 'User', required: true },
    channel: { type:Schema.Types.ObjectId, ref: 'Channel', required: true },
    tags: [String],
    parentPost:{type:Schema.Types.ObjectId,ref:'Post'},
},{
    timestamps:true
})
const Post = mongoose.models.Post || mongoose.model("Post",postSchema);
export default Post;