import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
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

    // Transform the data to match what the frontend needs
    const transformedInfluencers = influencers.map((influencer) => {
      const firstName = influencer.details?.firstName || "";
      const lastName = influencer.details?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || influencer.name || "";
      
      // Get all niches as an array
      const niches = Array.isArray(influencer.details?.niche) && influencer.details.niche.length > 0
        ? influencer.details.niche
        : [];
      
      // Get first niche for display (backward compatibility)
      const niche = niches.length > 0 ? niches[0] : "";

      // Get Instagram followers
      const instagramFollowers = influencer.details?.socials?.instagram?.followers || "0";

      // Get estimated rate
      const estimatedRate = influencer.details?.estimatedRate || "Not specified";

      // Get profile picture URL if available
      const profilePic = influencer.details?.profilePic || null;

      return {
        id: influencer._id.toString(),
        name: fullName,
        niche: niche, 
        niches: niches, 
        followers: instagramFollowers,
        rate: estimatedRate,
        profilePic: profilePic,
        email: influencer.email,
      };
    });

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

