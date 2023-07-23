import nextauthOptions from "@/lib/nextauth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextauthOptions);

  if (session) redirect("/");

  return <main className="flex flex-grow">{children}</main>;
}
