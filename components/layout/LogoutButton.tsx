"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
      <Link href="/login">
        <LogOut className="h-4 w-4" />
      </Link>
    </Button>
  );
}
