import { checkSignedIn } from "@/helpers/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const payload = await checkSignedIn();

  if (!payload) redirect("/login");

  return <main></main>;
}
