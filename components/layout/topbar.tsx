import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { mockUser } from "@/lib/mock-data";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold">ལས་འགུལ་360</h2>
        <p className="text-sm text-muted-foreground">Project management dashboard</p>
      </div>

      <div className="flex items-center gap-3">
        <Input placeholder="Search..." className="hidden w-64 md:block" />
        <Link href="/profile">
          <Avatar>
            <AvatarFallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">
              {mockUser.initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
