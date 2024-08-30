import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    contributionId:{type:mongoose.Schema.Types.ObjectId,ref:'Contribution'},
    lectures:[
        {
         label:{type:String},
         videoUrl:{type:String},
         thumbnail:{type:String},

        }]
});

const Playlist = mongoose.models.Playlist||mongoose.model("Playlist",playlistSchema);
export default Playlist;