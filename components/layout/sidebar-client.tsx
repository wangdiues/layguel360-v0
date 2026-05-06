"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  User,
  Menu,
  LogOut,
} from "lucide-react";

import { signOut } from "@/app/login/actions";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

type UserDisplay = {
  name: string;
  role: string;
  initials: string;
};

function NavContent({
  user,
  onLinkClick,
}: {
  user: UserDisplay;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-white/[0.07] bg-black/50 backdrop-blur-xl">
      {/* Brand */}
      <div className="border-b border-white/[0.07] px-5 py-[18px]">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src="/logo.png" alt="ལས་འགུལ་360" fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight tracking-tight text-foreground">
              ལས་འགུལ་360
            </p>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-muted-foreground">
              Project Management
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Main Menu
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {item.name}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.07] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/25">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">
              {user.role}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              onClick={onLinkClick}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="sr-only">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SidebarClient({ user }: { user: UserDisplay }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 shadow-sm backdrop-blur-md lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4 text-foreground" />
      </button>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0 [&>button]:hidden">
          <NavContent user={user} onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <NavContent user={user} />
      </aside>
    </>
  );
}
