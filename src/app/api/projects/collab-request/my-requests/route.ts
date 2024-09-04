import { CollabRequest, Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth"

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url)
   
    const page= parseInt(searchParams.get('page')?.toString()||'1');
    const skip = (page-1)*10;
    const session = await getServerSession();
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"Please login first"});
    }
   try {
    const user = await User.findOne({email:_user.email})

   
    const requests = await CollabRequest.aggregate(
        [
            {
                $match:{
                    user_id:user._id,
                }
            },
            {
                $lookup:{
                    from :'projects',
                    as :'project',
                    localField:'project_id',
                    foreignField:'_id'
                }
            },
            {$unwind:'$user'},
            {$project:{
                _id:1,
                note:1,
                skills:1,
                contact_phone:1,
                contact_email:1,
                project:{
title:1,
description:1,
live_link:1                }
            }},
            {$limit:10},
            {$skip:skip}
        ]
    )
    return Response.json({success:true,requests:requests},{status:200});
   } catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500});
   }
}