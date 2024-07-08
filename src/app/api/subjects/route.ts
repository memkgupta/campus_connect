import connect from "@/lib/db";
import Subject from "@/lib/models/subject.model"


export const GET =  async(req:Request)=> {
await connect();
const {searchParams} = new URL(req.url);

    var filters:{year?:string} = {}
    if(searchParams.get('year')){
        console.log(searchParams.get('year'))
        filters.year = searchParams.get('year')?.toString();
    }
    // console.log(filters);
    const subjects  = await Subject.find(filters);
    return Response.json({success:true,subjects:subjects.map((option)=>({label:option.label,value:option.code,id:option.code}))})
}