import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendResetOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email });

    // Always respond with success for privacy, even if user not found
    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, an OTP has been sent." },
        { status: 200 }
      );
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = expires;
    await user.save();

    await sendResetOtpEmail(email, otp);

    return NextResponse.json(
      { message: "If that email exists, an OTP has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}


