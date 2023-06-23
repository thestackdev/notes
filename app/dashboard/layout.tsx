import Sidebar from "@/components/Sidebar";
import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/");

  return (
    <main className="w-full h-full flex">
      <Sidebar />
      {children}
    </main>
  );
}
