import connect from "@/lib/db"
import Contributions from "@/lib/models/contribution.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

export const GET = async(req:Request)=>{
    try {
        await connect();
        const {searchParams} = new URL(req.url);
        const page = searchParams.get('page');
        const skip = (parseInt(page?.toString()||'1')-1)*10;
        const session = await getServerSession();
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
        const contributions = await Contributions.aggregate([
            {$match:{
                contributor:user._id
            }},{
                $limit:10
            },{$skip:skip}
        ])
        const totalContributions = await Contributions.find({
            contributor:user._id
        }).countDocuments();
        return Response.json({
            success:true,contributions:contributions,totalContributions:totalContributions
        });
    } catch (error) {
        console.log(error);
       return Response.json({success:false,message:"Some error occured"},{status:500}) 
    }
}