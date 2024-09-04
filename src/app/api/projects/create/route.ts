import connect from "@/lib/db"
import { Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";


export const POST = async(req:Request)=>{
    let {category,title,projectUrl,description,banner,images,openForCollab,start,end,currently_working,tags,live,github_repos,contributors,lead,documentationLink,demoLink} = await req.json();
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
        if(contributors.length==0){
            contributors.push(
                {
                    username:user.username,
                    name:user.name,
                    role:'lead'
                }
            )
        }
      
       if(!lead){
        lead = user.username;
       }
        const project = await Project.create({
user:user._id,
category,
live_link:projectUrl,
demo:demoLink,
documentation:documentationLink,
title,description,banner,images,openForCollab,start,end,currently_working,tags,live,github:github_repos,contributors,lead
        });
        return Response.json({success:true,message:"Project Created Successfully",id:project._id},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}