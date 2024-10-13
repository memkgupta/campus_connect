import Contributions from "@/lib/models/contribution.model";
import Playlists from "@/lib/models/playlist.model";
import { Progress } from "@/lib/models/progress.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const POST = async(req:NextRequest)=>{
    const session = await getServerSession();
    if(!session){
        return Response.json({success:false,message:"Please Login First"},{status:401})
    }
    const _user= session.user;
    if(!_user){
        return Response.json({success:false,message:"Invalid Session Please Login again"},{status:401})
    }
 try {
    const user = await User.findOne({email:_user.email});

    const searchParams = req.nextUrl.searchParams;

    const resource = await Contributions.findById(searchParams.get('rid'));
    const playlist = await Playlists.findById(resource.playlist);
    if(!resource){
        return Response.json({success:false,message:"Bad request"},{status:401});
    }
const isTrackerExists = await Progress.findOne({user_id:user._id,resource_id:resource._id})
if(isTrackerExists){
    return Response.json({success:false,message:"Tracker already exists"},{status:400})
}
const tracker = await Progress.create({
resource_id:resource._id,
taken:[],
recent:playlist.lectures[0]._id,
user_id:user._id
});
return Response.json({success:true,tracker});
 } catch (error) {
    console.log(error)
    return Response.json({success:false,message:"Something went wrong"},{status:500})
 }
}