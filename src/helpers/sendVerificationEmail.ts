import { resend } from "@/lib/resend";
import EmailTemplate from "../../emails/VerificationEmail";


export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<any>{
    try {
       await resend.emails.send({
          from: 'campusconnect@mkdev.site',
          to: email,
          subject: 'Verification',
          react: EmailTemplate({otp:verifyCode}),
        });
    
        
    
        return {success:true,message:"Verification Code sent to your college email id"};
      } catch (error) {
        return {success:false,message:"Failed to send email"}
      }
}