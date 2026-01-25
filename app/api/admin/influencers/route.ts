import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectMongoDB();

    // Fetch all influencers
    const influencers = await User.find({
      role: "influencer",
    })
      .select("name email isBlocked details createdAt")
      .lean();

    // Convert _id to string for proper handling
    const transformedInfluencers = influencers.map((influencer: any) => ({
      _id: influencer._id.toString(),
      name: influencer.name,
      email: influencer.email,
      isBlocked: influencer.isBlocked || false,
      createdAt: influencer.createdAt,
      details: influencer.details,
    }));

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

