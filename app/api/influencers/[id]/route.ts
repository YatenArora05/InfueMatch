import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Influencer ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Fetch influencer by ID
    const influencer = await User.findById(id).lean();

    if (!influencer) {
      return NextResponse.json(
        { message: "Influencer not found" },
        { status: 404 }
      );
    }

    // Verify it's an influencer
    if (influencer.role !== "influencer") {
      return NextResponse.json(
        { message: "User is not an influencer" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { influencer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching influencer:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching influencer" },
      { status: 500 }
    );
  }
}

