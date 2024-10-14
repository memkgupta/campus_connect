import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import User from "@/lib/models/user.model";

export const GET = async(req:Request)=>{
    await connect();
    const {searchParams} = new URL(req.url);
    const type = searchParams.get('type');
    const query = searchParams.get('query')
    // query?.toString().replace('-',' ');
    let results ;
    try {
        if(type==='users'){
const users = await User.find(
    {$text:{$search:query!.toString(),$caseSensitive:false}},
    {score:{$meta:'textScore'}}
)
.select(['name','username','_id','profile'])
.sort({ score: { $meta: 'textScore' } }) // Sorting by text score
.limit(10);

results = users.map(user=>({label:user.name,thumbnail:user.profile,sub:user.username,href:`/user/${user.username}`}))
        }
        else{
const resources = await Contributions.find({
    $text:{$search:query!.toString(),$caseSensitive:false},
    
},{score:{$meta:'textScore'}})
.select(['label','branch','_id'])
.sort({score:{$meta:'textScore'}})
.limit(10)
;

results = resources.map(res=>({label:res.label,sub:res.branch,href:`/resources/${res._id}`,thumbnail:null}))
        }
return Response.json({success:true,results},{status:200});

    } catch (error) {
        console.log(error)
       return Response.json({success:false,message:"Some error occured"},{status:500}); 
    }
}