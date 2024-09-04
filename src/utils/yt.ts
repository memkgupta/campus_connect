'use server'
import youtubeService from "@/lib/ytservice";
import { YTLecture } from "@/types";
import axios from "axios";

export const extractLecturesFromYtPlaylist = async(url:string)=>{

let videoUrlSuffix = `https://www.youtube.com/embed/`
    const playListId = url.slice(38);

const res = await youtubeService.playlistItems.list({
    part:['snippet','contentDetails'],
    playlistId:playListId,
    maxResults:100
});

const items = res.data.items;
if(!items) {
    throw new Error("Invalid playlist url");
}

const lectures:YTLecture[] = items!.map((item:any)=>({_id:item.id,thumbnail:item.snippet?.thumbnails?.standard?.url,label:item.snippet?.title,videoUrl:`${videoUrlSuffix}${item.contentDetails?.videoId}`}));
return lectures;
}