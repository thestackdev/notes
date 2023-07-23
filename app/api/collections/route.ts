import sql from "@/database";
import nextauthOptions from "@/lib/nextauth";
import { Collection } from "@/types/database";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(nextauthOptions);
    const user = session?.user;

    const response = await sql<Collection[]>`
    SELECT * 
    FROM "notes".collections
    WHERE user_id = ${user?.id!}
    ORDER BY created_at DESC
    `;

    sql.CLOSE;

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "content-type": "application/json" },
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(nextauthOptions);
    const user = session?.user;

    const data = await request.json();

    const response = await sql<Collection[]>`
    INSERT INTO "notes".collections
    (label, user_id)
    VALUES
    (${data.label}, ${user?.id!})
    RETURNING *
    `;

    sql.CLOSE;

    if (!response.length) throw new Error("Error creating collection");

    return new Response(JSON.stringify(response[0]), {
      status: 200,
      headers: { "content-type": "application/json" },
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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(nextauthOptions);
    const user = session?.user;

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    await sql<Collection[]>`
        DELETE FROM "notes".collections
        WHERE id = ${id}
        AND user_id = ${user?.id!}
    `;

    return new Response("Ok", {
      status: 200,
      headers: { "content-type": "application/json" },
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
