"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import { signIn } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result.ok === false) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      router.push(result.data.redirectTo);
      router.refresh();
    });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel: form */}
      <section className="flex flex-col items-center justify-center bg-card px-8 py-16 sm:px-16">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-10 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-border">
              <Image src="/logo.png" alt="ལས་འགུལ་360" fill className="object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">ལས་འགུལ་360</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue to your workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <input type="hidden" name="next" value={next} />

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="karma@example.bt"
                  className="bg-background pl-9 text-sm"
                  autoComplete="email"
                  required
                />
              </div>
              {fieldErrors.email?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-background pl-9 text-sm"
                  autoComplete="current-password"
                  required
                />
              </div>
              {fieldErrors.password?.[0] && (
                <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-primary/80">
              Create one
            </Link>
          </p>
        </div>
      </section>

      {/* Right panel: brand showcase */}
      <section
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
        style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0f1014 50%, #13131a 100%)" }}
      >
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full border border-primary/5 bg-primary/[0.02]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-10 bottom-10 h-64 w-64 rounded-full border border-primary/10 bg-primary/[0.03]"
        />

        <div className="relative z-10 flex h-full flex-col justify-between px-14 py-16">
          <div>
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Project Intelligence Platform
            </p>

            <h2 className="max-w-xs text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
              One platform.
              <br />
              <span className="text-primary">Every</span> project.
              <br />
              Full clarity.
            </h2>

            <div className="my-10 h-px w-12 bg-border" />

            <ul className="space-y-4">
              {[
                "Track projects end to end",
                "Manage tasks and deadlines",
                "Coordinate teams with ease",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-base leading-snug text-muted-foreground">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-wide text-muted-foreground">ལས་འགུལ་360</p>
        </div>
      </section>
    </main>
  );
}
