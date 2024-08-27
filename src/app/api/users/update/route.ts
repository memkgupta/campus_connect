import connect from "@/lib/db"
import User from "@/lib/models/user.model";
import {getServerSession} from "next-auth/next"
export const PUT = async(req:Request)=>{
    const session = await getServerSession();
   
   const _user  = session?.user;
   if(!_user){
    return Response.json({
        success:false,
        message:"First login please"
    },{status:401})
   }
    await connect();
    try {
        const {username,name,bio,profile,social_links} = await req.json();
        const user = await User.findOne({email:_user.email});
       
        if(!user){
            return Response.json({
                success:false,
                message:"Unauthorized access"
            },{status:401});
        }
if(!user.verified){
    return Response.json({
        success:false,
        message:"Verify your account first"
    },{status:401});
}
        if(username){
            user.username = username;
        }
        if(name){
            user.name = name;
        }
        if(bio){
            user.bio = bio;
        }
        if(profile){
            user.profile = profile;
        }
        if(social_links){
       
            // if(user.)
         const socials:[string] = user.socials;
        
if(socials.find(link=>social_links===link)){
return Response.json({success:false,message:"Link already exists"},{status:401})
}
             user.socials.push(social_links)
        }
        await user.save();
        return Response.json({
            success:true,message:"Details updated successfully"
        },{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Some error occured"},{status:500});
    }
}