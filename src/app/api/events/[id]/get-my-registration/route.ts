import connect from "@/lib/db"
import { EventRegistration } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const GET = async(req:Request,{params}:{params:{id:string}})=>{
    if(!params||!params.id){
        return Response.json({success:false,message:"Internal server error"},{status:500})
    }
await connect();
try {
    const session = await getServerSession();
    const _user = session?.user;
    if(!session||!_user){
        return Response.json({success:false,message:"Please log in first"},{status:403});
    }
    const user = await User.findOne({email:_user.email});
    if(!user){
        return Response.json({success:false,message:"Invalid session"},{status:403});
    }
    const registration = await EventRegistration.aggregate([
        {$match:{
            event:new mongoose.Types.ObjectId(params.id),
            user:user._id,
        }},
        {
            $lookup:{
                from:"events",
                as:"event",
                foreignField:"_id",
                localField:"event"
            }
        },
        {
            $lookup:{
                from:"rsvps",
                localField:"rsvp",
                foreignField:"_id",
                as:"rsvp"
            }
        },
        {$project:{
            event:{
           name:1,
           description:1,
           dateTime:1,
           location:1,
           venue:1,
           category:1,
           banner:1      
            },
            isAccepted:1,
            status:1,
            createdAt:1,
            rsvp:{
                isAccepted:1,
                status:1,
            }
        }}
    ]);
    if(registration.length===0){
        return Response.json({success:false,message:"You have not registered for the event"})
    }
    return Response.json({success:true,registration:registration[0]},{status:200});

} catch (error) {
    console.log(error);
    return Response.json({success:true,message:"Some error occured"},{status:500});
}
}