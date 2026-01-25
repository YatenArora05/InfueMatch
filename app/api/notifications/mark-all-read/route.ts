import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Mark all notifications as read for the user
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    return NextResponse.json(
      { message: "All notifications marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { message: "An error occurred while marking notifications as read" },
      { status: 500 }
    );
  }
}

