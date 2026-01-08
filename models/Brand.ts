import mongoose, { Schema, models } from "mongoose";

const BrandSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    bio: {
      type: String,
      required: true,
    },
    budgetRange: {
      type: String,
    },
    targetAudience: {
      type: String,
    },
    totalCampaigns: {
      type: String,
    },
    activeInfluencers: {
      type: String,
    },
    totalReach: {
      type: String,
    },
    totalSpend: {
      type: String,
    },
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
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Brand = models.Brand || mongoose.model("Brand", BrandSchema);
export default Brand;

