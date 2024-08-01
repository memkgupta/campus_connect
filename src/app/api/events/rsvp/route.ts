import connect from "@/lib/db";
import { Event, EventRegistration, RSVP } from "@/lib/models/event.model";
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
        const {note,eventId,registration_id} = await req.json();
        const user = await User.findOne({email:_user.email});
        if(!user){
            return Response.json({success:false,message:"Invalid session"},{status:403})
        }
       
       
const registration = await EventRegistration.findById(registration_id);

  
        if(!registration){
            return Response.json({success:false,message:"Please register first"},{status:401});
        }

if(!registration.user.equals(user._id)){
    return Response.json({success:false,message:"Bad request"},{status:401});

}
const rsvp = await RSVP.create({
    event:registration.event,
    user:user._id,
    eventRegistration:registration._id,

})
return Response.json({success:true,message:"RSVP done successfully"},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}