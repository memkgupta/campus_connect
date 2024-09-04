import connect from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth"

export const GET = async(req:Request,{params}:{params:{id:string}})=>{
   const {id} = params;
    await connect();



const project = await Project.findById(id).select('-user');
const lead = await User.findOne({username:project.lead}).select(['username','name']);
lead.role = "Lead";
if(!project){
    return Response.json({success:false,message:"No project found"},{status:404});
}
console.log({...project,lead})
return Response.json({
    success:true,data:{...project._doc,lead}
},{
    status:200
});
}