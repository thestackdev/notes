import db from "@/db/index";
import { collections } from "@/db/schema";
import { checkSignedIn } from "@/helpers/session";
import { and, eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const session = await checkSignedIn();

    if (!session) return new Response("You are not signed in", { status: 401 });

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    const [response] = await db
      .select()
      .from(collections)
      .where(
        and(eq(collections.userId, session.sub!), eq(collections.id, id!))
      );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    const error = e as Error;

    return new Response(error.message, {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value!;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const data = await request.json();

    const [response] = await db
      .update(collections)
      .set({ content: data.content })
      .where(
        and(eq(collections.userId, payload.sub!), eq(collections.id, data.id!))
      )
      .returning();

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    const error = e as Error;

    return new Response(error.message, {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
