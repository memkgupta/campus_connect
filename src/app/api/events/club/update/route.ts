import connect from "@/lib/db"
import Club from "@/lib/models/club.model";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth/next";
export const PUT = async(req:Request)=>{
    const { searchParams } = new URL(req.url);
    const queryParams = {
      id: searchParams.get('id'),
    };
    const {clubId,name,description,dateTime,location,category,banner,isAcceptingVolunteerRegistrations,isTeamEvent,maxTeamSize,maxCapacity} = await req.json();
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
        const event = await Event.findById(queryParams.id);
        if(!event){
            return Response.json({success:false,message:"No such event exists"},{status:400});
        }
        if(!event.admin.equals(user._id)){
            return Response.json({
                success:false,message:"Unauthorized"
            },{status:401});
        }
      
        
        if(name){
            event.name = name;
        
        }
        if(description){
            event.description = description
        }
        if(dateTime){
            event.dateTime = dateTime
        }
        if(location){
            event.location = location;
        }
        if(banner){
            event.banner = banner;
        }
        if(category){
            event.category = category;
        }
        // isAcceptingVolunteerRegistrations,isTeamEvent,maxTeamSize,maxCapacity
        if(isAcceptingVolunteerRegistrations){
            event.isAcceptingVolunteerRegistrations = isAcceptingVolunteerRegistrations
        }
        if(isTeamEvent){
            event.isTeamEvent = isTeamEvent;
        }
        if(maxTeamSize){
            event.maxTeamSize = maxTeamSize
        }
        await event.save();
return Response.json({success:true,message:"Event updated successfully"});
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Some error occured please try again later"
        },{status:500})
    }
}