import connect from "@/lib/db";
import ClubMember from "@/lib/models/club/club.members";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const PUT = async(req:NextRequest)=>{
    await connect()
    const {member_id,role,team,status} = await req.json()
    const session = await getServerSession()
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"Please login first"},{status:400});
    }
    try{
        const member = await ClubMember.findById(member_id).populate('clubId');
        // const old
        const user = await User.findOne({email:_user.email});
        if(!member){
            return Response.json({success:false,message:"Bad request"},{status:400});

        }
        if(!member.clubId.admin.equals(user._id)){
            return Response.json({success:false,message:"Not authorized"},{status:401});
        }
        if(role){
            member.role = role;
        }
        if(team){
            member.team = team;
        }
        if(status){
            member.status = status;
        }
        await member.save();
        return Response.json({success:true,message:"Member updated"},{status:200});
    }
    catch(error){
        console.error(error)
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}
