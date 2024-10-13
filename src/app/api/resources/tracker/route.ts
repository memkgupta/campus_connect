import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import { Progress } from "@/lib/models/progress.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async(req:NextRequest)=>{
    await connect();
    const searchParams = req.nextUrl.searchParams
    const session = await getServerSession();
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"User not logged_in"})
    }
    const user = await User.findOne({email:_user.email});
    const rid = searchParams.get('rid');
    if(user){
        const tracker = await Progress.findOne({user_id:user._id,resource_id:rid});
        if(tracker){
            return Response.json({success:true,tracker})
        }
        else{
            return Response.json({success:true,tracker:null})
        }


    }
return Response.json({success:false,message:"No tracker found"},{status:300})
}