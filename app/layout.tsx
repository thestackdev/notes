import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/Toaster";
import { Separator } from "@/components/ui/separator";
import { supabaseServer } from "@/lib/supabase-server";
import { cn } from "@/lib/utils";
import SupabaseProvider from "@/providers/supabase-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todo App",
  description: "Manage your tasks with Todo App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body
        className={cn(`
          ${inter.className} bg-background min-h-screen w-full font-sans antialiased`)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider session={session}>
            <div className="flex flex-col h-screen">
              <Navbar />
              <Separator />
              <div className="flex flex-grow">{children}</div>
            </div>
          </SupabaseProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
