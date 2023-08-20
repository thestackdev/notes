import db from "@/db/index";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SignJWT } from "jose";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await db
      .select()
      .from(users)
      .where(sql`email = ${email} AND password = crypt(${password}, password)`);

    if (!response.length) {
      return new Response(
        JSON.stringify({ error: "No user found with that email and password" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    const user = response[0];

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT(user)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setSubject(user.id)
      .setExpirationTime("365d")
      .sign(secret);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Set-Cookie": `token=${token};Path=/`,
      },
    });
  } catch (e) {
    const error = e as Error;
    return new Response(error.message, {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
