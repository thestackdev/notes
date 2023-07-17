import { getCollections } from "@/database/notes";

export async function GET(request: Request) {
  try {
    const response = await getCollections("1");
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
