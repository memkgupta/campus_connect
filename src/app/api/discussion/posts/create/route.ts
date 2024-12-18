import { NextRequest } from "next/server";

export const POST = async(req:NextRequest)=>{
    const {title,content,attachment,author,channel,tags,parentPost} = await req.json()
    
}