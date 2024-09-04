import connect from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth"

export const GET = async(req:Request,{params}:{params:{id:string}})=>{
   const {id} = params;
    await connect();
const session =await getServerSession();
const _user = session?.user;
if(!_user){
    return Response.json({success:false,message:"Please login first"},{status:401});

}
const user = await User.findOne({email:_user.email});
const project = await Project.findById(id);
if(!project.user.equals(user._id)){
    return Response.json({
        success:false,message:"You are not authorized"
    },{status:401});
}
if(!project){
    return Response.json({success:false,message:"No project found"},{status:404});
}
// const projectAggregate = await Project.aggregate([
//     {$match:{
//         _id:project._id
//     }},
//     {
//         $lookup:{
//         from:'collabrequests',
//         let:{projectId:"$_id"},
//         pipeline:[
//             {$match:{
//                 $expr:{
//                     $eq:["$project_id","$$projectId"]
//                 },

//             },
//             $limit:10
//         }
//         ],
       
//         as:"collabRequests"
//     }},
// {
//     $lookup:{

//     }
// }
// ])
return Response.json({
    success:true,data:project
},{
    status:200
});
}