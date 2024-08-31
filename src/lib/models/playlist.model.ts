import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema({
    lectures:[
        {
         label:{type:String},
         videoUrl:{type:String},
         thumbnail:{type:String},

        }]
});

const Playlists = mongoose.models.Playlist||mongoose.model("Playlist",playlistSchema);
export default Playlists;