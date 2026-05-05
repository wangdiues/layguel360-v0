import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonClasses =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Compass className="h-6 w-6" />
        </div>
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            href="/dashboard"
            className={cn(buttonClasses, "bg-primary text-primary-foreground hover:bg-primary/90")}
          >
            Go to dashboard
          </Link>
          <Link
            href="/projects"
            className={cn(
              buttonClasses,
              "border border-border bg-background hover:bg-muted hover:text-foreground"
            )}
          >
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
