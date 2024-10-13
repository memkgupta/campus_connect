import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema({
    lectures:[
        {
         label:{type:String},
         videoUrl:{type:String},
         thumbnail:{type:String},

        }]
});

const Playlists = mongoose.models.Playlists||mongoose.model("Playlists",playlistSchema);
export default Playlists;