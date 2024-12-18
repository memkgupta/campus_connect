import connect from "@/lib/db"
import Channel from "@/lib/models/discussion/channel.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

export const PUT = async(req:Request)=>{
    await connect();
    // const id = req.
    const {id,name,logo,banner,description,rules} = await req.json();
const session = await getServerSession();
if(!session?.user){
    return Response.json({success:false, message:"Please login first"},{status:403})
}try {
    
const user = await User.findOne({email:session.user.email});
const channel = await Channel.findOne({_id:id,isActive:true});
if(channel.admin!=user._id){
    return Response.json({success:false, message:"Not Authorised"},{status:403});
}
if(name){
    channel.name  = name;
}
if(logo){
    channel.logo =logo;
}
if(banner){
    channel.banner = banner;
}
if(description){
    channel.description = description;
}
if(rules){
    channel.description = rules;
}
await channel.save();
return Response.json({success:true,message:"Channel Updated SuccessFully"});
} catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500});
}
}