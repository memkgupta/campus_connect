import connect from "@/lib/db"
import Club from "@/lib/models/club.model";
import { Event, EventRegistration } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";

export const GET = async(req:Request,{params}:{params:{id:string}})=>
{
const {id} = params;
const session = await getServerSession();

const _user = session?.user;
await connect();
try {
   
   
    const event = await Event.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(id)},
           
    },
    {$lookup:{
        from:'clubs',
        localField:'club',
        foreignField:'_id',
        as:'clubDetails'
    }},
    {$unwind:{
        path:'$clubDetails'
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
    if(!event||event.length<1){
        return Response.json({success:false,message:"No such event exists"},{status:400});
    }
    let registered = false;
    let registration = null;
    if(_user){
        const user = await User.findOne({email:_user.email});
        registration = await EventRegistration.findOne({$and:[{user:user._id},{event:id}]})
   if(registration){
    // console.log(registration);
    registered=true;

   }
    }
    
   
    return Response.json({success:true,event:event[0],registered:registered,registration_id:registration?._id},{status:200});
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"},{status:500})
}
}