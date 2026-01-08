import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      userId,
      email,
      firstName,
      lastName,
      gender,
      dob,
      phone,
      address,
      city,
      state,
      zip,
      instagramUsername,
      instagramFollowers,
      youtubeChannel,
      youtubeSubscribers,
      facebookUsername,
      facebookFollowers,
      twitterUsername,
      twitterFollowers,
      niche,
      bio,
      estimatedRate,
    } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update user details - update fields individually to avoid schema conflicts
    if (!user.details) {
      user.details = {};
    }

    // Update personal information
    if (firstName !== undefined) user.details.firstName = firstName;
    if (lastName !== undefined) user.details.lastName = lastName;
    if (gender !== undefined) user.details.gender = gender;
    if (dob !== undefined) user.details.dob = dob;
    if (phone !== undefined) user.details.phone = phone;
    if (address !== undefined) user.details.address = address;
    if (city !== undefined) user.details.city = city;
    if (state !== undefined) user.details.state = state;
    if (zip !== undefined) user.details.zip = zip;
    if (bio !== undefined) user.details.bio = bio;
    // Always save estimatedRate (even if empty string or undefined)
    user.details.estimatedRate = estimatedRate !== undefined ? estimatedRate : '';
    if (niche !== undefined) user.details.niche = niche;

    // Initialize socials if it doesn't exist
    if (!user.details.socials) {
      user.details.socials = {};
    }

    // Update Instagram
    if (!user.details.socials.instagram) {
      user.details.socials.instagram = {};
    }
    if (instagramUsername !== undefined) user.details.socials.instagram.username = instagramUsername;
    if (instagramFollowers !== undefined) user.details.socials.instagram.followers = instagramFollowers;

    // Update YouTube
    if (!user.details.socials.youtube) {
      user.details.socials.youtube = {};
    }
    if (youtubeChannel !== undefined) user.details.socials.youtube.channel = youtubeChannel;
    if (youtubeSubscribers !== undefined) user.details.socials.youtube.subscribers = youtubeSubscribers;

    // Update Facebook
    if (!user.details.socials.facebook) {
      user.details.socials.facebook = {};
    }
    if (facebookUsername !== undefined) user.details.socials.facebook.username = facebookUsername;
    if (facebookFollowers !== undefined) user.details.socials.facebook.followers = facebookFollowers;

    // Update Twitter
    if (!user.details.socials.twitter) {
      user.details.socials.twitter = {};
    }
    if (twitterUsername !== undefined) user.details.socials.twitter.username = twitterUsername;
    if (twitterFollowers !== undefined) user.details.socials.twitter.followers = twitterFollowers;

    // Mark the nested object as modified to ensure all changes are saved
    user.markModified('details');
    user.markModified('details.estimatedRate');
    user.markModified('details.socials');

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Mark profile as complete
    user.profileComplete = true;

    await user.save();

    // Return the saved user data including estimatedRate
    const savedUser = await User.findById(userId).lean();
    
    return NextResponse.json(
      { 
        message: "Profile saved successfully", 
        user: savedUser 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { message: "An error occurred while saving the profile" },
      { status: 500 }
    );
  }
}

