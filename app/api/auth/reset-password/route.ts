import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Email, OTP and new password are required" },
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "An error occurred while resetting your password." },
      { status: 500 }
    );
  }
}


