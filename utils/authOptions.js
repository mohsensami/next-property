import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    // ---- Google Provider ----
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

    // ---- GitHub Provider ----
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // scope اضافه می‌کنیم که مطمئن بشیم ایمیل برمی‌گرده
      authorization: { params: { scope: "read:user user:email" } },
    }),
    Credentials({
      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
          return null;
        }

        // Check if user has a password (OAuth users might not have one)
        if (!user.password) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    // Invoked on successful signin
    async signIn({ profile, account }) {
      await connectDB();

      // ---- Google profile ----
      if (account.provider === "google") {
        if (!profile?.email) return false;

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const username = profile.name.slice(0, 20);

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
            // OAuth users don't need a password
          });
        }
      }

      // ---- GitHub profile ----
      if (account.provider === "github") {
        if (!profile?.email) {
          console.error("GitHub profile has no email");
          return false;
        }

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const username = (profile.name || profile.login).slice(0, 20);

          await User.create({
            email: profile.email,
            username,
            image: profile.avatar_url,
            // OAuth users don't need a password
          });
        }
      }

      return true;
    },

    // Modifies the session object
    async session({ session }) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
      }
      return session;
    },
  },
};
