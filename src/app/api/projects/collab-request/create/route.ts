import { sendCollabRequestEmail } from "@/helpers/sendCollabMail";
import connect from "@/lib/db"
import { CollabRequest, Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";


export const POST = async(req:Request)=>{
const {project_id,motive,contact_no,contact_email,skills} = await req.json()
await connect();
const session = await getServerSession();
const _user = session?.user;
if(!_user){
    return Response.json({success:false,message:"Please login first"});
}
try{
    const user = await User.findOne({email:_user.email});
    const project = await Project.findById(project_id).populate('user');
    
    if(!project){
        return Response.json({success:false,message:"Project doesn't exists"});
    
    }
    if(project.user._id==user._id){
        return Response.json({success:false,message:"Bad request"},{status:400});
    }
    if(!project.openForCollab){
        return Response.json({success:false,message:"Project is not accepting collaborations"});
    
    }
    const projectCollabRequest = await CollabRequest.create({
        project_id,
        user_id:user._id,
        skills:skills,
        motive:motive,
        contact_email:contact_email,
        contact_no:contact_no
    });
    await sendCollabRequestEmail(project.user.email,project.title,user.username,user.name,project._id);
    return Response.json({
        success:true,_id:projectCollabRequest._id
    })
}
catch(error){
    return Response.json({success:false,message:"Some error occured"},{status:500})
}
}