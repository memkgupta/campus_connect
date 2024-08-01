import connect from "@/lib/db";
import { Event } from "@/lib/models/event.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url);
    let matchStage:any = {
        
    };
    const queryParams = {
        happening:searchParams.get('happening'),
        location:searchParams.get('location'),
        category:searchParams.get('category'),
        college:searchParams.get('college'),
        keyword:searchParams.get('keyword'),
        page : parseInt(searchParams.get('page')||'1'),
        id:searchParams.get('id'),
    } 
if(queryParams.location){
    matchStage.location = queryParams.location
}
if(queryParams.category && queryParams.category!="all"){
    matchStage.category = queryParams.category
}
if(queryParams.college){
    matchStage.college=new mongoose.Types.ObjectId(queryParams.college)
}
if(queryParams.keyword){
    matchStage.name = {$regex:queryParams.keyword,$options:'i'}
}
if(queryParams.id){
matchStage._id=new mongoose.Types.ObjectId(queryParams.id)
}
var startDate = new Date();
var endDate = new Date();
if(queryParams.happening){

    const h = queryParams.happening;
    if(h==="this-week"){
      
       endDate = getWeekEnd(endDate);
      console.log(startDate);
      console.log(endDate)
    }
    // if(h==="next-7-days"){
    //     startDate = 
    // }
    if(h==="this-month"){
        startDate = getMonthStart(startDate);
        endDate = getMonthEnd(endDate);
    
    }
    if(h==="this-year"){
        startDate = getYearStart(startDate)
        endDate = getYearEnd(endDate)
       
    }
    matchStage.dateTime={
        $gte:startDate,
        $lt:endDate
    }
}
const session =await getServerSession();
const _user = session?.user;

const skip = (queryParams.page - 1) * 10;
await connect();

try {
    if(!queryParams.college && _user){
        const user = await User.findOne({email:_user.email});
        matchStage.college = new mongoose.Types.ObjectId(user.college)
    }
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
        {$unwind:{
            path:'$club'
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
    const totalResults = await Event.aggregate([
      
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
            $count:'totalResults'
        }
    ])
    return Response.json({success:true,events:events,totalResults:totalResults[0]?.totalResults},{status:200});
} catch (error:any) {
    console.log(error.message)
    return Response.json({success:false,message:"Some error occured"},{status:500})
}
}

function startOfDay(date:Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
  // Helper function to get the start of the week (Sunday)
  function getWeekStart(date:Date) {
    const day = date.getDay();
    console.log(day);
    const diff = date.getDate() - day;
    console.log(diff)
   
    return startOfDay(new Date(date.setDate(diff) + 1));
 
}
  
  // Helper function to get the end of the week (Saturday)
  function getWeekEnd(date:Date) {
    const day = date.getDay();
    const diff = 7;
    
    return startOfDay(new Date(date.setDate(diff+1) + 1)); // Adding 1 to include the whole day
    
  }
  
  // Helper function to get the start of the month
  function getMonthStart(date:Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  
  // Helper function to get the end of the month
  function getMonthEnd(date:Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of the current month
  }
  
  // Helper function to get the start of the year
  function getYearStart(date:Date) {
    return new Date(date.getFullYear(), 0, 1);
  }
  
  // Helper function to get the end of the year
  function getYearEnd(date:Date) {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999); // Last day of the current year
  }