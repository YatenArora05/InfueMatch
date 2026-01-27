import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { message: "Influencer ID is required" },
        { status: 400 }
      );
    }

    const cleanId = String(id).trim();

    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(cleanId) &&
      cleanId.length === 24 &&
      /^[0-9a-fA-F]{24}$/i.test(cleanId);

    if (!isValidObjectId) {
      return NextResponse.json(
        { message: "Invalid influencer ID format" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const influencer = await User.findById(cleanId);

    if (!influencer) {
      return NextResponse.json(
        { message: "Influencer not found" },
        { status: 404 }
      );
    }

    if (influencer.role !== "influencer") {
      return NextResponse.json(
        { message: "User is not an influencer" },
        { status: 400 }
      );
    }

    // If already blocked, don't change the count, just return current state
    if (influencer.isBlocked) {
      return NextResponse.json(
        {
          message: "Influencer is already blocked",
          reportCount: influencer.reportCount ?? 0,
          isBlocked: true,
        },
        { status: 200 }
      );
    }

    const currentCount = influencer.reportCount ?? 0;
    const newCount = currentCount + 1;

    influencer.reportCount = newCount;

    // Auto-block when reports exceed threshold
    const REPORT_THRESHOLD = 10;
    if (newCount >= REPORT_THRESHOLD) {
      influencer.isBlocked = true;
    }

    await influencer.save();

    return NextResponse.json(
      {
        message: influencer.isBlocked
          ? "Influencer reported and automatically blocked due to multiple reports"
          : "Influencer reported successfully",
        reportCount: influencer.reportCount,
        isBlocked: influencer.isBlocked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reporting influencer:", error);
    return NextResponse.json(
      { message: "An error occurred while reporting influencer" },
      { status: 500 }
    );
  }
}

