
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import connect from '@/lib/db';
import User from '@/lib/models/user.model';
import Club from '@/lib/models/club.model';

export const GET = async(req:Request)=>{
await connect();
const session = await getServerSession();
const _user = session?.user;
try {
  
    if(!_user){
        return Response.json({success:false,message:"Invalid session"},{status:401});
    }
    const user = await User.findOne({email:_user.email});
    if(!user){
        return Response.json({success:false,message:"Invalid session"},{status:401});
    }
    const isClubAdmin = await Club.findOne({admin:user._id});
    const res = {username:user.username,name:user.name,profile:user.profile,bio:user.bio,interest:user.interests,courses:[],events:[],socials:user.socials,isClubAdmin:isClubAdmin?true:false}
    return Response.json({success:true,data:res},{status:200});
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"},{status:500})
}
}