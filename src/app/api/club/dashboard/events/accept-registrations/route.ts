import connect from "@/lib/db";
import { Event, EventRegistration } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const POST = async(req:Request)=>{

    const {selections,event_id} = await req.json();
    try {
        await connect();
        const session = await getServerSession();
        const _user = session?.user;
        if(!_user){
            return Response.json({success:false,message:"Please login first"},{status:403});

        }
        const user = await User.findOne({email:_user.email});
        if(!user){
            return Response.json({success:false,message:"Inavalid Session"},{status:403});
        }
        const event = await Event.findById(event_id);
      
        if(!event||!event.admin.equals(user._id)){
            return Response.json({success:false,message:"Not authorized"},{status:403});
        }
        const registrations = await EventRegistration.updateMany({_id:{$in:selections}},{isAccepted:true,status:'accepted'});
        return Response.json({success:true,message:"Registrations accepted successfully"});
    } catch (error) {
        console.log(error)
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}