import connect from "@/lib/db"
import { Project, ProjectLog } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { use } from "react";

export const POST = async(req:Request)=>{
    let {project_id,description} = await req.json();
    try {
        await connect();
        const session = await getServerSession();
        if(!session){
            return Response.json({
                success:false,message:"Please login first"
            },{status:403})
        }
        const _user = session.user;
        const user = await User.findOne({email:_user.email});
        if(!user){
            return Response.json({success:false,message:"Invalid session"},{status:403});
        }
        
       
        const project = await Project.findById(project_id);
        if(!project){
            return Response.json({success:false,message:"Project does not exists"},{status:400});
        }
        if(!project.user.equals(user._id)){
            return Response.json({success:false,message:"You are not authorized"},{status:403});
        }
        const log = await ProjectLog.create({
            project_id,description
        })
        return Response.json({success:true,message:"Log added Successfully",log},{status:200});
    } catch (error) {
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}