import { CollabRequest, Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth"

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url)
    const project_id  = searchParams.get('project_id')
    const page= parseInt(searchParams.get('page')?.toString()||'1');
    const skip = (page-1)*10;
    const session = await getServerSession();
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"Please login first"});
    }
    // const user = await User.findOne({})
   try {
    const project = await Project.findById(project_id).populate('user');
    if(!project){
        return Response.json({success:false,message:"Project does not exists"});
    }
    if(project.user.email!=_user.email){
        return Response.json({success:false,message:"Not Authorized"});
    }
    const requests = await CollabRequest.aggregate(
        [
            {
                $match:{
                    project_id:project._id,
                }
            },
            {
                $lookup:{
                    from :'users',
                    as :'user',
                    localField:'user_id',
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
                user:{
username:1,
name:1,
profile:1                }
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