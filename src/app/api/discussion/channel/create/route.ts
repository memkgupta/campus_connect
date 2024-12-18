import connect from "@/lib/db";
import Channel from "@/lib/models/discussion/channel.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth"

export const POST = async(req:Request)=>{
    const {name,description,rules,logo,banner} = await req.json();
try{
    await connect()
const session = await getServerSession();

if (!session?.user){
return Response.json({
    success:false,
    message:"Please login first"
},{status:403});
}
const user = await User.findOne({email:session.user.email});
if(!user){
    return Response.json({
        success:false,
        message:"Invalid Token"
    },{status:403});
}
const channel = new Channel({
    name:name,
    logo:logo,
    banner:banner,
    description:description,
    rules:rules,
    admin:user._id
});

await channel.save();
return Response.json({success:true,message:"Channel Created Successfully",_id:channel._id})
}
catch(error:any){
  console.log(error);
  return Response.json({success:false,message:"Something went wrong"},{status:500});  
}
}