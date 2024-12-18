import connect from "@/lib/db";
import ClubMember from "@/lib/models/club/club.members";
import Club from "@/lib/models/club/club.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const POST = async(req:NextRequest)=>{
    await connect();
    const {clubId,userId,role,team,status,joinedAt} = await req.json();
    const session = await getServerSession();
    const _user = session?.user;
    if(!_user){
        return Response.json({success:false,message:"Please login first"},{status:401});
    }
    try {
        const admin = await User.findOne({email:_user.email});
        const  club = await Club.findById(clubId);
        if(!club || !club.admin.equals(admin._id)){
            return Response.json({success:false,message:"Bad request"},{status:400});
        }
        const user = await User.findById(userId)
        if(!user){
            return Response.json({success:false,message:"Bad request"},{status:400});
        }
        const member = await ClubMember.create({
                clubId:club._id,
                userId:userId,
                role:role,
                team:team,
                status:status,
                joinedAt:joinedAt
        });
        return Response.json({success:true,message:"Member added successfully"},{status:200})
    } catch (error) {
        console.error(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}