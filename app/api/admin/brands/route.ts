import { connectMongoDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectMongoDB();

    // Fetch ALL users with role="brand" (including those without Brand profiles)
    const allBrandUsers = await User.find({ role: "brand" })
      .select("_id email name isBlocked createdAt")
      .lean();

    // Fetch all Brand profiles
    const brandProfiles = await Brand.find({})
      .populate('userId', 'email isBlocked')
      .lean();

    // Create a map of userId to Brand profile for quick lookup
    const brandProfileMap = new Map();
    brandProfiles.forEach((brand: any) => {
      const userId = brand.userId?._id?.toString() || brand.userId?.toString();
      if (userId) {
        brandProfileMap.set(userId, brand);
      }
    });

    // Transform all brand users, merging with Brand profile data if available
    const transformedBrands = allBrandUsers.map((user: any) => {
      const userId = user._id.toString();
      const brandProfile = brandProfileMap.get(userId);

      return {
        _id: brandProfile?._id?.toString() || userId, // Use Brand profile _id if exists, otherwise user _id
        userId: userId, // Always use the User _id as userId
        email: user.email,
        companyName: brandProfile?.companyName || user.name || 'N/A',
        industry: brandProfile?.industry || 'N/A',
        isBlocked: user.isBlocked || false,
        createdAt: user.createdAt,
        hasProfile: !!brandProfile, // Flag to indicate if they have completed profile
      };
    });

    return NextResponse.json(
      { brands: transformedBrands },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching brands" },
      { status: 500 }
    );
  }
}

