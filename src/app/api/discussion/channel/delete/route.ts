import Channel from "@/lib/models/discussion/channel.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server"

export const DELETE = async(req:NextRequest)=>{
    const id = req.nextUrl.searchParams.get('id')
    const session = await getServerSession();
    if (!session?.user){
        return Response.json({
            success:false,
            message:"Please login first"
        },{status:403});
        }
  try {
    const user = await User.findOne({email:session.user.email});
    if(!user){
        return Response.json({
            success:false,
            message:"Invalid Token"
        },{status:403});
    }
const channel = await Channel.findOne({_id:id,isActive:true});
if(!channel){
    return Response.json({success:false,message:"Not Found"},{status:404});
}
if(channel.admin!=user._id){
    return Response.json({success:false,message:"Not Authorized"},{status:403});
}
channel.isActive = false;
return Response.json({success:true,message:"Channel Deleted Successfully"},{status:200});
  } catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500});
  }
    
}