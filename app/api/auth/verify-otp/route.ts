import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetOtp ||
      user.resetOtp !== otp ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "OTP verified" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying OTP." },
      { status: 500 }
    );
  }
}


