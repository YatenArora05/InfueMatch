import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["brand", "influencer", "admin"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    /** When true, next successful login may send the welcome email (signup sets false after account creation). */
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Placeholders for future profile data from your onboarding forms
    profileComplete: { type: Boolean, default: false },
    details: {
      firstName: String,
      lastName: String,
      gender: String,
      dob: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      profilePic: String,
      bio: String,
      estimatedRate: String,
      socials: {
        instagram: {
          username: String,
          followers: String,
        },
        youtube: {
          channel: String,
          subscribers: String,
        },
        facebook: {
          username: String,
          followers: String,
        },
        twitter: {
          username: String,
          followers: String,
        },
      },
      niche: [String],
    },
    // Fields used for password reset flow
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    /** Brand users: influencer User ids saved for later (shortlist). */
    savedInfluencerIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;