import connect from "@/lib/db";
import { Event } from "@/lib/models/event.model";

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url);
    let matchStage:any = {
        
    };
    const queryParams = {
        location:searchParams.get('location'),
        category:searchParams.get('category'),
        college:searchParams.get('college'),
        keyword:searchParams.get('keyword'),
        page : parseInt(searchParams.get('page')||'1'),
    } 
if(queryParams.location){
    matchStage.location = queryParams.location
}
if(queryParams.category){
    matchStage.category = queryParams.category
}
if(queryParams.college){
    matchStage.college=queryParams.college
}
if(queryParams.keyword){
    matchStage.name = {$regex:queryParams.keyword,$options:'i'}
}
const skip = (queryParams.page - 1) * 10;
await connect();
try {
    const events = await Event.aggregate([
        {$match:matchStage},
         {
            $lookup:{
            from:'colleges',
            foreignField:'_id',
            localField:'college',
            as:'college',
         }
        },
        {
            $lookup:{
            from:'clubs',
            foreignField:'_id',
            localField:'club',
            as:'club',
         }
        },
        {$lookup:{
            from:'event_registrations',
            localField:'_id',
            foreignField:'event',
            as:'registrations'
        }},
        {$project:{
            dateTime:1,
            name:1,
            location:1,
            category:1,
            participantsFromOutsideAllowed:1,
            maxCapacity:1,
            club:{
                clubLogo:1,
                clubName:1,
            },
            college:{
                name:1
            },
            totalRegistrations:{$size:"$registrations"}
        }},
        {
            $sort:{'totalRegistrations':-1}
        },
        {$skip:skip},
        {$limit:10}
    ])
    
    return Response.json({success:true,events:events},{status:200});
} catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500})
}
}