import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import Brand from "@/models/Brand";
import { sendCollaborationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { influencerId, brandUserId } = await req.json();

    if (!influencerId || !brandUserId) {
      return NextResponse.json(
        { message: "Influencer ID and Brand User ID are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Fetch influencer details
    const influencer = await User.findById(influencerId);
    if (!influencer || influencer.role !== "influencer") {
      return NextResponse.json(
        { message: "Influencer not found" },
        { status: 404 }
      );
    }

    // Fetch brand details
    const brandUser = await User.findById(brandUserId);
    if (!brandUser || brandUser.role !== "brand") {
      return NextResponse.json(
        { message: "Brand not found" },
        { status: 404 }
      );
    }

    // Fetch brand profile for company name
    const brandProfile = await Brand.findOne({ userId: brandUserId });
    const brandName = brandProfile?.companyName || brandUser.name;
    const brandEmail = brandUser.email;

    // Get influencer name
    const influencerFirstName = influencer.details?.firstName || "";
    const influencerLastName = influencer.details?.lastName || "";
    const influencerName = `${influencerFirstName} ${influencerLastName}`.trim() || influencer.name;

    // Send email to influencer
    await sendCollaborationEmail(
      influencer.email,
      influencerName,
      brandName,
      brandEmail
    );

    return NextResponse.json(
      { message: "Collaboration email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending collaboration email:", error);
    return NextResponse.json(
      { message: "An error occurred while sending the email" },
      { status: 500 }
    );
  }
}

