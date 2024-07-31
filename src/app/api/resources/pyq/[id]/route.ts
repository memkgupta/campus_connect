import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import PYQ from "@/lib/models/pyq.model";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async(req:Request,{ params }: { params: { id: string } })=>{
    const {id} = params;
    await connect();
    try {
        const pyq = await Contributions.findById(id).populate('contributor');
        if(!pyq){
            return Response.json({success:false,message:"Not found"},{status:404});
        }
        return Response.json({success:true,pyq:pyq},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Something went wrong"},{status:500});
    }
}