import connect from "@/lib/db"
import NOTES from "@/lib/models/notes.model";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

import User from "@/lib/models/user.model";
import Contributions from "@/lib/models/contribution.model";
import Playlist from "@/lib/models/playlist.model";
import { YTLecture } from "@/types";

export  const POST = async(request:Request)=>{
await connect();
const session = await getServerSession(authOptions);
const _user = session?.user;
try{
    const user = await User.findById(_user?._id);
    if(!user){
        return Response.json({
            success:false,
            message:"Not authorized"
        })
    }

    let {label,branch,code,collegeYear,university,type,file,sessionYear,playlist} = await request.json();
    const contribution =new Contributions({
        label:label,
        branch:branch,
        file:file,
        type:type,
        sessionYear:sessionYear,
        code:code,
        collegeYear:collegeYear,
        contributor:user._id,
        university:university,
    });

    if(playlist){
        playlist = playlist.map((i:YTLecture)=>({label:i.label,thumbnail:i.thumbnail,videoUrl:i.videoUrl}))
        if(type==='lectures'){
            const playlistDoc = await Playlist.create({
                contributionId:contribution._id,
                lectures:playlist
            });
            contribution.playlist = playlistDoc._id;
            contribution.thumbnail = playlist[0].thumbnail;
        }
    }

    await contribution.save();
    return Response.json({success:true,message:"File uploaded successfully"},{status:200});
}
catch(error:any){
    console.log(error)
return Response.json({success:false,message:error.message},{status:500})
}
}