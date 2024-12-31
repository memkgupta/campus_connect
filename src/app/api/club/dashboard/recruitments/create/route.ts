import { NextRequest } from "next/server";

export const POST = async(req:NextRequest)=>{
    return Response.json({success:true,message:""})
}