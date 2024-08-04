import connect from "@/lib/db"
import { Project, ProjectLog } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { use } from "react";

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url);
    let project_id = searchParams.get('pid');
    const page:string|null=searchParams.get('page')
    const limit:string|null = searchParams.get('limit');
    const skip = (parseInt(page||'1')-1)*parseInt(limit||'10');
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
       const logs = await ProjectLog.find({project_id:project_id}).skip(skip).limit(parseInt(limit||'10')).sort({createdAt:1});
    
        
        return Response.json({success:true,logs},{status:200});
    } catch (error) {
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}