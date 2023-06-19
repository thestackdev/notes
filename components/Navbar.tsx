import { ThemeToggle } from "@/app/theme-toggle";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

export default function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex flex-row w-full items-center justify-between py-2 px-6 h-16 space-x-4 mx-auto max-w-[1200px] lg:space-x-6",
        className
      )}
      {...props}
    >
      <span className="flex gap-2 justify-center items-center">
        <Terminal className="w-6  h-6" />
        <h1 className="text-xl font-semibold tracking-tight transition-colors">
          Codefusionz
        </h1>
      </span>
      <ThemeToggle />
    </nav>
  );
}
