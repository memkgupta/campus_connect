import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import NOTES from "@/lib/models/notes.model";

export const GET = async(req:Request)=>{
    const params = new URLSearchParams(req.url);
    const filters:{collegeYear:string,branch?:string,code?:string,university?:string}={
        collegeYear:'1',
        university:'AKTU',
    }
    
    if(params.get('collegeYear')){
        filters.collegeYear=params.get('collegeYear')?.toString()!!
    }
    if(params.get('branch')){
        filters.branch =params.get('branch')?.toString()
    }
    if(params.get('code')){
        filters.code = params.get('code')?.toString()
    }
   try {
    await connect();
    const notes = await Contributions.find({...filters,type:'notes'});
    return Response.json({success:true,data:notes},{status:200});
   } catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"},{status:500})
   }
}