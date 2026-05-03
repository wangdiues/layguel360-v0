"use client";

import Link from "next/link";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col" style={{ background: "#0B0F1A" }}>
      {/* Brand */}
      <div className="border-b border-white/[0.05] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/40">
            <FolderKanban className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight tracking-tight text-white">
              ལས་འགུལ་360
            </p>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-slate-500">
              Project Management
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Main Menu
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/60"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                {item.name}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600/15 text-xs font-bold text-indigo-400 ring-1 ring-indigo-600/20">
            {mockUser.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-slate-200">
              {mockUser.name}
            </p>
            <p className="mt-0.5 truncate text-[11px] leading-tight text-slate-500">
              {mockUser.role}
            </p>
          </div>
          <Link
            href="/login"
            onClick={onLinkClick}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.06] hover:text-slate-400"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-xl shadow-lg lg:hidden"
        style={{ background: "#0B0F1A" }}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4 text-white" />
      </button>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0 border-0 [&>button]:hidden"
        >
          <NavContent onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 shadow-2xl lg:block">
        <NavContent />
      </aside>
    </>
  );
}
