import connect from "@/lib/db"
import Club from "@/lib/models/club.model";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth/next";

export const GET = async(req:Request,{params}:{params:{id:string}})=>
{
const {id} = params;
const session = await getServerSession();
if(!session){
    return Response.redirect('/auth/sign-in');
}
const _user = session.user;
await connect();
try {
    const user = await User.findOne({email:_user.email});
    if(!user){
        return Response.json({success:false,message:"Session Invalid Please login again"},{status:401});
    }
   
    const event = await Event.findById(id);
    if(!event){
        return Response.json({success:false,message:"No such event exists"},{status:400});
    }
    if(!event.admin.equals(user._id)){
        return Response.json({
            success:false,message:"Unauthorized"
        },{status:401});
    }
    return Response.json({success:true,data:event});
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"})
}
}