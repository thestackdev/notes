import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/Toaster";
import { checkSignedIn } from "@/helpers/session";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

export const runtime = "edge";

export const metadata = {
  title: "Todo App",
  description: "Manage your tasks with Todo App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await checkSignedIn();

  return (
    <html lang="en">
      <body
        className={cn(
          `bg-background min-h-screen w-full font-sans antialiased`
        )}
      >
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col h-screen">
              <Navbar session={payload} />
              <div className="flex flex-grow relative">
                {payload && (
                  <Sidebar className="absolute left-0 top-0 lg:flex" />
                )}
                {children}
              </div>
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
