import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/Toaster";
import { Separator } from "@/components/ui/separator";
import nextauthOptions from "@/lib/nextauth";
import { cn } from "@/lib/utils";
import { NextAuthProvider } from "@/providers/nextauth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getServerSession } from "next-auth/next";
import "./globals.css";

export const metadata = {
  title: "Todo App",
  description: "Manage your tasks with Todo App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextauthOptions);

  return (
    <html lang="en">
      <body
        className={cn(
          `bg-background min-h-screen w-full font-sans antialiased`
        )}
      >
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextAuthProvider>
              <div className="flex flex-col h-screen">
                <Navbar session={session} />
                <Separator />
                <div className="flex flex-grow relative">
                  {session && (
                    <Sidebar className="absolute left-0 top-0 lg:flex" />
                  )}
                  {children}
                </div>
              </div>
            </NextAuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
