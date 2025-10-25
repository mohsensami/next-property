import connectDB from "@/config/database";
import User from "@/models/User";

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
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const { data: existingAccount } =
            await api.accounts.getByProvider(email);
          if (!existingAccount) return null;
          const { data: existingUser } = await api.users.getById(
            existingAccount.userId.toString(),
          );
          if (!existingUser) return null;
          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password,
          );
          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
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
