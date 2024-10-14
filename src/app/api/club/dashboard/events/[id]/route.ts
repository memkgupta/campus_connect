import connect from "@/lib/db"
import Club from "@/lib/models/club/club.model";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
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
    const eventData = await Event.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(id)},
           
    },
    {$lookup:{
        from:'clubs',
        localField:'club',
        foreignField:'_id',
        as:'clubDetails'
    }},
    {$unwind:"$clubDetails"},
    {
$lookup:{
    from:'event_registrations',
    let:{eventId:"$_id"},
    pipeline:[
        {
            $match:{
                $expr:{
                   $and:[
                    {$eq:['$event','$_id']},
                    {$eq:['$isAccepted',true]}
                   ] 
                }
            }
        }
    ],
    as:'registrations'
}
    },
    {
        $project:{
            name:1,
            description:1,
            dateTime:1,
            location:1,
            category:1,
            banner:1,
            totalRegistrations:{$size:'$registrations'},
            isFull:{
                $cond:{if:{$gte:['$totalRegistrations','$maxCapacity']},then:true,else:false}
            },
            
            maxCapacity:1,
            clubDetails:{
clubLogo:1,
_id:1,
clubName:1
            }
        }
    }
    ]);
    return Response.json({success:true,data:eventData[0]});
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"},{status:500})
}
}