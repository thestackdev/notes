"use client";

import { ThemeToggle } from "@/app/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface NavbarProps {
  session?: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter();

  return (
    <nav
      className={cn(
        "flex flex-row w-full items-center justify-between py-2 px-6 h-16 space-x-4 mx-auto max-w-[1200px] lg:space-x-6"
      )}
    >
      <span className="flex gap-2 justify-center items-center">
        <Terminal className="w-6 h-6" />
        <h1 className="text-xl font-semibold tracking-tight transition-colors">
          Codefusionz
        </h1>
      </span>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={async () => {
                  // await supabase.auth.signOut();
                  // router.replace("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
