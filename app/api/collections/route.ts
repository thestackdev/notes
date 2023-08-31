import db from "@/db/index";
import { collections } from "@/db/schema";
import { checkSignedIn } from "@/helpers/session";
import { and, eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const session = await checkSignedIn();

    if (!session) return new Response("You are not signed in", { status: 401 });

    const response = await db
      .select({
        id: collections.id,
        label: collections.label,
        createdAt: collections.createdAt,
        updatedAt: collections.updatedAt,
      })
      .from(collections)
      .where(eq(collections.userId, session.sub!));

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
    const session = await checkSignedIn();

    if (!session) return new Response("You are not signed in", { status: 401 });

    const data = await request.json();

    const response = await db
      .insert(collections)
      .values({
        label: data.label,
        userId: session.sub!,
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
    const session = await checkSignedIn();

    if (!session) return new Response("You are not signed in", { status: 401 });

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    if (!id) throw new Error("No id provided");

    await db
      .delete(collections)
      .where(and(eq(collections.id, id), eq(collections.userId, session.sub!)));

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
