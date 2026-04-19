import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { userLeanToInfluencerDto } from "@/lib/influencerDto";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectMongoDB();

    // Fetch only influencers with completed profiles
    const influencers = await User.find({
      role: "influencer",
      profileComplete: true,
    })
      .select("name email details")
      .lean();

    const transformedInfluencers = influencers.map((influencer) => userLeanToInfluencerDto(influencer as never));

    return NextResponse.json(
      { influencers: transformedInfluencers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching influencers" },
      { status: 500 }
    );
  }
}

