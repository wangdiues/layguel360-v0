import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getCurrentUserDisplay } from "@/lib/supabase/queries.server";

export async function Topbar() {
  const user = (await getCurrentUserDisplay()) ?? {
    name: "Account",
    role: "Member",
    email: "",
    initials: "?",
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/[0.08] bg-white/[0.04] px-6 backdrop-blur-md">
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Right: search + actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, tasks..."
            className="h-9 w-60 rounded-lg border-white/[0.08] bg-white/[0.04] pl-9 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-transparent" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* User */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
        >
          <Avatar className="h-8 w-8 ring-2 ring-white/10">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-foreground">{user.name}</p>
            <p className="text-[11px] leading-tight text-muted-foreground">{user.role}</p>
          </div>
        </Link>

        <LogoutButton />
      </div>
    </header>
  );
}
