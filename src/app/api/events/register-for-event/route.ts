import connect from "@/lib/db";
import { Event, EventRegistration } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth"

export const POST = async(req:Request)=>{
    await connect();
    const session = await getServerSession();
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"Login first"},{status:401})
    }
    try {
        const {note,eventId,registrationType,volunteerType,links,resume} = await req.json();
        const user = await User.findOne({email:_user.email});
        if(!user){
            return Response.json({success:false,message:"Invalid session"},{status:403})
        }
        const event = await Event.findById(eventId);
        if(!event){
            return Response.json({success:false,message:"Event does not exist"},{status:404});
        }
        if(!event.isAcceptingVolunteerRegistrations&&registrationType==="volunteer"){
            return Response.json({success:false,message:"Currently not accepting volunteers"},{status:400});
        }
        if(event.category=="hackathon"){
            return Response.json({success:false,message:"Bad request"},{status:403})
        }
let registration ;
if(registrationType=="participant"){
  registration  = await EventRegistration.create({
        event:event._id,
        user:user._id,
        isAccepted:false,
        applicationNote:note,
        registrationType:registrationType,
        links:links,
  
        rsvp:null,
        registrationTimeStamp:new Date()
          })
}
 if(registrationType=="volunteer"){
    registration  = await EventRegistration.create({
        event:event._id,
        user:user._id,
        isAccepted:false,
        applicationNote:note,
        registrationType:registrationType,
        links:links,
        resume:resume,
        rsvp:null,
        registrationTimeStamp:new Date()
          })
 }       
        if(registration){
            return Response.json({success:true,message:"Your request of registration has been sent",id:registration._id},{status:200});
        }
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}