import nextauthOptions from "@/lib/nextauth";
import NextAuth from "next-auth";

console.log(process.env.NEXTAUTH_URL);

const handler = NextAuth(nextauthOptions);

export { handler as GET, handler as POST };
