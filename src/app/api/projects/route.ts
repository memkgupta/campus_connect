import connect from "@/lib/db";
import { Project } from "@/lib/models/project.model";

export const GET = async(req:Request)=>{
    const {searchParams:params} = new URL(req.url);
   let filters: {
       category?: string;
        tags?: any;
        title?: any;
        openForCollab?: boolean;
        technologiesUsed?: string;
      } ={

      };
     
      if(params.get("category")){
        filters.category = params.get("category")?.toString()!!
        console.log(params.get("category"))
      }
    //   if(params.get("tags")){
    //     filters.tags ={$in:[params.get("tags")?.toString().split(',')!!]}
    //   }
      if(params.get("title")){
        // console.log(params.get("title"))
        filters.title = {$regex:params.get("title")?.toString()!!,$options:'i'}
      }
      const page = parseInt(params.get("page")?.toString()||'1');
      const skip = (page-1)*10;
      try {
        await connect();
        const projects = await Project.aggregate([
            {
                $match:filters
            },{
               $lookup:{
                from:'users',
                as:'lead',
                foreignField:'username',
                localField:'lead'
               } 
            },
            {$unwind:"$lead"},
            {
                $project:{
                    _id:1,
                    title:1,
                    lead:{
                        username:1,
                        profile:1,
                        name:1
                    },
                    description:1,
                }
            },
            {$limit:10},{$skip:skip}
        ]);

        return Response.json({
            success:true,projects:projects
        });
      } catch (error) {
        console.log(error)
        return Response.json({success:false,message:"Some error occured"},{status:500});
      }
}