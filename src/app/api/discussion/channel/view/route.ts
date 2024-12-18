import connect from "@/lib/db"
import Channel from "@/lib/models/discussion/channel.model";
import { NextRequest } from "next/server";

export const GET = async(req:NextRequest)=>{
    await connect();
    const {searchParams} = req.nextUrl
    const id = searchParams.get('id');
   try {
    const channel = await Channel.findOne({_id:id,isActive:true});
    if(!channel){
        return Response.json({success:false,message:"Not found"},{status:200})
    }
    const channelAggregation = await Channel.aggregate([
        {
            $match:{
                _id:channel._id
            },
            
        },
        {
            $lookup:{
                as:'admin',
                from:'users',
                localField:'admin',
                foreignField:'_id'
            }
        },
        {$unwind:"$admin"},
        {
            $project:{
                logo:1,
                banner:1,
                name:1,
                rules:1,
                description:1,
                admin:{
                   name:1,
                   username:1,
                   profile:1,
                }
            }
        }
    ])

    return Response.json({success:true,channel:channelAggregation[0]});
   } catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500});
   }
}