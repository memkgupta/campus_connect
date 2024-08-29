import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import NOTES from "@/lib/models/notes.model";

export const GET = async (req: Request) => {
  const params = new URLSearchParams(req.url);
  const filters: {
    collegeYear: string;
    branch?: string;
    code?: string;
    university?: string;
    type: string;
  } = {
    collegeYear: "1",
    university: "AKTU",
    type: "notes",
  };
console.log(params)
  if (params.get("collegeYear")) {
    filters.collegeYear = params.get("collegeYear")?.toString()!!;
  }
  if (params.get("branch")) {
    filters.branch = params.get("branch")?.toString();
  }
  if (params.get("code")) {
    filters.code = params.get("code")?.toString();
  }
  // if(params.get("sessionYear")){}
  if (params.get("type")) {
    console.log(params.get("type"))
    filters.type = params.get("type")!.toString();
  }
  try {
    console.log(filters)
    await connect();
    const resources = await Contributions.aggregate([
      { $match: filters },
      {
        $lookup: {
          as: "votes",
          from: "votes",
          localField: "_id",
          foreignField: "contributionId",
        },
      },
      {
        $unwind:{
            path: '$votes',
            preserveNullAndEmptyArrays: true // Include documents even if there are no votes
          },
      },
     
      {
        $group: {
          _id: "$_id", // Group by post ID
          data: { $first: '$$ROOT' },
          upvoteCount: {
            $sum: {
              $cond: [{ $eq: ["$votes.voteType", "up"] }, 1, 0],
            },
          },
          downvoteCount: {
            $sum: {
              $cond: [{ $eq: ["$votes.voteType", "down"] }, 1, 0],
            },
          },
        },
      },
      {$project:{
        _id:0,
        upvoteCount:1,
        downvoteCount:1,
        data:1
      }}
    ]);
    // const resources = await Contributions.find({...filters,type:params.get('type')||'notes'});
    return Response.json({ success: true, resources: resources }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Some error occured" },
      { status: 500 }
    );
  }
};
