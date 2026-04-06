import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/mailer";
import mongoose from "mongoose";

/**
 * If the user still has isFirstLogin, claim it and send welcome (non-blocking).
 * Restores isFirstLogin on send failure so the next login can retry.
 */
export function scheduleFirstLoginWelcome(userId: mongoose.Types.ObjectId | string) {
  void (async () => {
    try {
      await connectMongoDB();
      const claimed = await User.findOneAndUpdate(
        { _id: userId, isFirstLogin: true },
        { $set: { isFirstLogin: false } },
        { new: true }
      );
      if (!claimed) return;
      await sendWelcomeEmail(claimed.email, claimed.name);
    } catch (err) {
      console.error("[welcome-email] first-login:", err);
      try {
        await connectMongoDB();
        await User.updateOne({ _id: userId }, { $set: { isFirstLogin: true } });
      } catch {
        /* ignore */
      }
    }
  })();
}
