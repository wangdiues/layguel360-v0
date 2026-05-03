"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 600);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel: form */}
      <section className="flex flex-col items-center justify-center bg-card px-8 py-16 sm:px-16">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-10 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-border">
              <Image
                src="/logo.png"
                alt="ལས་འགུལ་360"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              ལས་འགུལ་360
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue to your workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="karma@example.bt"
                  className="pl-9 text-sm"
                  required
                />
              </div>
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
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full shadow-sm">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>

      {/* Right panel: brand showcase */}
      <section
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        }}
      >
        {/* Decorative elements */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-indigo-500/10 bg-indigo-500/5"
        />
        <div
          aria-hidden="true"
          className="absolute -left-16 bottom-16 h-72 w-72 rounded-full border border-indigo-400/10 bg-indigo-400/5"
        />
        <div
          aria-hidden="true"
          className="absolute right-20 bottom-40 h-48 w-48 rounded-full border border-violet-500/10 bg-violet-500/5"
        />

        <div className="relative z-10 flex h-full flex-col justify-between px-14 py-16">
          <div>
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Project Intelligence Platform
            </p>

            <h2 className="max-w-xs text-5xl font-bold leading-[1.1] tracking-tight text-white">
              One platform.
              <br />
              <span className="text-indigo-400">Every</span> project.
              <br />
              Full clarity.
            </h2>

            <div className="my-10 h-px w-12 bg-white/10" />

            <ul className="space-y-4">
              {[
                "Track projects end to end",
                "Manage tasks and deadlines",
                "Coordinate teams with ease",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span className="text-base leading-snug text-slate-400">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-wide text-slate-600">
            ལས་འགུལ་360 &mdash; Version 0 &bull; Static Preview
          </p>
        </div>
      </section>
    </main>
  );
}
