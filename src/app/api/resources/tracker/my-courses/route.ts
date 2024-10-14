import connect from "@/lib/db";
import { Progress } from "@/lib/models/progress.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async(req:NextRequest)=>{
    await connect()
    const session = await getServerSession()
    const _user = session?.user;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page')||'1')
    const limit = parseInt(searchParams.get('limit')||'10')
    if(!_user){
        return Response.json({success:false,message:"Please login first"},{status:401});
    }
    try{
const user = await User.findOne({email:_user.email});
if(!user){
    return Response.json({success:false,message:"Invalid session"},{status:401});
}
const courses = await Progress.aggregate([
    {$match:{
        user_id:user._id
    }},
    {
        $lookup:{
            from:'contributions',
            as:'course',
            localField:'resource_id',
            foreignField:'_id'
        }
    },
    {
        $lookup:{
            from :'playlists',
            as :'playlist',
            localField:"course.playlist",
            foreignField:'_id'
        }
    },
  {
    $unwind:"$playlist"
  },
    {$project:{
        createdAt:1,
        taken:{$size:"$taken"},
				resource_id:1,
        totalLectures:{$size:"$playlist.lectures"},
      	title:{$arrayElemAt:["$course.label",0]}
    }},{
        $limit:limit
    },
    {$skip:(page-1)*limit}
])
return Response.json({success:true,courses});
    }
    catch(error){
        console.log(error)
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}