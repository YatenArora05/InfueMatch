import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { scheduleFirstLoginWelcome } from "@/lib/welcome-email";

const authOptions = {
  providers: [
    // 1. Google Login Support
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 2. Email/Password Login Support (for your custom Signup form)
    CredentialsProvider({
      name: "credentials",
      credentials: {}, // NextAuth handles the UI; we handle the logic below
      async authorize(credentials: any) {
        const { email, password } = credentials;
        try {
          await connectMongoDB(); // Connect to your DB
          const user = await User.findOne({ email }); // Find the user in your DB

          if (!user) return null; // User doesn't exist

          // Check if user is blocked
          if (user.isBlocked) {
            throw new Error("Your account has been banned from this website. Please contact support for assistance.");
          }

          // Verify the hashed password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null; // Incorrect password

          return user; // Successfully authenticated
        } catch (error) {
          console.log("Login Error: ", error);
          // Re-throw blocked user error
          if (error instanceof Error && error.message.includes("banned")) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn({
      user,
    }: {
      user: { id?: string; email?: string | null; _id?: unknown };
    }) {
      try {
        await connectMongoDB();
        let dbUser = null as InstanceType<typeof User> | null;
        if (user?.id && mongoose.Types.ObjectId.isValid(user.id)) {
          dbUser = await User.findById(user.id);
        }
        if (!dbUser && user?.email) {
          dbUser = await User.findOne({ email: user.email });
        }
        if (dbUser?._id) {
          scheduleFirstLoginWelcome(dbUser._id);
        }
      } catch (e) {
        console.error("[welcome-email] nextauth signIn:", e);
      }
    },
  },
  callbacks: {
    async signIn({ user, account }: any) {
      try {
        await connectMongoDB();

        if (account?.provider !== "google") {
          return true;
        }

        if (!user?.email) {
          return false;
        }

        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Store a random hash for OAuth accounts; password login still won't work without reset flow.
          const oauthPasswordHash = await bcrypt.hash(
            `oauth:${user.email}:${randomUUID()}`,
            10
          );
          const fallbackName = String(user.name || user.email.split("@")[0]).trim();
          existingUser = await User.create({
            name: fallbackName || "User",
            email: user.email,
            role: "influencer",
            password: oauthPasswordHash,
            isFirstLogin: true,
          });
        }

        if (existingUser.isBlocked) {
          return false;
        }

        return true;
      } catch (error) {
        console.error("Google SignIn Error:", error);
        return false;
      }
    },
  
    async jwt({ token, user }: any) {
      if (user) {
        await connectMongoDB();
    
        const dbUser = await User.findOne({ email: user.email });
    
        if (dbUser) {
          token.id = dbUser._id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
  
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const, // Use JSON Web Tokens for session management
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirect users to your custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };