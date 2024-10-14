import connect from "@/lib/db"
import Contributions from "@/lib/models/contribution.model"
import Playlists from "@/lib/models/playlist.model"
import { Progress } from "@/lib/models/progress.model"
import { NextRequest } from "next/server"

export const GET = async(req:NextRequest)=>{
    await connect()
    const searchParams = req.nextUrl.searchParams
    try {
        const tracker = await Progress.findById(searchParams.get('tid'))
        if(!tracker){
            return Response.json({success:false,message:"Bad request"},{status:400})
        }
        const resource = await Contributions.findById(tracker.resource_id);
        const playlist = await Playlists.findById(resource.playlist)
        const data:any = {}
        // progress: 65,
        // modulesCompleted: 13,
        // totalModules: 20,
        // estimatedDays: 7,
        // hoursSpent: 24,
        data.progress = ((tracker.taken.length/playlist.lectures.length)*100)
        data.lecturesCompleted = tracker.taken.length
        data.totalLectures = playlist.lectures.length;
        console.log(data)
        return Response.json({success:true,data});
    } catch (error) {
        console.log(error)
        return Response.json({success:false,message:"Something went wrong"},{status:500})
    }
}