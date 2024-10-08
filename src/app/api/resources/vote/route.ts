import Contributions from "@/lib/models/contribution.model";
import User from "@/lib/models/user.model";
import Vote from "@/lib/models/vote.model";
import { getServerSession } from "next-auth";

export const POST = async(req:Request)=>{
    const {c_id,type} = await  req.json();
    const session = await getServerSession()
    const _user = session?.user
    if(!_user){
        return Response.json({
            success:false,message:'Please login first'
        },{status:403})
    }
    const user  = await User.findOne({email:_user.email});
    if(!user){
        return Response.json({success:false,message:"Invalid session"},{status:403})
    }
    const contribution=await Contributions.findById(c_id);
    if(!contribution){
        return Response.json({success:false,message:"No such contribution exists"},{status:401})
    }
    console.log(type)
try {
    const isAlreadyVoted = await Vote.findOne({userId:user._id});
    if(isAlreadyVoted&&isAlreadyVoted.voteType==type){
        await Vote.findByIdAndDelete(isAlreadyVoted._id);
        return Response.json({sucess:true,message:"Vote removed "},{status:201})
    }
    const vote = new Vote({
        contributionId:contribution._id,
        userId:user._id,
        voteType:type
    });
     if(isAlreadyVoted&&isAlreadyVoted.voteType!=type){
        await Vote.findByIdAndDelete(isAlreadyVoted._id);
    }
   
    await vote.save();
    return Response.json({success:true,message:"Voted successfully"});
} catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"});
}
}