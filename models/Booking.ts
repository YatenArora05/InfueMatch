import mongoose, { Schema, models } from "mongoose";

const BookingSchema = new Schema(
  {
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    campaignName: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    postingDate: {
      type: Date,
      required: true,
    },
    agreedRate: {
      type: Number,
      required: false,
      default: 0,
    },
    notes: {
      type: String,
    },
    assetLink: {
      type: String,
    },
  },
  { timestamps: true }
);

const Booking = models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;


