import mongoose, { Schema, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["collaboration_request"],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    brandName: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;

