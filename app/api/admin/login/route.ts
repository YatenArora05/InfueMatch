import { NextResponse } from "next/server";

// Temporary admin credentials
const ADMIN_EMAIL = "adminInfluencemarket@gmail.com";
const ADMIN_PASSWORD = "admin123";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Trim whitespace and convert email to lowercase for comparison
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Debug logging (remove in production)
    console.log("Login attempt:", {
      receivedEmail: email,
      trimmedEmail: trimmedEmail,
      expectedEmail: ADMIN_EMAIL.toLowerCase(),
      emailMatch: trimmedEmail === ADMIN_EMAIL.toLowerCase(),
      passwordMatch: trimmedPassword === ADMIN_PASSWORD
    });

    // Check against temporary credentials (case-insensitive email, exact password match)
    if (trimmedEmail === ADMIN_EMAIL.toLowerCase() && trimmedPassword === ADMIN_PASSWORD) {
      return NextResponse.json(
        { 
          success: true,
          message: "Login successful",
          adminId: "admin-temp-id"
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

