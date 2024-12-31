'use server'
import youtubeService from "@/lib/ytservice";
import { YTLecture } from "@/types";
import axios from "axios";

export const extractLecturesFromYtPlaylist = async(url:string)=>{

let videoUrlSuffix = `https://www.youtube.com/embed/`
    const playListId = url.slice(38);
console.log(playListId);
const res = await youtubeService.playlistItems.list({
    part:['snippet','contentDetails'],
    playlistId:playListId,
    maxResults:100
});

const items = res.data.items;
if(!items) {
    throw new Error("Invalid playlist url");
}

const lectures:YTLecture[] = items!.map((item:any)=>({_id:item.id,thumbnail:item.snippet?.thumbnails?.standard?.url,label:item.snippet?.title,videoUrl:`${videoUrlSuffix}${item.contentDetails?.videoId}`,description:""}));
return lectures;
}
function extractYouTubeVideoID(url:string) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
export const extractVideoDetails = async(url:string)=>{
    let videoUrlSuffix = `https://www.youtube.com/embed/`
    try {
        const id = extractYouTubeVideoID(url);
        if(!id){
            throw new Error("Invalid video url")
        }
        const res = await youtubeService.videos.list({
            part:['snippet','contentDetails'],
            id:[id],
        });
        const item = res.data.items;
        if(!item){
            throw new Error("Invalid video url");
        }
       
        const lecture :YTLecture = {_id:item[0].id,description:"",label:item[0].snippet?.title,thumbnail:item[0].snippet?.thumbnails?.standard?.url,videoUrl:`${videoUrlSuffix}${item[0].id}`}
        return lecture;
    } catch (error:any) {
        console.log(error)
    //   throw new Error(error.message)  
    }
}