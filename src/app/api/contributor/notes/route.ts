import connect from "@/lib/db"
import NOTES from "@/lib/models/notes.model";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

import User from "@/lib/models/user.model";

export  const POST = async(request:Request)=>{
await connect();
const session = await getServerSession(authOptions);
const _user = session?.user;
try{
    const user = await User.findById(_user?._id);
    if(!user){
        return Response.json({
            success:false,
            message:"Not authorized"
        })
    }

    const {label,branch,code,collegeYear,university,file} = await request.json();
    const notes = new NOTES({
        label:label,
        branch:branch,
        file:file,
        code:code,
        collegeYear:collegeYear,
        contributor:user._id,
        university:university,
    });
    await notes.save();
    return Response.json({success:true,message:"File uploaded successfully"},{status:200});
}
catch(error:any){
    
return Response.json({success:false,message:error.message},{status:500})
}
}