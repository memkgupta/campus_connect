import connect from "@/lib/db";
import Club from "@/lib/models/club/club.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  await connect();
  const session = await getServerSession();
  const _user = session?.user;

  if (!_user) {
    return Response.json({ success: false, message: "Please login first" }, { status: 403 });
  }

  try {
    const user = await User.findOne({ email: _user.email });
    if (!user) {
      return Response.json({ success: false, message: "Invalid session" }, { status: 403 });
    }

    // Retrieve only the ID, name, and admin fields of the clubs where the user is the admin
    const clubs = await Club.findOne(
      { admin: user._id },
      { _id: 1, clubName: 1, admin: 1 }
    );

    if (clubs.length === 0) {
      return Response.json({ success: false, message: "No registered clubs found" }, { status: 404 });
    }

    return Response.json({ success: true, clubs }, { status: 200 });
    
  } catch (error) {
    console.log(error);
    return Response.json({ success: false, message: "Some error occurred" }, { status: 500 });
  }
}
