import connect from "@/lib/db"
import Contributions from "@/lib/models/contribution.model";
import PYQ from "@/lib/models/pyq.model";

export const GET = async(request:Request)=>{
    await connect();
    try {
        const params = new URLSearchParams(request.url);
        const filters:{collegeYear:string,branch?:string,code?:string,sessionYear?:string} = {collegeYear:'1'}

        if(params.get('collegeYear')){
            filters.collegeYear=params.get('collegeYear')?.toString()!!
        }
        if(params.get('branch')){
            filters.branch =params.get('branch')?.toString()
        }
        if(params.get('code')){
            filters.code = params.get('code')?.toString()
        }
        if(params.get('sessionYear')){
            filters.sessionYear = params.get('sessionYear')?.toString()
        }
        const pyqs = await Contributions.find({...filters,type:'pyq'});
        return Response.json({success:true,data:pyqs},{status:200});
    } catch (error) {
        return Response.json({success:false,message:"Some error occured"},{status:500})
    }
}