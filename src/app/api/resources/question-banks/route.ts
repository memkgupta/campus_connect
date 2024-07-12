import connect from "@/lib/db";
import QuestionBank from "@/lib/models/question-bank.model";


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
    const question_banks = await QuestionBank.find(filters);
    return Response.json({success:true,data:question_banks},{status:200});
   } catch (error) {
    console.log(error);
    return Response.json({success:false,message:"Some error occured"},{status:500})
   }
}