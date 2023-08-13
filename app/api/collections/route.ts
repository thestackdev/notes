import db from "@/db/index";
import { collections } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value!;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const response = await db
      .select({
        id: collections.id,
        label: collections.label,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
      })
      .from(collections)
      .where(eq(collections.userId, payload.sub!));

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

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value!;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const data = await request.json();

    const response = await db
      .insert(collections)
      .values({
        label: data.label,
        userId: payload.sub!,
      })
      .returning();

    if (!response.length) throw new Error("Error creating collection");

    return new Response(JSON.stringify(response[0]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    const error = e as Error;
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value!;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    if (!id) throw new Error("No id provided");

    await db
      .delete(collections)
      .where(and(eq(collections.id, id), eq(collections.userId, payload.sub!)));

    return new Response("Ok", {
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
