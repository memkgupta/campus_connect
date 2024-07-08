import connect from "@/lib/db";
import User from "@/lib/models/user.model";
export const GET = async (request:Request)=>{
    const { searchParams } = new URL(request.url);
   await connect();
      const email = searchParams.get('email');
const user = await User.findOne({email:email});
if(!user){
    return Response.json({success:false,message:"Bad request"},{status:400});
}
if(user.role==="CONTRIBUTOR"||user.role==="ADMIN"){
return Response.json({success:true,message:"Yay you are a contributor"},{status:200});
}
else{
    return Response.json({success:false,message:"You are not authorized for this action"},{status:401});
}
    
}