import sql from "@/database";
import nextauthOptions from "@/lib/nextauth";
import { Collection, Data } from "@/types/database";
import { getServerSession } from "next-auth";

export const config = {
  runtime: "edge",
  unstable_allowDynamic: [],
};

export async function GET(request: Request) {
  try {
    const session = await getServerSession(nextauthOptions);
    const user = session?.user;

    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");

    const response = await sql<Collection[]>`
    SELECT * 
    FROM "notes".data
    WHERE user_id = ${user?.id!} AND collection_id = ${id}
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

    const response = await sql<Data[]>`
    INSERT INTO "notes".data
    (content, user_id, collection_id)
    VALUES
    (${data.content}, ${user?.id!}, ${data.collection_id})
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

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(nextauthOptions);
    const user = session?.user;

    const data = await request.json();

    const response = await sql<Data[]>`
        UPDATE "notes".data
        SET is_done = ${data.is_done}
        WHERE id = ${data.id} AND user_id = ${user?.id!}
        RETURNING *
        `;

    sql.CLOSE;

    if (!response.length) throw new Error("Error updating data");

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

    const response = await sql<Data[]>`
        DELETE FROM "notes".data
        WHERE id = ${id} AND user_id = ${user?.id!}
        RETURNING *
        `;

    sql.CLOSE;

    if (!response.length) throw new Error("Error deleting data");

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
