import { checkSignedIn } from "@/helpers/session";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Page() {
  const payload = await checkSignedIn();

  if (!payload) redirect("/login");

  return <main></main>;
}
