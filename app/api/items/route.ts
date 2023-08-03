import db from "@/db";
import { items } from "@/db/schema";
import { checkSignedIn } from "@/helpers/session";
import { and, desc, eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const payload = await checkSignedIn();

    if (!payload) throw new Error("Unauthorized");

    const searchParams = new URL(request.url).searchParams;
    const collection_id = searchParams.get("collection_id");

    const response = await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.collection_id, collection_id!),
          eq(items.user_id, payload.sub!)
        )
      )
      .orderBy(desc(items.createdAt));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    const error = e as Error;

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await checkSignedIn();

    if (!payload) throw new Error("Unauthorized");

    const data = await request.json();

    const response = await db
      .insert(items)
      .values({
        content: data.content,
        user_id: payload.sub!,
        collection_id: data.collection_id,
      })
      .returning();

    if (!response.length) throw new Error("Error creating collection");

    const item = response[0];

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    const error = e as Error;

    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await checkSignedIn();

    if (!payload) throw new Error("Unauthorized");

    const data = await request.json();

    const response = await db
      .update(items)
      .set({
        is_done: data.is_done,
      })
      .where(and(eq(items.id, data.id), eq(items.user_id, payload.sub!)))
      .returning();

    if (!response.length) throw new Error("Error updating data");

    const item = response[0];

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    const error = e as Error;

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await checkSignedIn();

    if (!payload) throw new Error("Unauthorized");

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    const response = await db
      .delete(items)
      .where(and(eq(items.id, id!), eq(items.user_id, payload.sub!)))
      .returning();

    if (!response.length) throw new Error("Cannot delete item");

    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (e) {
    const error = e as Error;

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
