import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> | { userId: string } }
) {
  try {
    await connectMongoDB();

    // Handle both Promise and direct params (for Next.js 13/14/15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const { userId } = resolvedParams;

    console.log("Delete request - userId received:", userId, "Type:", typeof userId);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Trim and clean the userId
    const cleanUserId = String(userId).trim();

    console.log("Delete request - cleaned userId:", cleanUserId, "Length:", cleanUserId.length);

    // Validate ObjectId format - MongoDB ObjectIds are 24 hex characters
    // Use mongoose validation first, then regex as fallback
    const isValidObjectId = mongoose.Types.ObjectId.isValid(cleanUserId) && 
                           cleanUserId.length === 24 && 
                           /^[0-9a-fA-F]{24}$/i.test(cleanUserId);

    if (!isValidObjectId) {
      console.error("Invalid ObjectId format:", {
        userId: cleanUserId,
        type: typeof cleanUserId,
        length: cleanUserId.length,
        mongooseValid: mongoose.Types.ObjectId.isValid(cleanUserId),
        regexMatch: /^[0-9a-fA-F]{24}$/i.test(cleanUserId)
      });
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find the user to check their role
    const user = await User.findById(cleanUserId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // If it's a brand, delete the brand profile as well
    if (user.role === "brand") {
      await Brand.findOneAndDelete({ userId: user._id });
    }

    // Delete the user account
    await User.findByIdAndDelete(cleanUserId);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the account" },
      { status: 500 }
    );
  }
}

