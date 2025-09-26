import connectDB from "@/config/database";
import User from "@/models/User";

import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful signin
    async signIn({ profile }) {
      try {
        await connectDB();

        if (!profile?.email) return false;

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const username = (profile.name || profile.email).slice(0, 20);
          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("signIn callback error:", error);
        return false;
      }
    },
    // Modifies the session object
    async session({ session }) {
      try {
        await connectDB();

        if (!session?.user?.email) return session;

        const user = await User.findOne({ email: session.user.email });
        if (user?._id) {
          session.user.id = user._id.toString();
        }
        return session;
      } catch (error) {
        console.error("session callback error:", error);
        return session;
      }
    },
  },
};
