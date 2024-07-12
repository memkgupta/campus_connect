import connect from "@/lib/db";
import NOTES from "@/lib/models/notes.model";
import PYQ from "@/lib/models/pyq.model";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async(req:Request,{ params }: { params: { id: string } })=>{
    const {id} = params;
    await connect();
    try {
        const notes = await NOTES.findById(id).populate('contributor');
        if(!notes){
            return Response.json({success:false,message:"Not found"},{status:404});
        }
        return Response.json({success:true,data:notes},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}