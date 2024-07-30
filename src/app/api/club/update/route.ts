import connect from "@/lib/db"
import Club from "@/lib/models/club.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

export const PUT = async(req:Request)=>{
    try {
        
        await connect();
        const session = await getServerSession();
        const _user = session?.user;
        if(!_user){
            return Response.json({success:false,message:"Please login first"},{status:403});
        }
        const user = await User.findOne({email:_user.email});
        if(!user){
            return Response.json({success:false,message:"Invalid Session"},{status:403});

        }
        const {clubName,clubLogo,contactPhone,clubDescription} = await req.json()
        const club = await Club.findOne({admin:user._id});
        if(!club){
            return Response.json({success:false,message:"Bad request"},{status:401})
        }
if(clubName){
    club.clubName = clubName
}
if(clubDescription){
    club.clubDescription = clubDescription
}
if(clubLogo){
    club.clubLogo = clubLogo;
}
if(contactPhone){
    club.contactPhone = contactPhone;
}
await club.save();
return Response.json({success:true,message:"Club Details Updated Successfully"});
    } catch (error) {
        return Response.json({success:false,message:"Some error occured"},{status:500})
    }
}