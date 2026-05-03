import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { mockUser } from "@/lib/mock-data";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 backdrop-blur-sm">
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Right: search + actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search projects, tasks..."
            className="h-9 w-60 rounded-lg border-slate-200 bg-slate-50 pl-9 text-sm transition-all focus:border-indigo-300 focus:bg-white focus:ring-indigo-200/60"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-slate-200" />

        {/* User */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-indigo-600 text-xs font-bold text-white">
              {mockUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-800">
              {mockUser.name}
            </p>
            <p className="text-[11px] leading-tight text-slate-500">
              {mockUser.role}
            </p>
          </div>
        </Link>

        <LogoutButton />
      </div>
    </header>
  );
}
