import connect from "@/lib/db"
import PYQ from "@/lib/models/pyq.model";

export  const POST = async(request:Request)=>{
await connect();

try{
    const {branch,year,code,collegeYear,sessionYear,university} = await request.json();
    const pyq = new PYQ({
        branch:branch,
        year:year,
        code:code,
        collegeYear:collegeYear,
        sessionYear:sessionYear,
        university:university,
    });
    await pyq.save();
    return Response.json({success:true,message:"File uploaded successfully"},{status:200});
}
catch(error:any){
    
return Response.json({success:false,message:error.message},{status:500})
}
}