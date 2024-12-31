import connect from "@/lib/db";
import Club from "@/lib/models/club/club.model";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";


export async function GET(req:Request){
await connect();
const session = await getServerSession();
const _user = session?.user;
if(!_user){
    return Response.json({success:false,message:"Please login first"},{status:403});
}
    try {
    const user = await User.findOne({email:_user.email});
    if(!user){
        return Response.json({success:false,message:"Invalid session"},{status:403});
    }
    const club = await Club.aggregate(
        [
            {$match:{
                admin:user._id
            },},
            {$lookup: {
                from: 'events',
               
              
                as: 'events',
                let:{club_id:'$_id'},
                pipeline:[
                  {$match:{
                    $expr:{$eq:['$club','$$club_id']}
                  }},
                  {$sort:{dateTime:1}},

                  {$limit:3},
                ]
              }},
            {
              $lookup:{
                from:'clubmembers',
                as:'members',
                localField:'_id',
                foreignField:'clubId',
                pipeline:[
                  {
                    $lookup:{
                      from:'users',
                      localField:'userId',
                      foreignField:'_id',
                      as:'details'
                    }
                  },
                  {$unwind:"$details"},
                  {$project:{
                    _id: 0,
              role: 1,
              status: 1,
              name: 'userDetails.name',
             
                  }}
                ]
              }
            },
            {
              $lookup:{
                from:'clubmessages',
                as:'messages',
                localField:'_id',
                foreignField:'club',
                pipeline:[
                  {$sort:{createdAt:1}},
                  {$limit:5}
                ]
              }
            },
              {
                $project: { 
                 clubDescription:1,
                  clubName:1,
                  contactPhone:1,
                  clubLogo:1,
                  events:{
                   _id:1,
                   name:1,
                   maxTeamSize:1,
                maxCapacity:1,
                isTeamEvent:1,
                isAcceptingVolunteerRegistrations:1,
                location:1,
                dateTime:1,
                category:1,
                venue:1,
                participantsFromOutsideAllowed:1
                  },
                  members:1,
                  messages:{
                    _id:1,
                    subject:1,
                    name:1
                  }
                }
              }
        ]
    )
    if(club.length==0){
      return Response.json({success:false,message:"You have no registered club"},{status:404});
    }
const totalEvents = await Event.find({admin:user._id,dateTime:{$lt:new Date()}}).countDocuments();
const upcomingEvents = await Event.find({admin:user._id,dateTime:{$gte:new Date()}}).countDocuments()
return Response.json({success:true,clubDetails:{...club[0],totalEvents,upcomingEvents}},{status:200})
   
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"},{status:500});
}
}