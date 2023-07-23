import { getUserById, login, register } from "@/database/auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const nextauthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const {
          email,
          password,
          username,
          display_name,
          isNewUser = false,
        } = req.body!;

        if (isNewUser) {
          const response = await register(
            email!,
            password!,
            username,
            display_name
          );
          return response;
        }

        const response = await login(
          credentials?.email!,
          credentials?.password!
        );
        return response;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      const response = await getUserById(session.user?.email!);

      session.user = response!;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
};

export default nextauthOptions;
