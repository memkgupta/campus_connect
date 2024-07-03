import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connect from "@/lib/db";
import User from "@/lib/models/user.model";
import {v4 as uuidV4} from 'uuid'
export async function POST(request:Request){
    const {email} = await request.json();
    const uuid = uuidV4();
try {
    const user = await User.findOne({email:email});
    if(!user){
        return Response.json({success:false,message:"User not exists"},{status:400});
    }
    else{
        if(user.verified){
return Response.json({success:false,message:"User already verified"},{status:400})
        }
        // const expiryDate = new Date(user.otpExpiry.toString());
      
       
        const otp = uuid.replace(/-/g, '').slice(0, 6);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1)
        user.otp=otp;
        user.otpExpiry = expiryDate;
        await user.save();
        const emailRes = await sendVerificationEmail(email,user.username,otp);
if(!emailRes.success){
  console.log(emailRes)
    return Response.json({success:false,message:emailRes.message},{status:500})
}
        return Response.json({success:true,message:"Code resent"},{status:200})
       

    }
} catch (error:any) {
    console.log(error);
    return Response.json({success:false,message:"Error Resending verification code"},{status:500});
}
   
   
}