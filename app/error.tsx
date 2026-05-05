"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonClasses =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Phase 7 will replace this with Sentry capture.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. You can try again, or head back to the dashboard.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className={cn(buttonClasses, "bg-primary text-primary-foreground hover:bg-primary/90")}
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className={cn(
              buttonClasses,
              "border border-border bg-background hover:bg-muted hover:text-foreground"
            )}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
