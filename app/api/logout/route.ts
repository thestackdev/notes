export const runtime = "edge";

export function POST(request: Request) {
  return new Response("Ok", {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Set-Cookie": "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
  });
}
