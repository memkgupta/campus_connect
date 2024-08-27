import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import Vote from "@/lib/models/vote.model";

import { NextApiRequest, NextApiResponse } from "next";

export const GET = async(req:Request,{ params }: { params: { id: string } })=>{
    const {id} = params;
    console.log(id)
    await connect();
    try {
        const resource = await Contributions.findById(id).populate('contributor');
        resource.contributor = {
            name:resource.contributor.name,
            username:resource.contributor.username
        }
        const votes = await Vote.aggregate([
        {
            $group: {
                _id: '$voteType', // Group by post ID
                upvoteCount: {
                  $sum: {
                    $cond: [{ $eq: ['$voteType', 'upvote'] }, 1, 0]
                  }
                },
                downvoteCount: {
                  $sum: {
                    $cond: [{ $eq: ['$voteType', 'downvote'] }, 1, 0]
                  }
                }
              }
        }
        ])
      
        
        if(!resource){
            return Response.json({success:false,message:"Not found"},{status:404});
        }
        return Response.json({success:true,data:{resource,votes}},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}