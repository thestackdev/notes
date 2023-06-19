import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/Toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";
import AppwriteProvider from "@/providers/appwrite-provider";

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
  return (
    <html lang="en">
      <body
        className={cn(`
          ${inter.className} bg-background min-h-screen w-full font-sans antialiased`)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppwriteProvider>
            <div className="flex flex-col h-screen">
              <Navbar />
              <Separator />
              <div className="flex flex-grow">{children}</div>
            </div>
          </AppwriteProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
