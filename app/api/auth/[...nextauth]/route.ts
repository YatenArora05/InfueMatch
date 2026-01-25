import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

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
  callbacks: {
    // This runs when the JWT is created/updated
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role; // Store the role (brand/influencer) in the token
        token.id = user._id;
      }
      return token;
    },
    // This makes the role available in the frontend session
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
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