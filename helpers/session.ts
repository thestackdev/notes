import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function checkSignedIn() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value!;

  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const { payload } = await jwtVerify(token, secret);

  return payload;
}
