import connect from "@/lib/db";
import Club from "@/lib/models/club.model";
import College from "@/lib/models/college.model";

export const POST = async(req:Request)=>{
    const {clubEmail,collegeId,clubName,clubDescription,contactPhone,clubLogo} = await req.json();

    try {
        await connect();
        const college = await College.findById(collegeId)
        const isValidEmail = college.emailDomain.equals(clubEmail.split('@')[1]);
       if(!isValidEmail){
        return Response.json({success:false,message:"Email id is not valid of your college"},{status:400});
       }
        const club = await Club.create({
clubEmail:clubEmail,
college:college._id,
clubName:clubName,
clubDescription:clubDescription,
contactPhone:contactPhone,
clubLogo:clubLogo,
isVerified:false

        });
        return Response.json({success:true,message:"Club registered successfully pending verification"},{status:200})
    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:"Some error occured"})
    }
}