import connect from "@/lib/db"
import Club from "@/lib/models/club/club.model";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async(req:NextRequest)=>{
    const {searchParams} = req.nextUrl;
    try {
        await connect();
        const session = await getServerSession();
        
        const page = searchParams.get('page'); 
        const _user = session?.user;
        if(!_user){
            return Response.json({success:false,message:"Please Login first"},{status:403});
        }
        const user = await User.findOne({email:_user.email});
        if(!user){
            return Response.json({success:false,message:"Invalid Session"},{status:403});
        }
        const club = await Club.findOne({admin:user._id});
        if(!club){
            return Response.json({success:false,message:"Bad request"},{status:401});
        }
        const skip = (parseInt(page?.toString()||'1')-1)*10;
        const events = await Event.aggregate([
      
            {$match:{
                club:club._id
            }},
          
            
            {$lookup:{
                from:'event_registrations',
                localField:'_id',
                foreignField:'event',
                as:'registrations'
            }},
            {$project:{
                dateTime:1,
                name:1,
                brief_description:{$substr:["$description", 0, 100]},
                location:1,
                category:1,
                participantsFromOutsideAllowed:1,
                maxCapacity:1,
              
               
            }},
          
            {$skip:skip},
            {$limit:10}
        ])
        const totalResults = await Event.aggregate([
          
            {$match:{
                club:club._id
            }},
            {
                $count:'totalResults'
            }
        ])
        return Response.json({success:true,events:events,totalResults:totalResults[0]?.totalResults},{status:200});
    
    } catch (error) {
        return Response.json({success:false,message:"Some error occured",},{status:500});
    }
}