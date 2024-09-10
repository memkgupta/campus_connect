import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import User from "@/lib/models/user.model";
import Vote from "@/lib/models/vote.model";
import mongoose from "mongoose";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export const GET = async(req:Request,{ params }: { params: { id: string } })=>{
    const {id} = params;
   
    await connect();
    const session = await getServerSession();
    const _user = session?.user;
    try {
        // let resource = await Contributions.findById(id).populate('contributor');
        let resource = await Contributions.aggregate([
{
  $match:{
    _id:new mongoose.Types.ObjectId(id)
  },
  
},
{
  $lookup:{
    from:'users',
    as:'contributor',
    localField:'contributor',
    foreignField:'_id'
  }
},
{$unwind:"$contributor"},
{
  $lookup:{
    from:'playlists',
    as:'playlist',
    foreignField:'_id',
    localField:'playlist'
  }
},
{$unwind:"$playlist"},
{
  $project:{
    branch:1,
    label:1,
    type:1,
    code:1,
    sessionYear:1,
    thumbnail:1,
   
    collegeYear:1,

    university:1,

    contributor:{
      username:1,
      name:1,
      profile:1,
    },
playlist:{
  lectures:1
}
  }
}
        ])
        if(!resource||resource.length==0){
          return Response.json({success:false,message:"Not found"},{status:404});
      }
        // resource[0].contributor = {
        //     name:resource.contributor.name,
        //     username:resource.contributor.username
        // }
        let isVoted = null;
        if(_user){
          const user = await User.findOne({email:_user.email})
isVoted = await Vote.findOne({userId:user._id});

        }
      
        const votes = await Vote.aggregate([
          {
            $match:{
              contributionId:resource[0]._id
            }
          }
          ,
        { 
            $group: {
                _id: '$voteType', // Group by post ID
                upvoteCount: {
                  $sum: {
                    $cond: [{ $eq: ['$voteType', 'up'] }, 1, 0]
                  }
                },
                downvoteCount: {
                  $sum: {
                    $cond: [{ $eq: ['$voteType', 'down'] }, 1, 0]
                  }
                },
                
              },
              
        },
        
          {$project:{
            _id:0,
            upvoteCount: { $ifNull: ['$upvoteCount', 0] },
            downvoteCount: { $ifNull: ['$downvoteCount', 0] }
          }}
        
        ])
      
   
        return Response.json({success:true,data:{resource:resource[0],votes,isVoted:isVoted?.voteType}},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}