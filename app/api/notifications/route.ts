import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

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

    // Fetch all notifications for the user, sorted by newest first
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      userId,
      read: false,
    });

    return NextResponse.json(
      { notifications, unreadCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { notificationId, userId } = await req.json();

    if (!notificationId || !userId) {
      return NextResponse.json(
        { message: "Notification ID and User ID are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Mark notification as read
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Notification marked as read", notification },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the notification" },
      { status: 500 }
    );
  }
}

