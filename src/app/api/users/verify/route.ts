import connect from "@/lib/db";
import User from "@/lib/models/user.model";

export async function POST(request:Request){
    const {username,otp} = await request.json();
try {
    const user = await User.findOne({username:username});
    if(!user){
        return Response.json({success:false,message:"User not exists"},{status:400});
    }
    else{
        if(user.verified){
return Response.json({success:false,message:"User already verified"},{status:400})
        }
        // const expiryDate = new Date(user.otpExpiry.toString());
        const currentTime = new Date();
        console.log(user.otpExpiry.getTime())
        if(user.otpExpiry<currentTime.getTime()){
            return Response.json({success:false,message:"Verification code expired. Please request a new one"});
        }
       if(otp===user.otp){
        user.verified=true;
        user.otp=null
        await user.save();
        return Response.json({success:true,message:"User verified"},{status:200})
       }else{
        return Response.json({success:true,message:"Wrong verification code entered"},{status:400});

       }

    }
} catch (error:any) {
    console.log(error);
    return Response.json({success:false,message:"Error Verifying user"},{status:500});
}
   
   
}