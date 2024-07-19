import connect from "@/lib/db";
import Club from "@/lib/models/club.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth/next"

export const GET = async(req:Request)=>{
    await connect();
const session = await getServerSession();
if(!session){
    return Response.json({success:false,message:"Please login first"},{status:401})
}
const _user = session.user;
if(!_user){
    return Response.json({success:false,message:"Invalid session"},{status:500});
}
try {
    const user = await User.findOne({email:_user.email});
if(!user){
    return Response.json({success:false,message:"Invalid session"},{status:500});
}

const club = await Club.findOne({admin:user._id});
if(!club){
    return Response.json({success:false,message:"No club registered"},{status:200})
}
return Response.json({success:true,data:{name:club.clubName,_id:club._id,logo:club.clubLogo,isVerified:club.isVerified}},{status:200});
} catch (error) {
    return Response.json({success:false,message:"Some error occured"},{status:500})
}


}