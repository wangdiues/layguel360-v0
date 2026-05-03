"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Link href="/login" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      <LogOut className="h-4 w-4" />
    </Link>
  );
}
