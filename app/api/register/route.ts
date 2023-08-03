import db from "@/db/index";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SignJWT } from "jose";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { username, fullName, email, password } = await request.json();

    const response = await db
      .insert(users)
      .values({
        email,
        password: sql`crypt(${password}, gen_salt('bf'))`,
        fullName,
        username,
      })
      .returning();

    if (!response.length) {
      return new Response(JSON.stringify({ error: "Unable to create user" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const user = response[0];

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

    const token = new SignJWT(user)
      .setIssuedAt()
      .setSubject(user.id)
      .setExpirationTime("2h")
      .sign(secret);

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Set-Cookie": `token=${token}`,
      },
    });
  } catch (e) {
    console.log(e);
    const error = e as Error;
    return new Response(error.message, {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
