import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import User from "@/lib/models/user.model";
import Vote from "@/lib/models/vote.model";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export const GET = async(req:Request,{ params }: { params: { id: string } })=>{
    const {id} = params;
    console.log(id)
    await connect();
    const session = await getServerSession();
    const _user = session?.user;
    try {
        const resource = await Contributions.findById(id).populate('contributor');
        
        if(!resource){
          return Response.json({success:false,message:"Not found"},{status:404});
      }
        resource.contributor = {
            name:resource.contributor.name,
            username:resource.contributor.username
        }
        let isVoted = null;
        if(_user){
          const user = await User.findOne({email:_user.email})
isVoted = await Vote.findOne({userId:user._id});
console.log(_user)
console.log(isVoted)
        }
      
        const votes = await Vote.aggregate([
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
      
        
        return Response.json({success:true,data:{resource,votes,isVoted:isVoted?.voteType}},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}