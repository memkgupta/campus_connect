import { resend } from "@/lib/resend";
import CollabRequestTemplate from "../../emails/CollabRequestEmail"


export async function sendCollabRequestEmail(email:string,project_name:string,username:string,name:string,id:string):Promise<any>{
    try {
       await resend.emails.send({
          from: 'campusconnect@mkdev.site',
          to: email,
          subject: 'New Collab Request',
          react: CollabRequestTemplate({username:username,name:name,id:id,project_name:project_name}),
        });
    
        
    
        return {success:true,message:"Collab notification sent"};
      } catch (error) {
        return {success:false,message:"Failed to send email"}
      }
}