import { checkSignedIn } from "@/helpers/session";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const runtime = "edge";

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const payload = await checkSignedIn();

  if (payload) redirect("/");

  return <main className="flex flex-grow">{children}</main>;
}
