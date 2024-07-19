import connect from "@/lib/db";
import Club from "@/lib/models/club.model";
import College from "@/lib/models/college.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
export const POST = async(req:Request)=>{

    await connect();
    const session = await getServerSession();
    if(!session){
        return Response.json({success:false,message:"Please Login First"},{status:401})
    }
    const _user= session.user;
    if(!_user){
        return Response.json({success:false,message:"Invalid Session Please Login again"},{status:401})
    }
    const {clubEmail,collegeId,clubName,clubDescription,contactPhone,clubLogo} = await req.json();

    try {
      const user = await User.findOne({email:_user.email});
        const college = await College.findById(user.college);
        const isValidEmail = college.emailDomain===clubEmail.split('@')[1];
       if(!isValidEmail){
        return Response.json({success:false,message:"Email id is not valid of your college"},{status:400});
       }
        const club = await Club.create({
clubEmail:clubEmail,
college:college._id,
clubName:clubName,
clubDescription:clubDescription,
contactPhone:contactPhone,
clubLogo:clubLogo,
isVerified:false,
admin:user._id
        });
        return Response.json({success:true,message:"Club registered successfully pending verification"},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Some error occured"})
    }
}