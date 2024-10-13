import Playlists from "@/lib/models/playlist.model";
import { Progress } from "@/lib/models/progress.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const PUT = async(req:NextRequest)=>{
    const session = await getServerSession();
    const {tracker_id,lectureId,taken}:{tracker_id:string,lectureId:string,taken:boolean} = await req.json();
   
    if(!session){
        return Response.json({success:false,message:"Please Login First"},{status:401})
    }
    const _user= session.user;
    if(!_user){
        return Response.json({success:false,message:"Invalid Session Please Login again"},{status:401})
    }
    try {
        // const user = await User.findOne({email:_user.email});
        const tracker = await Progress.findById(tracker_id).populate('resource_id');
        if(!tracker){
            return Response.json({success:false,message:"Bad request"},{status:401});
        }
        const playlist = await Playlists.findById(tracker.resource_id.playlist);
        
        if(taken){
            tracker.taken.push(lectureId)
            tracker.recent = lectureId
         
            
        }
        else{
tracker.taken = tracker.taken.filter((_t:any)=>_t._id!==lectureId)
        }
       await tracker.save();
       return Response.json({
        success:true,message:"Updated successfully"
       })
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500})
    }
}