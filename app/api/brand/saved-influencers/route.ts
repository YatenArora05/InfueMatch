import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { userLeanToInfluencerDto } from "@/lib/influencerDto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Valid user ID is required" }, { status: 400 });
    }

    await connectMongoDB();

    const brandUser = await User.findById(userId).select("role savedInfluencerIds").lean();
    if (!brandUser || brandUser.role !== "brand") {
      return NextResponse.json({ message: "Brand user not found" }, { status: 404 });
    }

    const ids = (brandUser as { savedInfluencerIds?: mongoose.Types.ObjectId[] }).savedInfluencerIds || [];
    if (ids.length === 0) {
      return NextResponse.json({ influencers: [], savedIds: [] }, { status: 200 });
    }

    const influencers = await User.find({
      _id: { $in: ids },
      role: "influencer",
      profileComplete: true,
    })
      .select("name email details")
      .lean();

    const order = new Map(ids.map((id, i) => [id.toString(), i]));
    const transformed = influencers
      .map((doc) => userLeanToInfluencerDto(doc as never))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    return NextResponse.json(
      { influencers: transformed, savedIds: ids.map((id) => id.toString()) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching saved influencers:", error);
    return NextResponse.json({ message: "Failed to load saved influencers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, influencerId, save } = body as {
      userId?: string;
      influencerId?: string;
      save?: boolean;
    };

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Valid user ID is required" }, { status: 400 });
    }
    if (!influencerId || !mongoose.Types.ObjectId.isValid(influencerId)) {
      return NextResponse.json({ message: "Valid influencer ID is required" }, { status: 400 });
    }
    if (typeof save !== "boolean") {
      return NextResponse.json({ message: "save (boolean) is required" }, { status: 400 });
    }

    await connectMongoDB();

    const brandUser = await User.findById(userId).select("role").lean();
    if (!brandUser || brandUser.role !== "brand") {
      return NextResponse.json({ message: "Brand user not found" }, { status: 404 });
    }

    const influencer = await User.findOne({
      _id: influencerId,
      role: "influencer",
      profileComplete: true,
    })
      .select("_id")
      .lean();

    if (!influencer) {
      return NextResponse.json({ message: "Influencer not found" }, { status: 404 });
    }

    if (save) {
      await User.updateOne({ _id: userId }, { $addToSet: { savedInfluencerIds: influencerId } });
    } else {
      await User.updateOne({ _id: userId }, { $pull: { savedInfluencerIds: influencerId } });
    }

    const updated = await User.findById(userId).select("savedInfluencerIds").lean();
    const savedIds = ((updated as { savedInfluencerIds?: mongoose.Types.ObjectId[] })?.savedInfluencerIds || []).map(
      (id) => id.toString()
    );

    return NextResponse.json({ success: true, saved: save, savedIds }, { status: 200 });
  } catch (error) {
    console.error("Error updating saved influencers:", error);
    return NextResponse.json({ message: "Failed to update saved influencers" }, { status: 500 });
  }
}
