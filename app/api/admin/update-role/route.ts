import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { isAdminRequest } from "@/lib/admin-session";

const TOGGLE_ROLES = ["influencer", "brand"] as const;
type ToggleRole = (typeof TOGGLE_ROLES)[number];

function isToggleRole(value: unknown): value is ToggleRole {
  return typeof value === "string" && (TOGGLE_ROLES as readonly string[]).includes(value);
}

export async function PATCH(req: Request) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, newRole } = body as { userId?: string; newRole?: string };

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    if (!isToggleRole(newRole)) {
      return NextResponse.json(
        { message: "newRole must be \"influencer\" or \"brand\"" },
        { status: 400 }
      );
    }

    const cleanUserId = userId.trim();
    const isValidObjectId =
      mongoose.Types.ObjectId.isValid(cleanUserId) &&
      cleanUserId.length === 24 &&
      /^[0-9a-fA-F]{24}$/i.test(cleanUserId);

    if (!isValidObjectId) {
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findById(cleanUserId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json({ message: "Cannot change role for admin users" }, { status: 400 });
    }

    if (user.role !== "influencer" && user.role !== "brand") {
      return NextResponse.json({ message: "User role cannot be updated" }, { status: 400 });
    }

    if (user.role === newRole) {
      return NextResponse.json(
        {
          success: true,
          message: "Role unchanged",
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        { status: 200 }
      );
    }

    user.role = newRole;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Role updated successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the role" },
      { status: 500 }
    );
  }
}
