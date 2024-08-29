import User from "@/lib/models/user.model";

export const GET = async(req:Request)=>{
    const {searchParams} = new URL(req.url);
    const username = searchParams.get('username');

    try {
        const user = await User.findOne({username:username});
        if(!user){
            return Response.json({success:false,message:"No such user exists"},{status:404});
        }

        return Response.json({success:true,data:{profile:user.profile,name:user.name,socials:user.socials,bio:user.bio,interests:user.interests,username:user.username}})
    } catch (error) {
        return Response.json({success:false,message:"Some error occured"},{status:500})
    }
}