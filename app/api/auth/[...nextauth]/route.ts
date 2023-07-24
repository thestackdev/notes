import nextauthOptions from "@/lib/nextauth";
import NextAuth from "next-auth";

const handler = NextAuth(nextauthOptions);

export { handler as GET, handler as POST };
