import connect from "@/lib/db";
import Contributions from "@/lib/models/contribution.model";
import { Progress } from "@/lib/models/progress.model";
import User from "@/lib/models/user.model";
import Vote from "@/lib/models/vote.model";
import mongoose from "mongoose";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // Establish database connection
    await connect();

    // Retrieve session and user information
    const session = await getServerSession();
    const userEmail = session?.user?.email;

    // Fetch the contribution resource
    const resource = await Contributions.findById(id).populate("contributor");

    if (!resource) {
      return new Response(
        JSON.stringify({ success: false, message: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build aggregation pipeline
    const aggregationPipeline = buildAggregationPipeline(id, resource.type);
    const aggregatedResource = await Contributions.aggregate(aggregationPipeline);

    // Fetch user-specific data if the user is authenticated
    const userData = userEmail ? await getUserData(userEmail, id) : { isVoted: null, tracker: null };

    // Aggregate votes
    const votes = await aggregateVotes(resource._id);

    // Update resource based on user progress
    if (userData.tracker && resource.type === "lectures") {
      markTakenLectures(aggregatedResource[0], userData.tracker);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          resource: aggregatedResource[0],
          votes,
          isVoted: userData.isVoted?.voteType || null,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET /api/contribution:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * Builds the aggregation pipeline based on resource type.
 */
const buildAggregationPipeline = (id: string, type: string) => {
  const pipeline: any[] = [
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "contributor",
        foreignField: "_id",
        as: "contributor",
      },
    },
    { $unwind: "$contributor" },
  ];

  if (type === "lectures") {
    pipeline.push(
      {
        $lookup: {
          from: "playlists",
          localField: "playlist",
          foreignField: "_id",
          as: "playlist",
        },
      },
      { $unwind: "$playlist" }
    );
  }

  pipeline.push({
    $project: {
      branch: 1,
      label: 1,
      type: 1,
      code: 1,
      sessionYear: 1,
      thumbnail: 1,
      file: 1,
      collegeYear: 1,
      university: 1,
      contributor: {
        username: 1,
        name: 1,
        profile: 1,
      },
      playlist: type === "lectures" ? { lectures: 1 } : undefined,
    },
  });

  return pipeline;
};

/**
 * Retrieves user-specific data such as vote status and progress tracker.
 */
const getUserData = async (email: string, resourceId: string) => {
  const user = await User.findOne({ email });

  if (!user) return { isVoted: null, tracker: null };

  const [isVoted, tracker] = await Promise.all([
    Vote.findOne({ userId: user._id, contributionId: resourceId }),
    Progress.findOne({ user_id: user._id, resource_id: resourceId }),
  ]);

  return { isVoted, tracker };
};

/**
 * Aggregates votes for a specific contribution.
 */
const aggregateVotes = async (contributionId: mongoose.Types.ObjectId) => {
  const voteAggregation = await Vote.aggregate([
    { $match: { contributionId } },
    {
      $group: {
        _id: "$voteType",
        upvoteCount: {
          $sum: { $cond: [{ $eq: ["$voteType", "up"] }, 1, 0] },
        },
        downvoteCount: {
          $sum: { $cond: [{ $eq: ["$voteType", "down"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        upvoteCount: { $ifNull: ["$upvoteCount", 0] },
        downvoteCount: { $ifNull: ["$downvoteCount", 0] },
      },
    },
  ]);

  // Ensure both upvoteCount and downvoteCount are present
  const votes = { upvoteCount: 0, downvoteCount: 0 };
  voteAggregation.forEach((vote) => {
    if (vote.upvoteCount !== undefined) votes.upvoteCount = vote.upvoteCount;
    if (vote.downvoteCount !== undefined) votes.downvoteCount = vote.downvoteCount;
  });

  return votes;
};

/**
 * Marks lectures as taken based on user progress.
 */
const markTakenLectures = (resource: any, tracker: any) => {
  const takenSet = new Set(tracker.taken.map((id: mongoose.Types.ObjectId) => id.toString()));

  resource.playlist.lectures = resource.playlist.lectures.map((lecture: any) => ({
    ...lecture,
    taken: takenSet.has(lecture._id.toString()),
  }));
};
