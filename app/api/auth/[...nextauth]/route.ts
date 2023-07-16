import { login, register } from "@/database/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const OPTIONS: NextAuthOptions = {
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
