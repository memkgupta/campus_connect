import Channel from "@/lib/models/discussion/channel.model";
import Post from "@/lib/models/discussion/post.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export const POST = async (
  req: NextRequest
  
) => {
  let {page,channelId} = await req.json();
 page  = parseInt(channelId)
  const skip = (page-1)*10;

try {
    const channel = await Channel.findOne({
        _id:channelId,
        isActive:true
    })
    if(!channel){
        return Response.json({success:false,message:"Not Found",},{status:404});
    }
      const posts = await Post.aggregate([
        {
          $match: {
            channel: new mongoose.Schema.Types.ObjectId(channelId),
            parent: null,
          },
        },
        {
          $lookup: {
            from: "votes",
            let: { postId: "$_id" },
            as: "votes",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$postId", "$$postId"],
                  },
                },
              },
              {
                $group: {
                  _id: "$postId", // Use null to group all documents together for a total count
                  upvotes: {
                    $sum: { $cond: [{ $eq: ["$voteType", "up"] }, 1, 0] },
                  },
                  downvotes: {
                    $sum: { $cond: [{ $eq: ["$voteType", "down"] }, 1, 0] },
                  },
                },
              },
            ],
          },
        },
        {$unwind:"$votes"},
        {
            $lookup:{
                from:'posts',
                let:{parent:"$_id"},
                as:"replies",
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $eq:["$parentPost","$$parent"]
                            }
                        }
                    },
                    {
                        $group:{
                            _id:"$parentPost",
                            totalReplies:{$sum:1}
                        }
                    }
                ]
            }
        },
        {$unwind:"$replies"},
        {$lookup:{
            from :"channels",
            as:"channel",
            localField:"channel",
            foreignField:"_id"
        }},
        {
            $project:{
                channel:{
                    description:0,
                    rules:0,
                    admin:0,
                    isActive:0
                }
            }
        },
        {$sort:{
            createdAt:1
        }},
        {$skip:skip},
        {$limit:10}
      ]);
      return Response.json({
        success:true,
        posts:posts
      });
} catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500});
}
};
