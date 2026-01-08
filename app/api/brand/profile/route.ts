import { connectMongoDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find brand profile by userId
    const brand = await Brand.findOne({ userId });

    if (!brand) {
      return NextResponse.json(
        { message: "Brand profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { brand },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching brand profile:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      userId,
      email,
      companyName,
      industry,
      website,
      phone,
      address,
      city,
      state,
      zip,
      bio,
      budgetRange,
      targetAudience,
      totalCampaigns,
      activeInfluencers,
      totalReach,
      totalSpend,
      instagramUsername,
      instagramFollowers,
      youtubeChannel,
      youtubeSubscribers,
      facebookUsername,
      facebookFollowers,
      twitterUsername,
      twitterFollowers,
    } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if brand profile already exists
    let brand = await Brand.findOne({ userId });

    const brandData: any = {
      userId,
      email: email || "",
      companyName: companyName || "",
      industry: industry || "",
      website: website || "",
      phone: phone || "",
      address: address || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      bio: bio || "",
      budgetRange: budgetRange || "",
      targetAudience: targetAudience || "",
      totalCampaigns: totalCampaigns || "",
      activeInfluencers: activeInfluencers || "",
      totalReach: totalReach || "",
      totalSpend: totalSpend || "",
      socials: {
        instagram: {
          username: instagramUsername || "",
          followers: instagramFollowers || "",
        },
        youtube: {
          channel: youtubeChannel || "",
          subscribers: youtubeSubscribers || "",
        },
        facebook: {
          username: facebookUsername || "",
          followers: facebookFollowers || "",
        },
        twitter: {
          username: twitterUsername || "",
          followers: twitterFollowers || "",
        },
      },
      profileComplete: true,
    };

    if (brand) {
      // Update existing brand profile
      Object.assign(brand, brandData);
      await brand.save();
    } else {
      // Create new brand profile
      brand = await Brand.create(brandData);
    }

    return NextResponse.json(
      { message: "Profile saved successfully", brand },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { message: "An error occurred while saving the profile" },
      { status: 500 }
    );
  }
}

