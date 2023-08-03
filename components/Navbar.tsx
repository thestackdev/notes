"use client";

import { ThemeToggle } from "@/app/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUtils from "@/hooks/useUtils";
import { cn } from "@/lib/utils";
import { MenuIcon, Terminal } from "lucide-react";
import { Separator } from "./ui/separator";

interface NavbarProps {
  session?: any | null;
}

export default function Navbar({ session }: NavbarProps) {
  const { toggle } = useUtils();

  async function handleSignOut() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  if (!session) return null;

  return (
    <>
      <div className="flex flex-row items-center mx-10">
        <MenuIcon
          className="w-6 h-6 lg:hidden cursor-pointer"
          onClick={toggle}
        />
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
                      alt="Avatar"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </div>
      <Separator />
    </>
  );
}
