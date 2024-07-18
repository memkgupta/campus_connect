import connect from "@/lib/db"
import Club from "@/lib/models/club.model";
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
   
    const event = await Event.aggregate([
        {
            $match:{_id:id},
           
    },
    {$lookup:{
        from:'clubs',
        localField:'club',
        foreignField:'_id',
        as:'clubDetails'
    }},
    {
$lookup:{
    from:'event_registrations',
    let:{eventId:"$_id"},
    pipeline:[
        {
            $match:{
                $expr:{
                   $and:[
                    {$eq:['$event','$$_id']},
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
                $cond:{if:{$gte:['$totalRegistrations','$$maxCapacity']},then:false,else:true}
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
    if(!event||event.length>0){
        return Response.json({success:false,message:"No such event exists"},{status:400});
    }
   
    return Response.json({success:true,data:event[0]});
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"})
}
}