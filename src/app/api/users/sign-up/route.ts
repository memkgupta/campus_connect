import connect from "@/lib/db";
import User from "@/lib/models/user.model";
import {v4 as uuidV4} from 'uuid'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import College from "@/lib/models/college.model";
export async function POST(request:Request){
    await connect();
    try{
      const{username,email,password,name} =  await request.json();
      const emailDomain = email.split('@')[1];
      const college = await College.findOne({emailDomain:emailDomain});
      if(!college){
        return Response.json({success:false,message:"College email entered is not registered yet"},{status:400});
      }
      const isUsernameTaken = await User.findOne({username:username,verified:true});
      if(isUsernameTaken){
        return Response.json({success:false,message:"Username already taken"},{status:400});
      }
      const isUserAlreadyExistsByEmail = await User.findOne({email:email,verified:true});
      const uuid = uuidV4();

      // Transform the UUID into a short OTP (e.g., first 6 characters of the UUID)
      const otp = uuid.replace(/-/g, '').replace(/\D/g, '').slice(0, 6);
      if(isUserAlreadyExistsByEmail){
       if(isUserAlreadyExistsByEmail.verified){
        return Response.json({success:false,message:"User already exist with this email"},{status:400})
       }
       else{
        const hashed = await bcrypt.hash(password,10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1)
isUserAlreadyExistsByEmail.otp = otp;
isUserAlreadyExistsByEmail.password = hashed;
isUserAlreadyExistsByEmail.otpExpiry = expiryDate;
       
        await isUserAlreadyExistsByEmail.save()
       }
      } 
      else{
        const hashed = await bcrypt.hash(password,10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1)

        const user = new User({
            name:name,email,username,password:hashed,otp,otpExpiry:expiryDate,colleg:college._id
        });
        await user.save()
      }

//send verification email
const emailRes = await sendVerificationEmail(email,username,otp);
if(!emailRes.success){
  console.log(emailRes)
    return Response.json({success:false,message:emailRes.message},{status:500})
}
return Response.json({success:true,message:"User Registered Successfully. Please verify your college email"},{status:200})
    }
    catch(error:any){
      console.log(error)
        return Response.json({success:false,message:"Error Regestring user"},{status:500})
    }
}