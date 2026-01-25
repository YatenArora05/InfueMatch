import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> | { userId: string } }
) {
  try {
    await connectMongoDB();

    // Handle both Promise and direct params (for Next.js 13/14/15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const { userId } = resolvedParams;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Trim and clean the userId
    const cleanUserId = String(userId).trim();

    // Validate ObjectId format - MongoDB ObjectIds are 24 hex characters
    const isValidObjectId = mongoose.Types.ObjectId.isValid(cleanUserId) && 
                           cleanUserId.length === 24 && 
                           /^[0-9a-fA-F]{24}$/i.test(cleanUserId);

    if (!isValidObjectId) {
      console.error("Invalid ObjectId format in unblock route:", {
        userId: cleanUserId,
        type: typeof cleanUserId,
        length: cleanUserId.length,
      });
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await User.findById(cleanUserId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.isBlocked = false;
    await user.save();

    return NextResponse.json(
      { message: "Account unblocked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unblocking account:", error);
    return NextResponse.json(
      { message: "An error occurred while unblocking the account" },
      { status: 500 }
    );
  }
}

