import connect from "@/lib/db"
import Club from "@/lib/models/club.model";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth/next";
export const POST = async(req:Request)=>{
    const {clubId,name,description,dateTime,location,category,creationTimestamp,banner,participantsFromOutsideAllowed} = await req.json();
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
        const club = await Club.findById(clubId);
        if(!club.admin.equals(user._id)){
            return Response.json({
                success:false,message:"Unauthorized"
            },{status:401});
        }
        const event = await Event.create(
            {
                name:name,
                admin:club.admin,
                banner:banner,
                description,
                dateTime,
                location,
                creationTimestamp,
                category,
                club:club._id,
                college:club.college,
                participantsFromOutsideAllowed
            }
        )
return Response.json({success:true,message:"Event created successfully",id:event._id});
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Some error occured please try again later"
        },{status:500})
    }
}