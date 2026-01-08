import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const influencerId = searchParams.get("influencerId");

    if (!influencerId) {
      return NextResponse.json(
        { message: "Influencer ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Fetch bookings for the influencer, sorted by posting date (ascending)
    const bookings = await Booking.find({ influencerId })
      .sort({ postingDate: 1 })
      .select("-__v");

    return NextResponse.json(
      { bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      influencerId,
      campaignName,
      eventName,
      postingDate,
      agreedRate,
      notes,
      assetLink,
    } = await req.json();

    if (!campaignName || !eventName || !postingDate) {
      return NextResponse.json(
        { message: "Campaign name, event name and posting date are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if user profile is complete before allowing bookings
    if (influencerId) {
      const user = await User.findById(influencerId);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (!user.profileComplete) {
        return NextResponse.json(
          { message: "You must set up your profile first before posting future bookings for any brand collaboration." },
          { status: 403 }
        );
      }
    }

    const booking = await Booking.create({
      influencerId: influencerId || null,
      campaignName,
      eventName,
      postingDate: new Date(postingDate),
      agreedRate: typeof agreedRate === "number" ? agreedRate : Number(agreedRate) || 0,
      notes,
      assetLink,
    });

    return NextResponse.json(
      { message: "Booking saved successfully", booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "An error occurred while saving the booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");
    const influencerId = searchParams.get("influencerId");

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find and delete the booking, ensuring it belongs to the influencer
    const booking = await Booking.findOneAndDelete({
      _id: bookingId,
      ...(influencerId && { influencerId }),
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the booking" },
      { status: 500 }
    );
  }
}


