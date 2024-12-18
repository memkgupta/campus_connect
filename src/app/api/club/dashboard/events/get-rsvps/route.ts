import { Event, EventRegistration, RSVP } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url);
    const queryParams = {
        event_id : searchParams.get('event_id'),
        page:searchParams.get('page')
    } 
    const skip = (parseInt(queryParams?queryParams.page!!:'1')-1)*10
if(!queryParams.event_id){
    return Response.json({success:false,message:"Bad request"},{status:400})
}
    // const registrations = await EventRegistration.find({$and:[{event:queryParams.event_id},{isAccepted:false}]}).limit(10).skip(skip);
  try {
    const session = await getServerSession()
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"Login first"},{status:401});
    }
    const user = await User.findOne({email:_user.email});
    const event =await Event.findById(queryParams.event_id);
    if(!event.admin===user._id){
        return Response.json({success:false,message:"Unauthorized"},{status:403});
        
    }
    const rsvps = await RSVP.aggregate([
        {$match:{
            event:new mongoose.Types.ObjectId(queryParams.event_id),
            isAccepted:false,
        }},
        {
            $lookup:{
                from:'users',
                localField:'user',
                foreignField:'_id',
                as:'user'
            }
        },
        {$unwind:"$user"},
        {
            $project:{
                user:{
                    name:1,
                    profile:1,
                    username:1,
                },
                registrationType:1,
                resume:1,
                createdAt:1,
                applicationNote:1
            }
        },
        {$skip:skip},
        {$limit:10}
            ])
            const total = await RSVP.find({ event:queryParams.event_id,
                isAccepted:false}).countDocuments();
        return Response.json({success:true,rsvps:rsvps,total:total},{status:200});
        
  } catch (error) {
    console.log(error)
    return Response.json({success:false,message:"Some error occured"},{status:500})
  }
}